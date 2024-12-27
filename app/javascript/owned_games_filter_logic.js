var filter = document.querySelector(".filter-dropdown");
var caret = document.querySelector(".caret");
var filterText = document.querySelector(".filter-label-text")
var filterDropdown = document.querySelector(".filter-dropdown-options");
var filterByText = document.querySelector(".filter-by-text");

// completed, not completed, played, not played, clear

filter.addEventListener("click", (event) => {
  caret.classList.toggle("caret-rotate");
  toggleDropdownMenu();
});

// Closing drop down menu and rotating caret again
document.addEventListener("click", (event) => {
  if (event.target.closest(".filter-dropdown") !== filter) {
    caret.classList.remove("caret-rotate");
    toggleDropdownMenu();
  }
})

function toggleDropdownMenu() {
  if (caret.classList.contains("caret-rotate")) {
    filterDropdown.classList.remove("opacity-0");
    filterDropdown.classList.add("opacity-100");
  } else {
    filterDropdown.classList.remove("opacity-100");
    filterDropdown.classList.add("opacity-0");
  }
}

var dropdownOptions = document.querySelectorAll(".dropdown-options");

dropdownOptions.forEach((option) => {
  option.addEventListener("click", (event) => {
    if (event.target.innerText === "Clear filter") {
      filterText.innerText = "Select your filter";
      filterByText.innerText = "Filter by:"
    } else {
      filterText.innerText = event.target.innerText;
      filterByText.innerText = "Filtering by:";
    }
    filterGames(event.target.innerText);
  });
});

function filterGames(selection) {
  const games = document.querySelectorAll(".game-card");

  games.forEach((game) => {
    console.log(game);
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