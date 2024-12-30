class DropInvalidGames < ActiveRecord::Migration[7.1]
  def change
    drop_table :invalid_games
  end
end
