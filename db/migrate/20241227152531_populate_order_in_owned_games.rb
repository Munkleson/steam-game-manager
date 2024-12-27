class PopulateOrderInOwnedGames < ActiveRecord::Migration[7.1]
  def up
    OwnedGame.find_each.with_index(1) do |game, index|
      game.update_column(:order, index)
    end
  end

  def down
    OwnedGame.update_all(order: nil)
  end
end
