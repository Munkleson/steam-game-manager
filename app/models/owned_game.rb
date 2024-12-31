class OwnedGame < ApplicationRecord
  belongs_to :game, optional: true
  belongs_to :dlc, optional: true

  validates :name, presence: true
  validates :appid, presence: true
  validates :order, presence: true
end
