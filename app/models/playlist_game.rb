class PlaylistGame < ApplicationRecord
  belongs_to :owned_game
  belongs_to :playlist

  validates :owned_game_id, presence: true
  validates :playlist_id, presence: true
end
