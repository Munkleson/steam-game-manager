class AddCompletedToOwnedGames < ActiveRecord::Migration[7.1]
  def change
    add_column :owned_games, :completed, :boolean, default: false
  end
end
