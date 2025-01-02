function loadSearchFunctionLogic() {
  const input = document.querySelector("#search-input")
  const form = document.querySelector("#search-form")

  let gameList;

  const searchDropdown = document.querySelector("#search-dropdown");
  const searchInputSubmitContainer = document.querySelector(".search-input-submit-container");
  const submitButton = document.querySelector(".submit-button");

  const responseTextElement = document.querySelector(".response-text");

  let currentArrowKeyPosition;

  const searchRadios = document.querySelectorAll(".search-radios");

  input.addEventListener("keyup", (event) => {
    if (event.key !== "Enter" && event.key !== "ArrowUp" && event.key !== "ArrowDown") {
      searchForGamesOrDlc(event.currentTarget)
    }
    // if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    //   dropDownArrowMovement(event.key);
    // }
  });

  input.addEventListener("keydown", (event) => { // This is needed to stop the text position moving to the beginning or end of input
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      dropDownArrowMovement(event.key);
    }
  });

  function dropDownArrowMovement(key) {
    let previousSelected;
    let currentSelected;
    if (gameList) {
      if (key === "ArrowDown") {
        if (currentArrowKeyPosition === gameList.length) {
          currentArrowKeyPosition = 1;
        } else {
          currentArrowKeyPosition += (currentArrowKeyPosition !== gameList.length) ? 1 : 0;
        }

        if (currentArrowKeyPosition === 1) {
          previousSelected = document.querySelector(`[data-position="${gameList.length}"]`);
        } else if (currentArrowKeyPosition !== 0) {
          previousSelected = document.querySelector(`[data-position="${currentArrowKeyPosition - 1}"]`);
        }
        currentSelected = document.querySelector(`[data-position="${currentArrowKeyPosition}"]`);
      }
      if (key === "ArrowUp") {
        if (currentArrowKeyPosition === 0 || currentArrowKeyPosition === 1) {
          currentArrowKeyPosition = gameList.length;
        } else {
          currentArrowKeyPosition -= (currentArrowKeyPosition !== 1) ? 1 : 0;
        }

        if (currentArrowKeyPosition === gameList.length) {
          previousSelected = document.querySelector(`[data-position="1"]`);
        } else if (currentArrowKeyPosition !== 0) {
          previousSelected = document.querySelector(`[data-position="${currentArrowKeyPosition + 1}"]`);
        }
        currentSelected = document.querySelector(`[data-position="${currentArrowKeyPosition}"]`);
      }

      if (previousSelected && previousSelected.classList.contains("dropdown-item-selected")) {
        previousSelected.classList.remove("dropdown-item-selected");
      }
      if (currentSelected) {
        currentSelected.classList.add("dropdown-item-selected");
        input.value = currentSelected.innerText;
      }
    }
  }

  function searchForGamesOrDlc(element) {
    currentArrowKeyPosition = 0;
    searchDropdown.innerHTML = "";
    responseTextElement.innerText = "";
    responseTextElement.classList.remove("success-text-opacity-filled");
    responseTextElement.classList.remove("error-text-opacity-filled");
    responseTextElement.classList.remove("text-success");
    responseTextElement.classList.remove("text-danger");

    const type = document.querySelector('input[name="search-type"]:checked').value;

    let input = element.value;
    const params = new URLSearchParams({ input: input, type: type }).toString();
    let searchRoute;

    if (input.length > 4) {
      searchRoute = "search";
      fetchFromDb(searchRoute, params);
    } else if (input.length > 3) {
       searchRoute = "short_search"
      fetchFromDb(searchRoute, params);
    }
  }

  function fetchFromDb(searchRoute, params) {
    fetch(`/${searchRoute}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => response.json())
    .then(data => {
      gameList = data;
      displayDropdown(gameList);
    })
    .catch(error => console.error('Error:', error));
  }

  function displayDropdown(filteredList) {
    // Needed here as sometimes pressing keys too quickly could lead to the same list being appended twice to the dropdown
    searchDropdown.innerHTML = "";
    const length = filteredList.length >= 10 ? 10 : filteredList.length;
    for (let index = 0; index < length; index++) {
      const dropdownOption = document.createElement("div");
      dropdownOption.innerText = filteredList[index].name;
      dropdownOption.classList.add("dropdown-item");
      dropdownOption.classList.add("dropdown-item-hidden");
      dropdownOption.dataset.position = index + 1;
      dropdownOption.addEventListener("click", (event) => selectDropdownItem(event.currentTarget));

      // This seems a bit visually janky. Can always take out if needed and just keep everything as overflow for names that are too long, which should be few anyway
      dropdownOption.addEventListener("mouseover", (event) => {
        event.target.classList.remove("dropdown-item-hidden");
        event.target.classList.add("dropdown-item-shown");
        event.target.addEventListener("mouseleave", (event) => {
          event.target.classList.remove("dropdown-item-shown");
          event.target.classList.add("dropdown-item-hidden");
        });
      });

      searchDropdown.append(dropdownOption);
    }
  }

  function selectDropdownItem(target) {
    input.value = target.innerText;
  }

  function minimalizeWord(word) {
    const split = word.split("");
    const regex = new RegExp(/\w/);
    return split.filter(letter => regex.test(letter)).join("");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    //// logic for form validation here. If it is valid, then submit, else display errors
    const game = gameList.find(game => minimalizeWord(game.name.toLowerCase()) === minimalizeWord(input.value.toLowerCase()));

    // This is here to check if input matches any game at all. Required since the logic below doesn't include this, as if it encounters this error it keeps the button disabled
    const type = document.querySelector('input[name="search-type"]:checked').value === "game" ? "Game" : "DLC"

    if (!game) {
      creationResponseDisplay({ error: "not found"}, type);
      submitButton.disabled = false;
      return;
    }

    const params = { appid: game.appid.toString() };

    fetch(`/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
      },
      body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
      creationResponseDisplay(data, type);
      input.value = data.name;
      submitButton.disabled = false;
      input.select();
    })
    .catch(error => {
      console.error('Error:', error);
      creationResponseDisplay({ error: "connection issue" }, type);
      submitButton.disabled = false;
    });
  });

  function creationResponseDisplay(response, type) {
    responseTextElement.classList.remove("success-text-opacity-filled");
    responseTextElement.classList.remove("error-text-opacity-filled");
    responseTextElement.classList.remove("text-success");
    responseTextElement.classList.remove("text-danger");
    let responseText;
    if (response.appid) {
      responseText = `${type} successfully added to your library`;
      responseTextElement.classList.add("text-success"); // Bootstrap class
      setTimeout(() => {
        searchDropdown.innerHTML = "";
        responseTextElement.classList.add("success-text-opacity-filled");
      }, 10);
    } else {
      if (response.error === "not found") {
        responseText = `${type} details could not be found or retrieved from the Steam API`;
      } else if (response.error === "taken") {
        responseText = `${type} already exists in your library`;
      } else if (response.error === "not out") {
        responseText = `${type} is not released yet`;
      } else {
        responseText = `Failed to add game to your library at this time. Please check your connection and try again`;
      }
      responseTextElement.classList.add("text-danger"); // Bootstrap class
      setTimeout(() => {
        searchDropdown.innerHTML = "";
        responseTextElement.classList.add("error-text-opacity-filled");
      }, 10);
    }
    responseTextElement.innerText = responseText;
    searchInputSubmitContainer.insertAdjacentElement("afterend", responseTextElement);
    input.select();
  }

  searchRadios.forEach((radioButton) => {
    radioButton.addEventListener("click", () => {
      const currentInput = document.querySelector("#search-input");
      searchForGamesOrDlc(currentInput);
      setTimeout(() => {
        input.select();
      }, 1);
    });
  });
}

loadSearchFunctionLogic();
