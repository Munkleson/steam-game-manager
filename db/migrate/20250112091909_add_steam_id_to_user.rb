class AddSteamIdToUser < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :steam_id, :integer
  end
end
