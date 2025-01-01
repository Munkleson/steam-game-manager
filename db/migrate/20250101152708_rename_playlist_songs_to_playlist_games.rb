class RenamePlaylistSongsToPlaylistGames < ActiveRecord::Migration[7.1]
  def change
    rename_table :playlist_songs, :playlist_games
  end
end
