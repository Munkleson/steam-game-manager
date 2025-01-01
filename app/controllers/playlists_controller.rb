class PlaylistsController < ApplicationController
  def playlists_main_page

  end

  def create_playlist
    user_id = 1

    Playlist.create({ name: params[:name], description: params[:description], user_id: user_id })
  end
end
