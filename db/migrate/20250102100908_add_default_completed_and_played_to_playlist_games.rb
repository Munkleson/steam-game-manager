class AddDefaultCompletedAndPlayedToPlaylistGames < ActiveRecord::Migration[7.1]
  def change
    change_column_default :playlist_games, :completed, false
    change_column_default :playlist_games, :played, false
  end
end
