class CreateOwnedGames < ActiveRecord::Migration[7.1]
  def change
    create_table :owned_games do |t|
      t.string :name
      t.string :developer
      t.integer :appid

      t.timestamps
    end
  end
end
