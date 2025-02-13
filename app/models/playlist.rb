class Playlist < ApplicationRecord
  belongs_to :user
  has_many :playlist_games, dependent: :destroy
  has_many :owned_games, through: :playlist_games

  validates :user, presence: true
end
