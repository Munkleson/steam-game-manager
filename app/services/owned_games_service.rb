class OwnedGamesService
  def self.insert_owned_games_for_new_user(user)
    owned_games = retrieve_owned_games(user)
    owned_games.each do |game|
      appid = game["appid"]
      check_if_game_details_in_db(appid)
      add_to_owned_games(appid, user, game)
    end
    user.update(game_count: user.owned_games.count)
  end

  #### Unfinished - Need to check for time since last updated
  def self.check_changes_to_owned_games_for_existing_user(user)
    owned_games = retrieve_owned_games(user)
    owned_games.each { |game| check_owned_games_existence(game, user) }
    user.update(game_count: user.owned_games.count)
  end

  def self.check_owned_games_existence(game, user)
    appid = game["appid"]
    if !user.games.find_by(appid: appid)
      check_if_game_details_in_db(appid)
      add_to_owned_games(appid, user, game)
    else
      game_to_update = user.owned_games.joins(:game).find_by(games: {appid: game["appid"]})
      changes = check_changes_to_owned_games(game, user, game_to_update)
      if changes
        update_owned_games(game, user, game_to_update)
      end
    end
  end

  def self.check_changes_to_owned_games(game, user, game_to_update)
    if game["playtime_forever"] == game_to_update[:playtime] || game["rtime_last_played"] == game_to_update[:last_played]
      return false
    end
    return true
  end

  def self.update_owned_games(game, user, game_to_update)
    last_played = game["rtime_last_played"]
    playtime = game["playtime_forever"]
    game_to_update.update(last_played:, playtime:)
  end

  def self.retrieve_owned_games(user)
    # GetOwnedGames
    owned_games_url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=#{ENV["STEAM_API_KEY"]}&steamid=#{user.steam_id}&include_appinfo=true&include_played_free_games=true&include_free_sub=false&skip_unvetted_apps=false&include_extended_appinfo=true"
    owned_games_json = URI.parse(owned_games_url).read
    return JSON.parse(owned_games_json)["response"]["games"]
  end

  # This is meant to populate the game's details in the Games table so it gradually fills the table with data rather than having to fetch from each individual game's api endpoint (which would be impossible in a day anyway, as steam only allows 100k api calls a day)
  def self.check_if_game_details_in_db(appid)
    # Image url will be empty in the Games table if no user on this app has owned it before this user's creation
    db_game = Game.find_by(appid: appid)
    if db_game && !db_game[:image_url]
      populate_game_db_details(appid)
    end
  end

  def self.populate_game_db_details(appid)
    game_url = "https://store.steampowered.com/api/appdetails?appids=#{appid}"
    game_json = URI.parse(game_url).read
    game_response = JSON.parse(game_json)["#{appid}"]
    if game_response["success"]
      game_data = game_response["data"]
      developer = game_data["developers"] ? game_data["developers"][0] : "Unknown developer"
      image_url = game_data["header_image"]

      game = Game.find_by(appid: appid)
      game.update(image_url:, developer:)
    end
  end

  def self.add_to_owned_games(appid, user, game)
    db_game = Game.find_by(appid: appid)
    if db_game && (db_game.name.downcase.end_with?(" test") || db_game.name.downcase.end_with?(" demo") || db_game.name.downcase.end_with?(" prologue"))
      return
    end

    if db_game
      order_count = user.owned_games.count + 1
      last_played = game["rtime_last_played"]
      playtime = game["playtime_forever"]

      new_game = user.owned_games.new(order: order_count, last_played:, playtime:)
      new_game.game = db_game
      if new_game.save
        puts new_game.errors.full_messages
      end
    end
  end
end
