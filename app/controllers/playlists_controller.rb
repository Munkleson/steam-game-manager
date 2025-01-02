class PlaylistsController < ApplicationController
  def playlists_main_page
    user_id = 1
    user = User.find(user_id)
    @playlists = user.playlists

    starting_playlist = @playlists.first
    @owned_games = user.owned_games
  end

  def create_playlist
    user_id = 1
    user = User.find(user_id)

    if user.playlists.where("LOWER(name) = ?", params[:name].downcase).exists?
      render json: { message: "exists" }, status: :conflict
      return
    end
    new_playlist = user.playlists.new({ name: params[:name] })
    if new_playlist.save
      render json: { message: "success" }, status: :created
    else
      render json: { error: new_playlist.errors.full_messages, message: "unsuccessful" }, status: :unprocessable_entity
    end
  end

  def add_game_to_playlist
    user_id = 1
    user = User.find(user_id)

    owned_game_id = params[:owned_game_id]
    game = user.owned_games.find(owned_game_id)
    playlist = user.playlists.find(params[:playlist_id])
    current_playlist_owned_games = playlist.owned_games

    if game.user_id != user_id
      render json: { error: "unsuccessful" }, status: :unprocessable_entity
      return
    end

    if !current_playlist_owned_games.exists?(owned_game_id)
      new_playlist_game = PlaylistGame.create({ playlist_id: params[:playlist_id], owned_game_id: owned_game_id })
      if new_playlist_game.save
        render json: { message: "success", ok: true }, status: :created
      else
        render json: { error: new_playlist_game.errors.full_messages, message: "unsuccessful" }, status: :unprocessable_entity
      end
    else
      render json: { error: "taken" }
    end
  end
end
