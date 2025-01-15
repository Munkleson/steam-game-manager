class User < ApplicationRecord
  has_many :owned_games, dependent: :destroy
  has_many :games, through: :owned_games
  has_many :dlcs, through: :owned_games
  has_many :playlists, dependent: :destroy
  has_many :playlist_games, through: :playlists, dependent: :destroy

  # validates :username, presence: true
  validates :steam_id, presence: true, uniqueness: true
  # validates :persona_name, presence: true
  # validates :avatar_url, presence: true
  # validates :profile_url, presence: true
  # validates :last_logoff, presence: true
end
