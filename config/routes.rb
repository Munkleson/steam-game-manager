Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  # get "/", to: "owned_games#index"

  #owned games

  get "/games", to: "owned_games#owned_games_list", as: :owned_games_list
  get "/add", to: "owned_games#index", as: :add_games

  get "/search", to: "owned_games#search"
  get "/short_search", to: "owned_games#short_search"

  post "/add", to: "owned_games#create_game"

  patch "/update", to: "owned_games#update"
  patch "/update_order", to: "owned_games#update_order"

  delete "/delete", to: "owned_games#delete"

  # playlists

  get "/playlists", to: "playlists#playlists_main_page", as: :playlists
  get "/refresh_playlists", to: "playlists#refresh_playlists"

  post "/create_playlist", to: "playlists#create_playlist"
  post "/add_game_to_playlist", to: "playlists#add_game_to_playlist"

  patch "/update_playlist_order", to: "playlists#update_playlist_order"
  patch "/update_playlist_games_order", to: "playlists#update_playlist_games_order"

  delete "/remove_game_from_playlist", to: "playlists#remove_game_from_playlist"
  delete "/delete_playlist", to: "playlists#delete_playlist"
end
