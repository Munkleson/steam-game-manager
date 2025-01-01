class PlaylistsController < ApplicationController
  def playlists_main_page

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
      render json: {error: new_playlist.errors.full_messages, message: "unsuccessful"}, status: :unprocessable_entity
    end
  end
end
