class OwnedGame < ApplicationRecord
  validates :name, presence: true
  validates :appid, presence: true, uniqueness: true
  validates :order, presence: true
end
