Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  # get "/", to: "owned_games#index"

  #owned games

  get "/games", to: "owned_games#index", as: :owned_games_list
  get "/add", to: "owned_games#new", as: :add_games

  get "/search", to: "owned_games#search"
  get "/short_search", to: "owned_games#short_search"

  post "/owned_games", to: "owned_games#create"

  patch "/owned_games", to: "owned_games#update"
  patch "/owned_games_order", to: "owned_games#update_order"

  delete "/owned_games", to: "owned_games#destroy"

  # playlists

  get "/playlists", to: "playlists#playlists_main_page", as: :playlists
  get "/refresh_playlists", to: "playlists#refresh_playlists"

  post "/playlists", to: "playlists#create"

  patch "/playlists_order", to: "playlists#update_order"

  delete "/playlists", to: "playlists#destroy"

  # playlist games

  post "/playlist_games", to: "playlist_games#create"

  patch "/playlist_games_order", to: "playlist_games#update_order"

  delete "/playlist_games", to: "playlist_games#destroy"

end
