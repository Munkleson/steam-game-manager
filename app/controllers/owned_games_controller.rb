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
    @owned_games = OwnedGame.all.sort do |a, b|
      a[:order] <=> b[:order]
    end
    @filters = ["Completed", "Not completed", "Played", "Not played", "Clear filter"]
    number_of_games = OwnedGame.count.to_f
    completed_count = OwnedGame.all.filter { |game| game[:completed] }.count
    played_count = OwnedGame.all.filter { |game| game[:played] }.count

    completed_rate = (completed_count / number_of_games * 100)
    played_rate = (played_count / number_of_games * 100)

    @completed_rate = completed_rate % 1 == 0 ? completed_rate.to_i : completed_rate.round(2)
    @played_rate = played_rate % 1 == 0 ? played_rate.to_i : played_rate.round(2)
    @rates = { completed: @completed_rate, played: @played_rate }
    @stats = ["completed", "played"]
    @count = { all: OwnedGame.count, completed: completed_count, played: played_count }
  end

  def create
    game_url = "https://store.steampowered.com/api/appdetails?appids=#{params[:appid]}"
    game = URI.parse(game_url).read
    game = JSON.parse(game)[params[:appid]]["data"]
    developer = game["developers"][0]
    image_url = game["header_image"]
    order = OwnedGame.count + 1

    game_details = {
      appid: params[:appid],
      name: params[:name],
      developer:,
      image_url:,
      order:,
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

  def update_order
    games = params[:games]
    puts games
    games.each do |item|
      game = OwnedGame.find(item["id"])
      game.update({ order: item["order"] })
    end
  end

  def delete
    game = OwnedGame.find(params[:id])
    game.destroy
    redirect_to owned_games_list_path
  end

  private

  def owned_game_params
    params.require(:owned_game).permit(:name, :appid, :developer, :completed, :played, :image_url, :order)
  end
end
