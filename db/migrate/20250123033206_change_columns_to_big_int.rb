class ChangeColumnsToBigInt < ActiveRecord::Migration[7.1]
  def change
    change_column :users, :last_logoff, :bigint
    change_column :users, :steam_id, :bigint
  end
end
