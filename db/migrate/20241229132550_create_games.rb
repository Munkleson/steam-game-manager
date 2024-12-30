class CreateGames < ActiveRecord::Migration[7.1]
  def change
    create_table :games do |t|
      t.integer :appid
      t.string :name
      t.string :image_url
      t.string :developer

      t.timestamps
    end
  end
end
