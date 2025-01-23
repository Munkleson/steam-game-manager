# https://steamapi.xpaw.me/#IStoreService

require "open-uri"
require "json"

# Each link is a list of games on steam in ascending order. Only 50000 can be retrieved at a time, so multiple links
# Game.destroy_all

steam_games = [
  "https://api.steampowered.com/IStoreService/GetAppList/v1/?key=#{ENV["STEAM_API_KEY"]}&include_games=true&max_results=50000",
  "https://api.steampowered.com/IStoreService/GetAppList/v1/?key=#{ENV["STEAM_API_KEY"]}&include_games=true&last_appid=1530250&max_results=50000",
  "https://api.steampowered.com/IStoreService/GetAppList/v1/?key=#{ENV["STEAM_API_KEY"]}&include_games=true&last_appid=2810250&max_results=50000"
]

# This will add the list of Steam Games into the database for the Games table. Not fully seeded, as the rest will be done when users require them to have more information. Calling 120k game endpoints will be too costly at once, and unneeded since most of them would never need information for now
steam_games.each do |games_list_url|
  games_list = URI.parse(games_list_url).read
  games = JSON.parse(games_list)["response"]["apps"]
  games.each do |game|
    appid = game["appid"]
    name = game["name"]
    # search_name = name.gsub(/[^a-zA-Z0-9]/, '').downcase
    Game.create!({appid:, name:})
  end
end

#########

# Game.find_each do |game|
#   game.update(search_name: game[:name].gsub(/[^a-zA-Z0-9]/, ''))
# end

# Dlc.find_each do |dlc|
#   dlc.update(search_name: dlc[:name].gsub(/[^a-zA-Z0-9]/, ''))
# end

# # app_list = app_list.select do |game|
# #   name = game["name"]
# #   !(name.match?(/\b#{Regexp.escape('Demo')}\b/i) || name.match?(/\b#{Regexp.escape('Trial')}\b/i) || name.match?(/\b#{Regexp.escape('Skin Pack')}\b/i) || name.match?(/\b#{Regexp.escape('Playtest')}\b/i) || name.match?(/\b#{Regexp.escape('Artbook')}\b/i) || name.match?(/\b#{Regexp.escape('Soundtrack')}\b/i) || name.match?(/\b#{Regexp.escape('Supporter pack')}\b/i)             )
# # end
