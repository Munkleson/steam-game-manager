class User < ApplicationRecord
  has_many :owned_games, dependent: :destroy
  has_many :games, through: :owned_games
  has_many :dlcs, through: :owned_games
  has_many :playlists, dependent: :destroy
  has_many :playlist_games, through: :playlists, dependent: :destroy
end
