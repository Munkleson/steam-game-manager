require 'net/http'
require 'json'
require 'open-uri'
require 'text'

class OwnedGamesController < ApplicationController
  def new
  end

  def search
    type = params[:type] == "game" ? Game : Dlc
    modified_input = params[:input].gsub(/[^a-zA-Z0-9]/, '')
    # This is to account for games where the length of the name is only 4 characters
    games = modified_input.length > 4 ? type.where("search_name LIKE ?", "%#{modified_input}%") : type.where("LOWER(search_name) = ?", modified_input.downcase)
    @games = games.sort_by { |game| Text::Levenshtein.distance(game[:search_name].downcase, modified_input.downcase) }.slice(0, 10)
    render json: @games
  end

  def index
    owned_games = @user.owned_games.includes(:game, :dlc)
    if !owned_games.any? # makes sure the view has something to "iterate" over
      @owned_games = []
    else
      @owned_games = owned_games.all.sort do |a, b|
          a[:order] <=> b[:order]
        end
    end

    @filters = ["Completed", "Not completed", "Played", "Not played"]
    @stats = ["completed", "played"]
    @owned_games_rates = owned_games_rates
  end

  def create
    appid = params[:appid]
    type = params[:type].downcase
    game_data = parse_api_data(appid)

    if !game_data["success"] # This is to check if the game in the API has details
      render json: { error: "not found" }, status: :not_found
      return
    end

    game_details = game_data["data"]
    # This will fill in the details in the Game and Dlc tables, to have them gradually populated by users rather than on the dev side, as Steam limits API calls to 100k a day
    type == "game" ? populate_game_details(game_details) : populate_dlc_details(game_details)
    if release_check(game_details)
      return
    end

    owned_games = @user.owned_games
    if already_owned_check(owned_games, appid, type)
      return
    end

    new_owned_game_details = {
      order: owned_games.count + 1,
    }
    # Checking if it will enter a Game or DLC id into the new owned game and adds it to the new owned game details
    type_check(new_owned_game_details, type, appid)
    new_owned_game = @user.owned_games.new(new_owned_game_details)
    if new_owned_game.save
      render json: { ok: true }, status: :created
    else
      render json: { errors: @game.errors.full_messages, error: "unsuccessful" }, status: :unprocessable_entity
    end
  end

  def update
    game = OwnedGame.find(params[:id])
    if game.user_id == @user_id && game.update(owned_game_params)
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
      if game.user_id == @user_id && game.update({ order: item["order"] })
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

  def destroy
    game = OwnedGame.find(params[:id])
    if game.user_id == @user_id && game.destroy
      render json: { message: "success" }, status: :no_content
    else
      render json: { error: "failure" }, status: :unprocessable_entity
    end
  end

  private

  def owned_games_rates # For the stats bar to display completion and played rates
    owned_games = @user.owned_games
    completed_rate = GameRateCalculator.calculate_rates(owned_games, :completed)
    played_rate = GameRateCalculator.calculate_rates(owned_games, :played)
    completed_rate = GameRateCalculator.format_rates(completed_rate)
    played_rate = GameRateCalculator.format_rates(played_rate)
    return { number_of_games: owned_games.count, completed: completed_rate, played: played_rate }
  end

  def get_game_details(game)
    developer = game["developers"] ? game["developers"][0] : "No developer"
    image_url = game["header_image"]
    return { developer:, image_url: }
  end

  def type_check(game_details, type, appid)
    if type == "game"
      game_details[:game_id] = Game.find_by(appid: appid).id
    else
      game_details[:dlc_id] = Dlc.find_by(appid: appid).id
    end
  end

  def release_check(game)
    if game["release_date"]["coming_soon"]
      render json: { error: "not out" }, status: :unprocessable_entity
      return true
    end
  end

  def already_owned_check(owned_games, appid, type)
    game_type = type == "game" ? Game : Dlc
    search_type = type == "game" ? "game_id" : "dlc_id"
    game_id = game_type.find_by(appid: appid).id
    if owned_games.where(search_type => game_id).exists?
      render json: { error: "taken" }, status: :unprocessable_entity
      return true
    end
  end

  def parse_api_data(appid)
    game_url = "https://store.steampowered.com/api/appdetails?appids=#{appid}"
    game_read = URI.parse(game_url).read
    return JSON.parse(game_read)[params[:appid]]
  end

  def owned_game_params
    params.require(:owned_game).permit(:completed, :played, :order)
  end

  def game_params
    params.require(:game).permit(:developer, :image_url)
  end

  def dlc_params
    params.require(:dlc).permit(:developer, :image_url)
  end

  def populate_game_details(game)
    game_details = get_game_details(game)
    game = Game.find_by(appid: game["steam_appid"])
    game.update(game_details)
  end

  def populate_dlc_details(game)
    game_details = get_game_details(game)
    dlc = Dlc.find_by(appid: game["steam_appid"])
    dlc.update(game_details)
  end
end
