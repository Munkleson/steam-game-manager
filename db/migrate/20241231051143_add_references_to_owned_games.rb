class AddReferencesToOwnedGames < ActiveRecord::Migration[7.1]
  def change
    add_reference :owned_games, :user, foreign_key: true
    add_reference :owned_games, :dlc, foreign_key: true
    add_reference :owned_games, :game, foreign_key: true

    add_index :owned_games, [:user_id, :game_id], unique: true
    add_index :owned_games, [:user_id, :dlc_id], unique: true
    add_index :owned_games, [:user_id, :order], unique: true
  end
end
