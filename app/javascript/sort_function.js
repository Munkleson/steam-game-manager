// sorting options - Alphabetically, completed?, not completed? etc, date added?, date completed?
// Maybe put a hold on this until I figure out what else I should do with data

function addSortFunctions() {
  switch (window.location.pathname) {
    case "/games":
      addSortingToOwnedGames();
      break;
  }
}

function addSortingToOwnedGames() {
  // When creating the actual logic, it will have to be on the <p> selected on the dropdown menu
  const sortButton = document.querySelector(".test-button");
  sortButton.addEventListener("click", sortGames);
}

function sortGames(event) {
  const container = document.querySelector(".main-body-container");
  const games = [...document.querySelectorAll(".game-card")];

  whichSortMethod(games, event.target.innerText.toLowerCase());
  updateGamesContainers(games, container);
}

function updateGamesContainers(games, container) {
  container.innerHTML = "";
  games.forEach(game => container.append(game));
}

function whichSortMethod(games, sortMethod) {
  switch (sortMethod) {
    case "alphabetical order":
      alphabeticalSort(games)
      break;
  }
}

function alphabeticalSort(games) {
  games.sort((a, b) => {
    const aName = a.querySelector(".card-title").innerText;
    const bName = b.querySelector(".card-title").innerText;
    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });
}

// document.addEventListener("turbo:load", addSortFunctions);
