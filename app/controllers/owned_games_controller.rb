require 'net/http'
require 'json'
require 'open-uri'
require 'text'

class OwnedGamesController < ApplicationController
  def index
  end

  def search
    type = params[:type] == "game" ? Game : Dlc
    input = params[:input].gsub(/[^a-zA-Z0-9]/, '')
    @games = type.where("search_name LIKE ?", "%#{input}%")
    @games = @games.sort_by { |game| Text::Levenshtein.distance(game[:search_name].downcase, input.downcase) }.slice(0, 10)
    render json: @games
  end

  def short_search
    type = params[:type] == "game" ? Game : Dlc
    input = params[:input].gsub(/[^a-zA-Z0-9]/, '')
    @games = type.where("LOWER(search_name) = ?", input.downcase)
    @games = @games.sort_by { |game| Text::Levenshtein.distance(game[:search_name].downcase, input.downcase) }.slice(0, 10)
    render json: @games
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

  def create_game
    game_url = "https://store.steampowered.com/api/appdetails?appids=#{params[:appid]}"
    game_read = URI.parse(game_url).read
    game_data = JSON.parse(game_read)[params[:appid]]
    success = game_data["success"]
    if success
      game = game_data["data"]
      name = game["name"]

      # Checking if the game is out yet, and ends the request and error if it isn't out
      if game["release_date"]["coming_soon"]
        render json: { error: "not out", name: name }, status: :unprocessable_entity
        return
      end

      developer = game["developers"] ? game["developers"][0] : "No developer"
      image_url = game["header_image"]
      order = OwnedGame.count + 1

      game_details = {
        appid: params[:appid],
        name:,
        developer:,
        image_url:,
        order:,
      }
      @game = OwnedGame.new(game_details)
      if @game.save
        render json: @game, status: :created
      else
        render json: { errors: @game.errors.full_messages, name: name, error: "taken" }, status: :unprocessable_entity
      end
    else
      render json: { error: "not found", name: name }, status: :not_found
    end
  end

  def update
    game = OwnedGame.find(params[:id])
    if game.update(owned_game_params)
      render json: { message: 'Update successful' }, status: :ok
    else
      render json: { error: game.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update_order
    games = params[:games]
    errors = []
    games.each do |item|
      game = OwnedGame.find(item["id"])
      if game.update({ order: item["order"] })  # Check if update is successful
        next
      else
        errors << "Failed to update order of game with ID:#{item['id']}"
      end
    end
    if errors.empty?
      render json: { message: 'All games were successfully updated' }, status: :ok
    else
      render json: { error: errors }, status: :unprocessable_entity
    end
  end

  def delete
    game = OwnedGame.find(params[:id])
    game.destroy
    # redirect_to owned_games_list_path
  end

  private

  def owned_game_params
    params.require(:owned_game).permit(:name, :appid, :developer, :completed, :played, :image_url, :order)
  end
end
