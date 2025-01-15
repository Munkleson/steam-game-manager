class OwnedGamesService
  def self.insert_owned_games_for_new_user(user)
    owned_games = retrieve_owned_games(user)
    owned_games.each do |game|
      appid = game["appid"]
      check_if_game_in_db(appid)
      add_to_owned_games(appid, user)
    end
    user.update(game_count: user.owned_games.count)
  end

  #### Unfinished - Need to check for time since last updated 
  def self.check_changes_to_owned_games_for_existing_user(user)
    owned_games = retrieve_owned_games(user)
    owned_games.each { |game| check_changes_to_owned_games(game, user) }
    user.update(game_count: user.owned_games.count)
  end

  def self.check_changes_to_owned_games(game, user)
    appid = game["appid"]
    if !user.games.find_by(appid: appid)
      check_if_game_in_db(appid)
      add_to_owned_games(appid, user)
    end
  end

  def self.retrieve_owned_games(user)
    # GetOwnedGames
    owned_games_url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=#{ENV["STEAM_API_KEY"]}&steamid=#{user.steam_id}&include_appinfo=true&include_played_free_games=true&include_free_sub=false&skip_unvetted_apps=false&include_extended_appinfo=true"
    owned_games_json = URI.parse(owned_games_url).read
    return JSON.parse(owned_games_json)["response"]["games"]
  end

  # This is meant to populate the game's details in the Games table so it gradually fills the table with data rather than having to fetch from each individual game's api endpoint (which would be impossible in a day anyway, as steam only allows 100k api calls a day)
  def self.check_if_game_in_db(appid)
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
      developer = game_data["developers"].first
      image_url = game_data["header_image"]
      game = Game.find_by(appid: appid)
      game.update(image_url:, developer:)
    end
  end

  def self.add_to_owned_games(appid, user)
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
end
