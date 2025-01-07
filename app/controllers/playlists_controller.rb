class PlaylistsController < ApplicationController
  def playlists_main_page
    # Also an ERB variable, but needs to be above the one below
    @playlists = @user.playlists.order(:order)
    starting_playlist = @playlists.first
    @games_count = @playlists.map { |playlist| playlist.playlist_games.count }
    owned_games = @user.owned_games

    if !starting_playlist.nil?
      # Both below work
      # @starting_playlist_games = starting_playlist.playlist_games.sort_by { |playlist_game| playlist_game.order }.map { |playlist_game| playlist_game.owned_game }
      @starting_playlist_games = owned_games.joins(:playlist_games).where("playlist_games.playlist_id = ?", starting_playlist.id).order('playlist_games."order" ASC')
      @owned_games = @user.owned_games.reject { |game| @starting_playlist_games.include?(game) }.sort_by { |game| game[:order] } # Games in add games to playlist list
    else
      @starting_playlist_games = []
      @owned_games = @user.owned_games
    end

    @progress_type = ["completed", "played"]
    @playlists_stats = playlist_rates(@playlists)
  end

  def create_playlist
    playlists = @user.playlists

    if playlists.where("LOWER(name) = ?", params[:name].downcase).exists?
      render json: { message: "exists" }, status: :conflict
      return
    end
    new_playlist = playlists.new({ name: params[:name], order: playlists.count + 1 })
    if new_playlist.save
      render json: { message: "success", id: new_playlist.id }, status: :created
    else
      render json: { error: new_playlist.errors.full_messages, message: "unsuccessful" }, status: :unprocessable_entity
    end
  end

  def add_game_to_playlist
    owned_game_id = params[:owned_game_id]
    owned_game = @user.owned_games.find(owned_game_id)
    begin
      playlist = @user.playlists.find_by!("id = ?", params[:playlist_id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "!playlist", message: "what?" }, status: :not_found
      return
    end
    current_playlist_owned_games = playlist.owned_games

    if owned_game.user_id != @user_id
      render json: { error: "unsuccessful" }, status: :unprocessable_entity
      return
    end

    if !current_playlist_owned_games.exists?(owned_game_id)
      new_playlist_game = playlist.playlist_games.new({ owned_game_id: owned_game_id, order: current_playlist_owned_games.count + 1 })

      if new_playlist_game.save
        render json: { message: "success", ok: true, id: new_playlist_game.id, completed: owned_game[:completed], played: owned_game[:played] }, status: :created
      else
        render json: { error: new_playlist_game.errors.full_messages, message: "unsuccessful" }, status: :unprocessable_entity
      end
    else
      render json: { error: "taken" }
    end
  end

  def refresh_playlists
    unless @user.playlists.find_by(id: params[:playlist_id])
      render_empty_playlist
      return
    end

    playlist = @user.playlists.find(params[:playlist_id])
    if playlist.user_id != @user_id
      render json: { error: "unsuccessful" }, status: :unprocessable_entity
      return
    end

    owned_games = @user.owned_games

    if !playlist.nil?
      # ERB variables
      @playlist_games = owned_games.joins(:playlist_games).where("playlist_games.playlist_id = ?", playlist.id).order('playlist_games."order" ASC') # Games in current playlist
      @owned_games = @user.owned_games.reject { |game| @playlist_games.include?(game) }.sort_by { |game| game[:order] } # Games in add games to playlist list
      render json: { playlist_games: @playlist_games, owned_games: @owned_games, ok: true }
    else
      render_empty_playlist
    end

    def render_empty_playlist
      @playlist_games = []
      @owned_games = @user.owned_games.sort_by { |game| game[:order] }
      render json: { playlist_games: @playlist_games, owned_games: @owned_games, ok: true  }
    end
  end

  def remove_game_from_playlist
    playlist = Playlist.find(params[:playlist_id])

    if playlist.user_id != @user_id
      render json: { error: "unsuccessful" }, status: :unprocessable_entity
      return
    end

    owned_game_order = playlist.owned_games.find_by(id: params[:id])&.order
    playlist_game_to_remove = playlist.playlist_games.find_by(owned_game_id: params[:id])

    puts "hi"
    puts owned_game_order
    puts playlist.playlist_games

    if playlist_game_to_remove.destroy
      render json: { message: "success", ok: true, owned_game_order: owned_game_order }
    else
      render json: { message: "failure" }
    end
  end

  def delete_playlist
    playlist = Playlist.find(params[:playlist_id])

    if playlist.user_id != @user_id
      render json: { error: "unsuccessful" }, status: :unprocessable_entity
      return
    end

    if playlist.destroy
      render json: { message: "success", ok: true }
    else
      render json: { message: "failure" }
    end

    update_playlist_order_after_deletion(@user_id)
  end

  def update_playlist_order_after_deletion(user_id)
    playlists = User.find(@user_id).playlists
    playlists.sort_by{ |game| game[:order] }.each_with_index do |playlist, index|
      playlist.update(order: index + 1)
    end
  end

  def update_playlist_order
    playlists = User.find(user_id).playlists

    response = { success: 0, failure: 0 }
    params[:playlists].each do |item|
      playlist = playlists.find(item["playlist_id"])
      # checking user id of the playlist is here for edge cases where a user inserted a playlist that wasn't theirs by modifying data attributes
      if playlist.user_id == @user_id && playlist.update({ order: item["order"] })
        response[:success] += 1
      else
        response[:failure] += 1
      end
    end
    render json: { result: response }
  end

  def update_playlist_games_order
    playlist = Playlist.find(params[:playlist_id])
    playlist_games = playlist.playlist_games

    response = { success: 0, failure: 0 }
    params[:playlist_games].each do |item|
      playlist_game = playlist_games.find_by(owned_game_id: item["playlist_game_id"])
      if playlist_game.owned_game.user_id == @user_id && playlist_game.update({ order: item["order"] })
        response[:success] += 1
      else
        response[:failure] += 1
      end
    end
    render json: { result: response }
  end

  private

  def playlist_rates(playlists)
    array_of_playlists_data = []
    playlists.each do |playlist|
      games_in_playlist = playlist.owned_games
      completed_rate = GameRateCalculator.calculate_rates(games_in_playlist, :completed)
      played_rate = GameRateCalculator.calculate_rates(games_in_playlist, :played)
      completed_rate = GameRateCalculator.format_rates(completed_rate)
      played_rate = GameRateCalculator.format_rates(played_rate)
      array_of_playlists_data << { number_of_games: games_in_playlist.count, completed: completed_rate, played: played_rate }
    end
    return array_of_playlists_data
  end
end
