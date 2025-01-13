class AddPlayerSummariesToUser < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :persona_name, :string
    add_column :users, :profile_url, :string
    add_column :users, :avatar_url, :string
    add_column :users, :last_logoff, :integer
    add_column :users, :game_count, :integer
  end
end
