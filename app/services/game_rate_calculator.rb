class GameRateCalculator
  def self.calculate_rates(games, checked)
    number_of_games = games.count.to_f
    number_of_checked_games = games.where(checked => true).count
    rate = number_of_checked_games / number_of_games * 100
    rate = rate.nan? ? 0 : rate
  end

  def self.format_rates(rate)
    return rate % 1 == 0 ? rate.to_i : rate.round(2)
  end
end
