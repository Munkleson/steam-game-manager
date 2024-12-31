class User < ApplicationRecord
  has_many :owned_games
  has_many :games, through: :owned_games
  has_many :dlcs, through: :owned_games
end
