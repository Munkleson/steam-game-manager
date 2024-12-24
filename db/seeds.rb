# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
require "open-uri"
require "json"

OwnedGame.destroy_all

OwnedGame.create({appid: 570, name: "Dota 2", developer: "Valve"})
OwnedGame.create({appid: 440, name: "Team Fortress 2", developer: "Valve"})

game_list_url = "http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json"
game_list = URI.parse(game_list_url).read
steam_games = JSON.parse(game_list)
app_list = steam_games["applist"]["apps"]

random_sample = app_list.sample(10)

random_sample.each do |game|
  appid = game["appid"]
  game_url = "https://store.steampowered.com/api/appdetails?appids=#{appid}"
  game_raw_data = URI.parse(game_url).read
  game_data = JSON.parse(game_raw_data)[appid.to_s]
  data = game_data["data"]
  if game_data["success"] && data["developers"]
    name = data["name"]
    developer = data["developers"][0]
    OwnedGame.create!({appid:, name:, developer:})
    # added_game = OwnedGame.new({appid:, name:, developer:})
    # added_game.save
  end
end

# appid = "570"
# random_url = "https://store.steampowered.com/api/appdetails?appids=#{appid}"
# game_raw_data = URI.parse(random_url).read
# game_data = JSON.parse(game_raw_data)[appid]["data"]
# name = game_data["name"]
# developer = game_data["developers"]

puts OwnedGame.all
