# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"

pin "onload_event_listeners", to: "onload_event_listeners.js"
pin "load_sortables", to: "load_sortables.js"
pin "sort_function", to: "sort_function.js"
pin "search_games", to: "search_games.js"
pin "steam_login", to: "steam_login.js"
