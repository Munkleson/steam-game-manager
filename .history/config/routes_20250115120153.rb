Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "homepage#index"

  ##### owned games

  resources :owned_games, only: [:create, :update, :destroy] do
    collection do
      get "search"
      patch "update_order"
    end
  end

  get "/games", to: "owned_games#index", as: :library
  get "/add_games", to: "owned_games#new", as: :add_games
  # get "/owned_games/search", to: "owned_games#search"
  # post "/owned_games", to: "owned_games#create"
  # patch "/owned_games", to: "owned_games#update"
  # patch "/owned_games/update_order", to: "owned_games#update_order"
  # delete "/owned_games", to: "owned_games#destroy"

  ##### playlists

  resources :playlists, only: [:create, :destroy] do
    collection do
      get "refresh_playlists"
      patch "update_order"
    end
  end

  get "/playlists", to: "playlists#playlists_main_page", as: :playlists_main_page
  # get "/playlists/refresh_playlists", to: "playlists#refresh_playlists"
  # post "/playlists", to: "playlists#create"
  # patch "/playlists/update_order", to: "playlists#update_order"
  # delete "/playlists", to: "playlists#destroy"

  ##### playlist games

  resources :playlist_games, only: [:create, :destroy] do
    collection do
      patch "update_order"
    end
  end

  # post "/playlist_games", to: "playlist_games#create"
  # patch "/playlist_games/update_order", to: "playlist_games#update_order"
  # delete "/playlist_games", to: "playlist_games#destroy"

  ##### Steam authentication

  get '/steam/authenticate', to: 'steam_auth#authenticate'
  get '/steam/callback', to: 'steam_auth#callback'

  ##### Sessions

  delete '/logout', to: 'sessions#destroy', as: :logout
end
