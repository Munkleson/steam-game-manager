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
  get "/delete", to: "owned_games#delete", as: :delete

  get "/search", to: "owned_games#search"
  get "/short_search", to: "owned_games#short_search"

  post "/add", to: "owned_games#create_game"

  patch "/update", to: "owned_games#update"
  patch "/update_order", to: "owned_games#update_order"

  delete "/delete", to: "owned_games#delete"

  # playlists

  get "/playlists", to: "playlists#playlists_main_page", as: :playlists

  post "/create_playlist", to: "playlists#create_playlist"
end
