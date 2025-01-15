Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "homepage#index"

  ##### Owned games
  resources :owned_games, only: [:create, :update, :destroy] do
    collection do
      get "search"
      patch "update_order"
    end
  end

  get "/games", to: "owned_games#index", as: :library
  get "/add_games", to: "owned_games#new", as: :add_games

  ##### Playlists
  resources :playlists, only: [:create, :destroy] do
    collection do
      get "refresh_playlists"
      patch "update_order"
    end
  end

  get "/playlists", to: "playlists#playlists_main_page", as: :playlists_main_page

  ##### Playlist games
  resources :playlist_games, only: [:create, :destroy] do
    collection do
      patch "update_order"
    end
  end

  ##### Steam authentication
  get '/steam/authenticate', to: 'steam_auth#authenticate'
  get '/steam/callback', to: 'steam_auth#callback'

  ##### Sessions
  delete '/logout', to: 'sessions#destroy', as: :logout
end
