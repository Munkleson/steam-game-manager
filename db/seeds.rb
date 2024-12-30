# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end


# Things to filter out by
# Costume, Demo, Trial,

# https://steamapi.xpaw.me/#IStoreService


require "open-uri"
require "json"

# dlc_url = "https://api.steampowered.com/IStoreService/GetAppList/v1/?key=645F7D3C8F80F67D096D53B9E46B57F8&include_games=false&include_dlc=true&last_appid=0&max_results=50000"
# dlc_list = URI.parse(dlc_url).read
# steam_dlc = JSON.parse(dlc_list)
# dlcs = steam_dlc["response"]["apps"]
# dlcs.each do |dlc|
#   Dlc.create!({ appid: dlc["appid"], name: dlc["name"]})
# end
# puts Dlc.count

# Game.find_each do |game|
#   game.update(search_name: game[:name].gsub(/[^a-zA-Z0-9]/, ''))
# end

# Dlc.find_each do |dlc|
#   dlc.update(search_name: dlc[:name].gsub(/[^a-zA-Z0-9]/, ''))
# end

# def game_validity(data)
#   return data["type"] == "game"
# end

# def dlc_validity(data)
#   return data["type"] == "dlc"
# end

# # Game.destroy_all
# # Dlc.destroy_all
# # InvalidGame.destroy_all

# # game_list_url = "http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=#{Rails.application.credentials[:api_key]}&format=json"
# game_list_url = "https://api.steampowered.com/IStoreService/GetAppList/v1/?key=645F7D3C8F80F67D096D53B9E46B57F8&include_games=true&max_results=10"

# game_list = URI.parse(game_list_url).read
# steam_games = JSON.parse(game_list)
# # app_list = steam_games["applist"]["apps"]
# app_list = steam_games["response"]["apps"]

# # app_list = app_list.select do |game|
# #   name = game["name"]
# #   !(name.match?(/\b#{Regexp.escape('Demo')}\b/i) || name.match?(/\b#{Regexp.escape('Trial')}\b/i) || name.match?(/\b#{Regexp.escape('Skin Pack')}\b/i) || name.match?(/\b#{Regexp.escape('Playtest')}\b/i) || name.match?(/\b#{Regexp.escape('Artbook')}\b/i) || name.match?(/\b#{Regexp.escape('Soundtrack')}\b/i) || name.match?(/\b#{Regexp.escape('Supporter pack')}\b/i)             )
# # end

# puts app_list.count

# app_list.each do |game|
#   Game.create!({ appid: game["appid"], name: game["name"]})
# end
# puts Game.count

# random_sample = app_list.sample(500)

# random_sample.each do |game|
#   appid = game["appid"]
#   game_url = "https://store.steampowered.com/api/appdetails?appids=#{appid}"
#   game_raw_data = URI.parse(game_url).read
#   game_data = JSON.parse(game_raw_data)[appid.to_s]
#   data = game_data["data"]
#   if game_data["success"] && game_validity(data)
#     name = data["name"]
#     developer = data["developers"] ? data["developers"][0] : "No developer"
#     image_url = data["header_image"]
#     Game.create!({appid:, name:, developer:, image_url: })
#   elsif game_data["success"] && dlc_validity(data)
#     name = data["name"]
#     developer = data["developers"] ? data["developers"][0] : "No developer"
#     image_url = data["header_image"]
#     Dlc.create!({appid:, name:, developer:, image_url: })
#   else
#     InvalidGame.create!({appid:, name: game["name"]})
#   end
#   sleep(2)
# end

# ranges = (0..100).map {|i| (i*100-99)..(i*100)}
# puts ranges.inspect



# for one particular game only
  # game_url = "https://store.steampowered.com/api/appdetails?appids=460120"
  # game_raw_data = URI.parse(game_url).read
  # game_data = JSON.parse(game_raw_data)["460120"]
  # data = game_data["data"]
  # puts game_data
  # if game_data["success"] && game_validity(data)
  #   name = data["name"]
  #   developer = data["developers"] ? data["developers"][0] : "No developer"
  #   image_url = data["header_image"]
  #   Game.create!({appid: "460120", name:, developer:, image_url: })
  # elsif game_data["success"] && dlc_validity(data)
  #   name = data["name"]
  #   developer = data["developers"] ? data["developers"][0] : "No developer"
  #   image_url = data["header_image"]
  #   Dlc.create!({appid: "460120", name:, developer:, image_url: })
  # else
  #   InvalidGame.create!({appid: "460120", name: "Megadimension Neptunia VII"})
  # end

# puts Game.all
# puts Dlc.all
# puts InvalidGame.all

# OwnedGame.destroy_all

# OwnedGame.create({appid: 570, name: "Dota 2", developer: "Valve", image_url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/header.jpg?t=1731544174"})
# OwnedGame.create({appid: 440, name: "Team Fortress 2", developer: "Valve", image_url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/440/header.jpg?t=1729702978"})

# game_list_url = "http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json"
# game_list = URI.parse(game_list_url).read
# steam_games = JSON.parse(game_list)
# app_list = steam_games["applist"]["apps"]

# random_sample = app_list.sample(5)

# puts app_list.length

# random_sample.each do |game|
#   appid = game["appid"]
#   game_url = "https://store.steampowered.com/api/appdetails?appids=#{appid}"
#   game_raw_data = URI.parse(game_url).read
#   game_data = JSON.parse(game_raw_data)[appid.to_s]
#   data = game_data["data"]
#   if game_data["success"] && data["developers"]
#     name = data["name"]
#     developer = data["developers"][0]
#     image_url = data["header_image"]
#     OwnedGame.create!({appid:, name:, developer:, image_url: })
#     # added_game = OwnedGame.new({appid:, name:, developer:})
#     # added_game.save
#   end
# end

# # appid = "570"
# # random_url = "https://store.steampowered.com/api/appdetails?appids=#{appid}"
# # game_raw_data = URI.parse(random_url).read
# # game_data = JSON.parse(game_raw_data)[appid]["data"]
# # name = game_data["name"]
# # developer = game_data["developers"]

# puts OwnedGame.all
