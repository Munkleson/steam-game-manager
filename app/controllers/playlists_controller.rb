class PlaylistsController < ApplicationController
  # Named this way instead of index as it includes more than just playlists
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

  def create
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

  def refresh_playlists
    # Ends the method if no playlists exist as of this call
    unless @user.playlists.find_by(id: params[:playlist_id])
      render_empty_playlist
      return
    end

    playlist = @user.playlists.find(params[:playlist_id])
    if playlist.user != @user
      render json: { error: "unsuccessful" }, status: :unprocessable_entity
      return
    end

    @owned_games = @user.owned_games.includes(:game, :dlc)
    # ERB variables
    playlist_games = @owned_games.joins(:playlist_games).where("playlist_games.playlist_id = ?", playlist.id).order('playlist_games."order" ASC') # Games in current playlist
    owned_games = @owned_games.reject { |game| playlist_games.include?(game) }.sort_by { |game| game[:order] } # Games in add games to playlist list
    render json: { playlist_games: playlist_games.as_json(include: [:game, :dlc]), owned_games: owned_games.as_json(include: [:game, :dlc]), ok: true }
  end

  def destroy
    playlist = @user.playlists.find(params[:playlist_id])
    if playlist.user != @user
      render json: { error: "unsuccessful" }, status: :unprocessable_entity
      return
    end

    if playlist.destroy
      render json: { message: "success", ok: true }
    else
      render json: { message: "failure" }
    end
    update_playlist_order_after_deletion
  end

  def update_order
    playlists = @user.playlists
    response = { success: 0, failure: 0 }
    params[:playlists].each do |item|
      playlist = playlists.find(item["playlist_id"])
      if playlist.user == @user && playlist.update({ order: item["order"] })
        response[:success] += 1
      else
        response[:failure] += 1
      end
    end
    render json: { result: response }
  end

  private

  # resets the order value of playlists to start from 1 again, in the case that playlist with order 1 was deleted (or anything in between the first and last order). Ensures that any future created playlist does not get inserted at the wrong order
  def update_playlist_order_after_deletion
    @user.playlists.sort_by{ |playlist| playlist[:order] }.each_with_index do |playlist, index|
      playlist.update(order: index + 1)
    end
  end

  # playlist games section will be empty and the add games section will just be what is in the library
  def render_empty_playlist
    playlist_games = []
    owned_games = @user.owned_games.sort_by { |game| game[:order] }
    render json: { playlist_games: playlist_games, owned_games: owned_games.as_json(include: [:game, :dlc]), ok: true  }
  end

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
