require 'net/http'
require 'json'
require 'open-uri'

class OwnedGamesController < ApplicationController
  def index
    game_list_url = "http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json"
    game_list = URI.parse(game_list_url).read
    steam_games = JSON.parse(game_list)
    @app_list = steam_games["applist"]["apps"]
    @alphabet_array = ("a".."z").to_a
  end

  # def get_games_list
  #   game_list_url = "http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json"
  #   game_list = URI.parse(game_list_url).read
  #   steam_games = JSON.parse(game_list)
  #   app_list = steam_games["applist"]["apps"]
  #   response.headers['Content-Type'] = 'application/json'
  #   render json: app_list
  # end
end
