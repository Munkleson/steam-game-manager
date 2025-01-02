class AddOrderToPlaylistsAndPlaylistGames < ActiveRecord::Migration[7.1]
  def change
    add_column :playlist_games, :order, :integer
    add_column :playlists, :order, :integer
  end
end
