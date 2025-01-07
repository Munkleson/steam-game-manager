class RemoveColumnsFromOwnedGames < ActiveRecord::Migration[7.1]
  def change
    remove_column :owned_games, :name
    remove_column :owned_games, :developer
    remove_column :owned_games, :appid
    remove_column :owned_games, :image_url
  end
end
