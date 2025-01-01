class PlaylistGame < ApplicationRecord
  belongs_to :owned_game
  belongs_to :playlist

  validates :owned_games_id, presence: true
  validates :playlists_id, presence: true
end
