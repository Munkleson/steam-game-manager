class AddReferencesToPlaylistsAndPlaylistSongs < ActiveRecord::Migration[7.1]
  def change
    add_reference :playlists, :user, foreign_key: true

    add_reference :playlist_songs, :playlists, foreign_key: true
    add_reference :playlist_songs, :owned_games, foreign_key: true
  end
end
