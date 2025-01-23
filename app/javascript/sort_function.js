// sorting options - Alphabetically, completed?, not completed? etc, date added?, date completed?
// Maybe put a hold on this until I figure out what else I should do with data

import { changeOwnedGameOrder } from "./change_order";

function addSortFunctions() {
  switch (window.location.pathname) {
    case "/games":
      addSortingToOwnedGames();
      break;
  }
}

function addSortingToOwnedGames() {
  const sortDropdown = document.querySelector(".sort-dropdown");
  // When creating the actual logic, it will have to be on the <p> selected on the dropdown menu
  // sortDropdown.addEventListener("click", sortGames);

  const caret = document.querySelector(".sort-caret");

  clearSort();
  selectSort();
  closeDropdown(caret, sortDropdown);
  openDropdown(caret, sortDropdown);
}

function clearSort() {
  const clearSortButton = document.querySelector(".clear-sort-button");
  clearSortButton.removeEventListener("click", setDropdownText);
  clearSortButton.addEventListener("click", setDropdownText);
}

function selectSort() {
  const dropdownOptions = document.querySelectorAll(".sort-dropdown-options");
  dropdownOptions.forEach((option) => {
    option.removeEventListener("click", setDropdownText)
    option.addEventListener("click", setDropdownText);
  });
}

function openDropdown(caret, sortDropdown) {
  sortDropdown.removeEventListener("click", openDropdownCallback);
  sortDropdown.addEventListener("click", () => openDropdownCallback(caret));
}

function openDropdownCallback(caret) {
  caret.classList.toggle("caret-rotate");
  toggleDropdownMenu(caret);
}

function closeDropdown(caret, sortDropdown) {
  document.removeEventListener("click", closeDropdownCallback);
  document.addEventListener("click", (event) => closeDropdownCallback(event, caret, sortDropdown));
}

function closeDropdownCallback(event, caret, sortDropdown) {
  if (event.target.closest(".sort-dropdown") !== sortDropdown) {
    // This location check is needed because it's attached to the document itself, and works weirdly with turbo loading
    if (window.location.pathname === "/games") {
      caret.classList.remove("caret-rotate");
      toggleDropdownMenu(caret);
    }
  }
}

function toggleDropdownMenu(caret) {
  const sortDropdown = document.querySelector(".sort-dropdown-options");
  // Doing toggle doesn't work with how closeDropdown is set up
  if (caret.classList.contains("caret-rotate")) {
    sortDropdown.classList.remove("d-none");
  } else {
    sortDropdown.classList.add("d-none");
  }
}

function setDropdownText(event) {
  const sortText = document.querySelector(".sort-label-text");
  if (event.target.innerText === "Clear sort") {
    sortText.innerText = "Select your sort method";
  } else {
    sortText.innerText = event.target.innerText;
  }
  sortGames(event);
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
      alphabeticalSort(games);
      break;
    case "playtime (high to low)":
      startPlaytimeSort(games, "most");
      break;
    case "playtime (low to high)":
      startPlaytimeSort(games, "least");
      break;
    // case "most recently played":
    //   recentSort(games, "most");
    //   break;
    // case "least recently played":
    //   recentSort(games, "least");
    //   break;
  }
  setTimeout(() => {
    changeOwnedGameOrder();
  }, 1);

}

function startPlaytimeSort(games, sortMethod) {
  games.sort((a, b) => {
    const aPlaytime = parseFloat(a.querySelector(".playtime").innerText);
    const bPlaytime = parseFloat(b.querySelector(".playtime").innerText);
    return sortMethod === "most" ? playtimeSort(bPlaytime, aPlaytime) : playtimeSort(aPlaytime, bPlaytime);
  })
}

function playtimeSort(first, second) {
  if (first < second) {
    return -1;
  }
  if (first > second) {
    return 1;
  }
  return 0;
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

document.addEventListener("turbo:load", addSortFunctions);
