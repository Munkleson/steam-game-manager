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
    if params['openid.mode'] == 'id_res' && params['openid.claimed_id'].present?
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
        if user
          # Log in logic
          # This will check if any changes have been done since the last login if enough time has passed
          OwnedGamesService.check_changes_to_owned_games_for_existing_user(user)
        else
          # New user logic
          # This will create a new user and populate the owned games database with their details
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
    OwnedGamesService.retrieve_owned_games(user)
  end
end
