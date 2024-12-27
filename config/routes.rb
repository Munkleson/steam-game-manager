Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  # get "/", to: "owned_games#index"
  get "/games", to: "owned_games#owned_games_list", as: :owned_games_list
  get "/add", to: "owned_games#index", as: :home
  get "/delete", to: "owned_games#delete", as: :delete

  post "/add", to: "owned_games#create"

  patch "/update", to: "owned_games#update"

  delete "/delete", to: "owned_games#delete"
end
