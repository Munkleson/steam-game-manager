class OwnedGame < ApplicationRecord
  belongs_to :game, optional: true
  belongs_to :dlc, optional: true
  belongs_to :user

  # Currently if you delete an owned game, all of that owned game in the playlist games will be too, but should it be?
  has_many :playlist_games, dependent: :destroy
  has_many :playlists, through: :playlist_games

  validates :name, presence: true
  validates :appid, presence: true
  validates :order, presence: true
end
