class AddColumnsToOwnedGamesAndUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :owned_games, :hidden, :boolean, default: false, null: false
    add_column :owned_games, :will_never_play, :boolean, default: false, null: false
    add_column :owned_games, :last_played, :bigint
    add_column :owned_games, :playtime, :real, default: 0, null: false

    add_column :users, :last_updated, :bigint
  end
end
