function loadSearchFunctionLogic() {
  const input = document.querySelector("#search-input")
  const form = document.querySelector("#search-form")

  input.select();

  let gameList;

  const searchDropdown = document.querySelector("#search-dropdown");

  input.addEventListener("keyup", (event) => {
    searchDropdown.innerHTML = "";
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
  });

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
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    // form.submit();
  });
}

loadSearchFunctionLogic();
