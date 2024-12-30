class AddUniqueIndexToGamesAndDlcs < ActiveRecord::Migration[7.1]
  def change
    add_index :games, :appid, unique: true
    add_index :dlcs, :appid, unique: true
  end
end
