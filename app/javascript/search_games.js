function addSearchGamesFunctionality() {
  // if conditions are to check if it is on a page with this script's functions or not
  const searchBar = document.querySelector(".search-bar");
  if (searchBar) {
    searchBar.addEventListener("keyup", (event) => startGamesSearch(searchBar, event));
  }
  const clearSearchButton = document.querySelector(".clear-search-button");
  if (clearSearchButton) {
    clearSearchButton.addEventListener("click", () => clearSearch(searchBar));
  }
}

function startGamesSearch(searchBar, event) {
  if (!checkValidKey(event.key)) return;
  const games = getSearchGamesCards();
  const input = regexifySearchParameters(searchBar.value.toLowerCase());
  if (input.length > 0) {
    filterGames(games, input)
  } else {
    removeAllFilters(games);
  }
}

function checkValidKey(key) {
  return key.length === 1 || key === "Backspace";
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
  const regex = /[^a-zA-Z0-9]/gi;
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

function clearSearch(searchBar) {
  const games = getSearchGamesCards();
  games.forEach(game => game.classList.remove("d-none"));
  searchBar.select();
  searchBar.value = "";
}

document.addEventListener("turbo:load", addSearchGamesFunctionality);
