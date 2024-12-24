class OwnedGame < ApplicationRecord
  validates :name, presence: true
  validates :developer, presence: true
  validates :appid, presence: true, uniqueness: true
end
