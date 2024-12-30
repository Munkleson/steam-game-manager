function loadSearchFunctionLogic() {
  const input = document.querySelector("#search-input")
  const form = document.querySelector("#search-form")

  let gameList;

  const searchDropdown = document.querySelector("#search-dropdown");
  const searchInputSubmitContainer = document.querySelector(".search-input-submit-container");
  const submitButton = document.querySelector(".submit-button");

  const responseTextElement = document.querySelector(".response-text");

  let currentArrowKeyPosition;

  input.addEventListener("keyup", (event) => {
    if (event.key !== "Enter" && event.key !== "ArrowUp" && event.key !== "ArrowDown") {
      currentArrowKeyPosition = 0;
      searchDropdown.innerHTML = "";
      responseTextElement.innerText = "";
      responseTextElement.classList.remove("success-text-opacity-filled");
      responseTextElement.classList.remove("error-text-opacity-filled");
      responseTextElement.classList.remove("text-success");
      responseTextElement.classList.remove("text-danger");

      let input = event.currentTarget.value;
      const params = new URLSearchParams({ input: input }).toString();
      let searchRoute;

      if (input.length > 4) {
        searchRoute = "search";
        fetchFromDb(searchRoute, params)
      } else if (input.length > 3) {
        searchRoute = "short_search"
        fetchFromDb(searchRoute, params)
      }
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      dropDownArrowMovement(event.key);
    }
  });

  input.addEventListener("keydown", (event) => { // This is needed to stop the text position moving to the beginning or end of input
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }
  });

  function dropDownArrowMovement(key) {
    let previousSelected;
    let currentSelected;
    if (gameList) {
      if (key === "ArrowDown") {
        currentArrowKeyPosition += (currentArrowKeyPosition !== gameList.length) ? 1 : 0;
        if (currentArrowKeyPosition !== 0) {
          previousSelected = document.querySelector(`[data-position="${currentArrowKeyPosition - 1}"]`);
          currentSelected = document.querySelector(`[data-position="${currentArrowKeyPosition}"]`);
        } else {
          currentSelected = document.querySelector(`[data-position="${currentArrowKeyPosition}"]`);
        }
      }
      if (key === "ArrowUp") {
        if (currentArrowKeyPosition === 0) {
          currentArrowKeyPosition = 1;
        } else {
          currentArrowKeyPosition -= (currentArrowKeyPosition !== 1) ? 1 : 0;
        }
        if (currentArrowKeyPosition !== 0) {
          previousSelected = document.querySelector(`[data-position="${currentArrowKeyPosition + 1}"]`);
          currentSelected = document.querySelector(`[data-position="${currentArrowKeyPosition}"]`);

        } else {
          currentSelected = document.querySelector(`[data-position="${currentArrowKeyPosition}"]`);
        }
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

  function fetchFromDb(searchRoute, params) {
    fetch(`/${searchRoute}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => response.json())
    .then(data => {
      gameList = data;
      // console.log(gameList);
      displayDropdown(gameList);
    })
    .catch(error => console.error('Error:', error));
  }

  function displayDropdown(filteredList) {
    for (let index = 0; index < filteredList.length; index++) {
      const dropdownOption = document.createElement("div");
      dropdownOption.innerText = filteredList[index].name;
      dropdownOption.classList.add("dropdown-item");
      dropdownOption.dataset.position = index + 1;

      dropdownOption.addEventListener("click", (event) => selectDropdownItem(event.currentTarget));

      searchDropdown.append(dropdownOption)
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
    const appidParam = document.querySelector("#hidden-appid");
    appidParam.value = game.appid;
    // input.value = game.name;

    const params = { appid: appidParam.value.toString() };

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
      console.log(data);
      creationResponseDisplay(data)
      input.value = data.name
      input.select();
      submitButton.disabled = false;
    })
    .catch(error => {
      console.error('Error:', error)
    });
    // form.submit();
  });

  function creationResponseDisplay(response) {
    responseTextElement.classList.remove("success-text-opacity-filled");
    responseTextElement.classList.remove("error-text-opacity-filled");
    responseTextElement.classList.remove("text-success");
    responseTextElement.classList.remove("text-danger");
    // const responseTextElement = document.createElement("p");
    let responseText;
    if (response.appid) {
      responseText = "Game successfully added to your library";
      responseTextElement.classList.add("text-success"); // Bootstrap class
      setTimeout(() => {
        searchDropdown.innerHTML = "";
        responseTextElement.classList.add("success-text-opacity-filled");
      }, 10);
    } else {
      if (response.error === "not found") {
        responseText = "Game could not be found on the Steam API";
      } else {
        responseText = "Game already exists in your library";
      }
      responseTextElement.classList.add("text-danger"); // Bootstrap class
      setTimeout(() => {
        searchDropdown.innerHTML = "";
        responseTextElement.classList.add("error-text-opacity-filled");
      }, 10);
    }
    responseTextElement.innerText = responseText;
    searchInputSubmitContainer.insertAdjacentElement("afterend", responseTextElement);
  }

}

loadSearchFunctionLogic();
