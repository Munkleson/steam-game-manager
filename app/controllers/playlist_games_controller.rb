class PlaylistGamesController < ApplicationController
  def create
    owned_game_id = params[:owned_game_id]
    owned_game = @user.owned_games.find(owned_game_id)
    begin
      playlist = @user.playlists.find_by!("id = ?", params[:playlist_id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "!playlist", message: "what?" }, status: :not_found
      return
    end
    
    playlist_games = playlist.owned_games

    if owned_game.user_id != @user_id
      render json: { error: "unsuccessful" }, status: :unprocessable_entity
      return
    end

    # If the game exists in the playlist already for whatever reason
    if playlist_games.exists?(owned_game_id)
      render json: { error: "taken" }
      return
    end

    new_playlist_game = playlist.playlist_games.new({ owned_game_id: owned_game_id, order: playlist_games.count + 1 })

    if new_playlist_game.save
      render json: { message: "success", ok: true, id: new_playlist_game.id, completed: owned_game[:completed], played: owned_game[:played] }, status: :created
    else
      render json: { error: new_playlist_game.errors.full_messages, message: "unsuccessful" }, status: :unprocessable_entity
    end
  end

  def destroy
    playlist = Playlist.find(params[:playlist_id])

    if playlist.user_id != @user_id
      render json: { error: "unsuccessful" }, status: :unprocessable_entity
      return
    end

    owned_game_order = playlist.owned_games.find_by(id: params[:id])&.order
    playlist_game_to_remove = playlist.playlist_games.find_by(owned_game_id: params[:id])

    if playlist_game_to_remove.destroy
      render json: { message: "success", ok: true, owned_game_order: owned_game_order }
    else
      render json: { message: "failure" }
    end
  end


  def update_order
    playlist_games = Playlist.find(params[:playlist_id]).playlist_games
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
end
