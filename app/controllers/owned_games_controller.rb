require 'net/http'
require 'json'
require 'open-uri'

class OwnedGamesController < ApplicationController
  def index
    game_list_url = "http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json"
    game_list = URI.parse(game_list_url).read
    steam_games = JSON.parse(game_list)
    @app_list = steam_games["applist"]["apps"]
    # .select do |game|
    #   game_url = "https://store.steampowered.com/api/appdetails?appids=#{game["appid"]}"
    #   game_data = URI.parse(game_url).read
    #   game_api_data = JSON.parse(game_data)
    #   game_api_data[game["appid"].to_s]["success"] == true
    # end
    @alphabet_array = ("a".."z").to_a
  end

  def owned_games_list
    @owned_games = OwnedGame.all
  end

  def create
    game_url = "https://store.steampowered.com/api/appdetails?appids=#{params[:appid]}"
    game = URI.parse(game_url).read
    game = JSON.parse(game)[params[:appid]]["data"]
    developer = game["developers"][0]
    image_url = game["header_image"]

    game_details = {
      appid: params[:appid],
      name: params[:name],
      developer:,
      image_url:,
    }
    @game = OwnedGame.new(game_details)
    @game.save
    # redirect_to owned_games_list_path
  end

  def update
    game = OwnedGame.find(params[:id])
    if game.update(owned_game_params)
      render json: { message: 'Update successful' }, status: :ok
    else
      render json: { error: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def delete
    game = OwnedGame.find(params[:id])
    game.destroy
    redirect_to owned_games_list_path
  end

  private

  def owned_game_params
    params.require(:owned_game).permit(:name, :appid, :developer, :completed, :played, :image_url)
  end
end
