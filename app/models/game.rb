class Game < ApplicationRecord
  has_many :owned_games
  has_many :users, through: :owned_games

  before_save :generate_search_name

  private

  def generate_search_name
    self.search_name = name.gsub(/[^a-zA-Z0-9]/, '').downcase
  end
end
