function addSearchGamesFunctionality() {
  const searchBar = document.querySelector(".search-bar");
  searchBar.addEventListener("keyup", (event) => startGamesSearch(searchBar, event));
}

function startGamesSearch(searchBar, event) {
  const games = getSearchGamesCards();
  const input = regexifySearchParameters(searchBar.value.toLowerCase());
  if (input.length > 0) {
    filterGames(games, input)
  } else {
    removeAllFilters(games);
  }
}

function filterGames(games, input) {
    games.forEach((game) => {
      let gameTitle = game.querySelector(".card-title").innerText.toLowerCase();
      gameTitle = regexifySearchParameters(gameTitle);
      if (!gameTitle.includes(input)) {
        game.classList.add("d-none");
      } else {
        game.classList.remove("d-none");
      }
    });
}

function regexifySearchParameters(input) {
  const regex = /[^a-zA-Z0-9]/gi
  return input.replaceAll(regex, "");
}

function removeAllFilters(games) {
  games.forEach(game => game.classList.remove("d-none"));
}

function getSearchGamesCards() {
  switch (window.location.pathname) {
    case "/games":
      return document.querySelectorAll(".game-card");
    case "/playlists":
      return document.querySelectorAll(".add-game-card");
  }
}

document.addEventListener("turbo:load", addSearchGamesFunctionality);
