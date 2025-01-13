function filterOwnedGamesInitialize() {
  // caret is the little arrow on the right of the select filter menu
  const caret = document.querySelector(".caret");
  const filter = document.querySelector(".filter-dropdown");

  clearFilter();
  selectFilter();
  closeDropdown(caret, filter);
  openDropdown(caret, filter);
}

function clearFilter() {
  const clearFilterButton = document.querySelector(".clear-filter-button");
  clearFilterButton.removeEventListener("click", setDropdownText);
  clearFilterButton.addEventListener("click", setDropdownText);
}

function selectFilter() {
  const dropdownOptions = document.querySelectorAll(".dropdown-options");
  dropdownOptions.forEach((option) => {
    option.removeEventListener("click", setDropdownText)
    option.addEventListener("click", setDropdownText);
  });
}

function openDropdown(caret, filter) {
  filter.removeEventListener("click", openDropdownCallback);
  filter.addEventListener("click", () => openDropdownCallback(caret));
}

function openDropdownCallback(caret) {
  caret.classList.toggle("caret-rotate");
  toggleDropdownMenu(caret);
}

function closeDropdown(caret, filter) {
  document.removeEventListener("click", closeDropdownCallback);
  document.addEventListener("click", (event) => closeDropdownCallback(event, caret, filter));
}

function closeDropdownCallback(event, caret, filter) {
  if (event.target.closest(".filter-dropdown") !== filter) {
    // This location check is needed because it's attached to the document itself, and works weirdly with turbo loading
    if (window.location.pathname === "/games") {
      caret.classList.remove("caret-rotate");
      toggleDropdownMenu(caret);
    }
  }
}

function toggleDropdownMenu(caret) {
  const filterDropdown = document.querySelector(".filter-dropdown-options");
  // Doing toggle doesn't work with how closeDropdown is set up
  if (caret.classList.contains("caret-rotate")) {
    filterDropdown.classList.remove("d-none");
  } else {
    filterDropdown.classList.add("d-none");
  }
}

function setDropdownText(event) {
  const filterText = document.querySelector(".filter-label-text");
  if (event.target.innerText === "Clear filter") {
    filterText.innerText = "Select your filter";
  } else {
    filterText.innerText = event.target.innerText;
  }
  filterGames(event.target.innerText);
}

function filterGames(selection) {
  const games = document.querySelectorAll(".game-card");

  games.forEach((game) => {
    game.classList.remove("d-none");
    if (selection === "Clear filter") {
      return;
    }
    const completedCheckbox = game.querySelector(".completed-checkbox");
    const playedCheckbox = game.querySelector(".played-checkbox");

    switch (selection) {
      case "Completed":
        if (!completedCheckbox.checked) {
          game.classList.add("d-none");
        }
        break;
      case "Not completed":
        if (completedCheckbox.checked) {
          game.classList.add("d-none");
        }
        break;
      case "Played":
        if (!playedCheckbox.checked) {
          game.classList.add("d-none");
        }
        break;
      case "Not played":
        if (playedCheckbox.checked) {
          game.classList.add("d-none");
        }
        break;
    }
  })
}

document.addEventListener("turbo:load", () => {
  if (window.location.pathname === "/games") {
    filterOwnedGamesInitialize();
  }
});
