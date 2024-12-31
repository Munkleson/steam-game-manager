class RemoveIndexesFromOwnedGames < ActiveRecord::Migration[7.1]
  def change
    remove_index :owned_gammes, name: "index_owned_games_on_dlc_id"
    remove_index :owned_games, name: "index_owned_games_on_game_id"
    remove_index :owned_games, name: "index_owned_games_on_user_id_and_order"
  end
end
