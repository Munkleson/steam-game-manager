class AddOrderToOwnedGames < ActiveRecord::Migration[7.1]
  def change
    add_column :owned_games, :order, :integer, default: 0, null: false
  end
end
