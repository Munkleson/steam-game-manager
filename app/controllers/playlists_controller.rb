class PlaylistsController < ApplicationController
  def playlists_main_page
    user_id = 1
    user = User.find(user_id)

    # Also an ERB variable, but needs to be above the one below
    @playlists = user.playlists
    starting_playlist = @playlists.order(:order).first

    if !starting_playlist.nil?
      # ERB variables
      @starting_playlist_owned_games = starting_playlist.owned_games # Games in current playlist
      @owned_games = user.owned_games.reject { |game| @starting_playlist_owned_games.include?(game) }.sort_by { |game| game[:order] } # Games in add games to playlist list
    else
      @starting_playlist_owned_games = []
      @owned_games = user.owned_games
    end
  end

  def create_playlist
    user_id = 1
    user = User.find(user_id)

    playlists = user.playlists

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
    user_id = 1
    user = User.find(user_id)

    owned_game_id = params[:owned_game_id]
    game = user.owned_games.find(owned_game_id)
    begin
      playlist = user.playlists.find_by!("id = ?", params[:playlist_id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "!playlist", message: "what?" }, status: :not_found
      return
    end
    current_playlist_owned_games = playlist.owned_games

    if game.user_id != user_id
      render json: { error: "unsuccessful" }, status: :unprocessable_entity
      return
    end

    if !current_playlist_owned_games.exists?(owned_game_id)
      new_playlist_game = playlist.playlist_games.new({ owned_game_id: owned_game_id, order: current_playlist_owned_games.count + 1 })
      if new_playlist_game.save
        render json: { message: "success", ok: true, id: new_playlist_game.id }, status: :created
      else
        render json: { error: new_playlist_game.errors.full_messages, message: "unsuccessful" }, status: :unprocessable_entity
      end
    else
      render json: { error: "taken" }
    end
  end

  def refresh_playlists
    user_id = 1

    user = User.find(user_id)
    playlist = user.playlists.find(params[:playlist_id])

    if playlist.user_id != user_id
      render json: { error: "unsuccessful" }, status: :unprocessable_entity
      return
    end

    if !playlist.nil?
      # ERB variables
      @playlist_games = playlist.owned_games # Games in current playlist
      @owned_games = user.owned_games.reject { |game| @playlist_games.include?(game) }.sort_by { |game| game[:order] } # Games in add games to playlist list
      render json: { playlist_games: @playlist_games, owned_games: @owned_games, ok: true }
    else
      @playlist_games = []
      @owned_games = user.owned_games.sort_by { |game| game[:order] }
      render json: { playlist_games: @playlist_games, owned_games: @owned_games, ok: true  }
    end
  end

  def remove_game_from_playlist
    user_id = 1
    playlist = Playlist.find(params[:playlist_id])

    if playlist.user_id != user_id
      render json: { error: "unsuccessful" }, status: :unprocessable_entity
      return
    end

    playlist_game_to_delete = playlist.playlist_games.find_by(owned_game_id: params[:id])
    if playlist_game_to_delete.destroy
      render json: { message: "success", ok: true }
    else
      render json: { message: "failure" }
    end
  end
end
