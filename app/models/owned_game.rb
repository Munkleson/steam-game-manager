class OwnedGame < ApplicationRecord
  belongs_to :game, optional: true
  belongs_to :dlc, optional: true

  has_many :playlist_games

  validates :name, presence: true
  validates :appid, presence: true
  validates :order, presence: true
end
