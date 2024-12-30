class CreateInvalidGames < ActiveRecord::Migration[7.1]
  def change
    create_table :invalid_games do |t|
      t.integer :appid
      t.string :name

      t.timestamps
    end
  end
end
