class Playlist < ApplicationRecord
  belongs_to :user
  has_many :playlist_games

  validates :user, presence: true
end
