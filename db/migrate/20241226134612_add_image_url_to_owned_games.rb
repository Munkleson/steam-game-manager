class AddImageUrlToOwnedGames < ActiveRecord::Migration[7.1]
  def change
    add_column :owned_games, :image_url, :string
  end
end
