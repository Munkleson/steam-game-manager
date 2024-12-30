class AddSearchNameToGamesAndDlcs < ActiveRecord::Migration[7.1]
  def change
    add_column :games, :search_name, :string
    add_column :dlcs, :search_name, :string
  end
end
