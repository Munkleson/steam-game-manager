class OwnedGame < ApplicationRecord
  belongs_to :game, optional: true
  belongs_to :dlc, optional: true
  belongs_to :user

  has_many :playlist_games, dependent: :destroy

  validates :name, presence: true
  validates :appid, presence: true
  validates :order, presence: true
end
