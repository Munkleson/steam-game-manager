class RemoveUniquenessFromOwnedGamesOrder < ActiveRecord::Migration[7.1]
  def change
    remove_index :owned_games, column: [:user_id, :order]

    add_index :owned_games, [:user_id, :order]
  end
end
