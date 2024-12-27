class AddPlayedToOwnedGames < ActiveRecord::Migration[7.1]
  def change
    add_column :owned_games, :played, :boolean, default: false
  end
end
