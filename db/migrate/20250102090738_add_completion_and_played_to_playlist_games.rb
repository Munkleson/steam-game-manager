class AddCompletionAndPlayedToPlaylistGames < ActiveRecord::Migration[7.1]
  def change
    add_column :playlist_games, :completed, :boolean
    add_column :playlist_games, :played, :boolean
  end
end
