require 'net/http'
require 'json'
require 'open-uri'

class SteamAuthController < ApplicationController

  def authenticate
    redirect_to "https://steamcommunity.com/openid/login?" + {
      "openid.ns" => "http://specs.openid.net/auth/2.0",
      "openid.mode" => "checkid_setup",
      "openid.return_to" => steam_callback_url,
      "openid.realm" => "http://localhost:3000",
      "openid.identity" => "http://specs.openid.net/auth/2.0/identifier_select",
      "openid.claimed_id" => "http://specs.openid.net/auth/2.0/identifier_select"
    }.to_query, allow_other_host: true
  end

  def callback
    # Ensure Steam sent back the required parameters
    if params['openid.mode'] == 'id_res' && params['openid.claimed_id'].present?
      # Verify the response with Steam
      verification_params = {
        "openid.ns" => params['openid.ns'],
        "openid.mode" => "check_authentication",
        "openid.op_endpoint" => params['openid.op_endpoint'],
        "openid.claimed_id" => params['openid.claimed_id'],
        "openid.identity" => params['openid.identity'],
        "openid.return_to" => params['openid.return_to'],
        "openid.response_nonce" => params['openid.response_nonce'],
        "openid.assoc_handle" => params['openid.assoc_handle'],
        "openid.signed" => params['openid.signed'],
        "openid.sig" => params['openid.sig']
      }

      uri = URI.parse("https://steamcommunity.com/openid/login")
      response = Net::HTTP.post_form(uri, verification_params)
      if response.body.include?("is_valid:true")
        steam_id = params['openid.claimed_id'].match(/\d+$/)[0]

        user = User.find_by(steam_id: steam_id)
        if !user
          user = new_user(steam_id)
          populate_new_user_details(user)
        end

        session[:user_id] = user.id

        redirect_to library_path, notice: "Successfully signed in as Steam user #{steam_id}"
      else
        redirect_to root_path, alert: "Steam authentication failed"
      end
    else
      redirect_to root_path, alert: "Invalid authentication response"
    end
  end

  private

  def new_user(steam_id)
    # GetPlayerSummaries
    player_summaries_url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=#{ENV["STEAM_API_KEY"]}&steamids=#{steam_id}"
    player_summaries_json = URI.parse(player_summaries_url).read
    player_summaries =  JSON.parse(player_summaries_json)["response"]["players"].first
    persona_name = player_summaries["personaname"]
    profile_url = player_summaries["profileurl"]
    avatar_url = player_summaries["avatarfull"]
    last_logoff = player_summaries["lastlogoff"]
    user = User.create!(steam_id:, persona_name:, profile_url:, avatar_url:, last_logoff:)
    return user
  end

  def populate_new_user_details(user)
    retrieve_owned_games(user)
  end

  def retrieve_owned_games(user)
    # GetOwnedGames
    owned_games_url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=#{ENV["STEAM_API_KEY"]}&steamid=#{user.steam_id}&include_appinfo=true&include_played_free_games=true&include_free_sub=false&skip_unvetted_apps=false&include_extended_appinfo=true"
    owned_games_json = URI.parse(owned_games_url).read
    owned_games = JSON.parse(owned_games_json)["response"]["games"]
    owned_games.each do |game|
      appid = game["appid"]
      check_if_game_in_db(appid)
      add_to_owned_games(appid, user)
    end
    user.update(game_count: user.owned_games.count)
  end

  def add_to_owned_games(appid, user)
    db_game = Game.find_by(appid: appid)
    if db_game && (db_game.name.downcase.end_with?(" test") || db_game.name.downcase.end_with?(" demo") || db_game.name.downcase.end_with?(" prologue"))
      return
    end

    if db_game
      order_count = user.owned_games.count + 1
      game = user.owned_games.new(game_id: db_game.id, order: order_count)
      game.save
    end
  end

  def check_if_game_in_db(appid)
    # Image url will be empty in the Games table if no user on this app has owned it before this user's creation
    db_game = Game.find_by(appid: appid)
    if db_game && !db_game[:image_url]
      populate_game_db_details(appid)
    end
  end

  def populate_game_db_details(appid)
    game_url = "https://store.steampowered.com/api/appdetails?appids=#{appid}"
    game_json = URI.parse(game_url).read
    game_response = JSON.parse(game_json)["#{appid}"]
    if game_response["success"]
      game_data = game_response["data"]
      developer = game_data["developers"].first
      image_url = game_data["header_image"]
      game = Game.find_by(appid: appid)
      game.update(image_url:, developer:)
    end
  end
end
