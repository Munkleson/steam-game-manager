class RenameForeignKeysInPlaylistGames < ActiveRecord::Migration[7.1]
  def change
    rename_column :playlist_games, :playlists_id, :playlist_id
    rename_column :playlist_games, :owned_games_id, :owned_game_id
  end
end
