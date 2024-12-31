class Dlc < ApplicationRecord
  has_many :owned_games
  has_many :users, through: :owned_games
end
