import { deletePlaylist } from './delete_playlist';
import { selectPlaylist } from './select_playlist';

function loadCreatePlaylistLogic() {
  const createPlaylistButton = document.querySelector(".create-playlist-button");

  // controls the opening and closing of the form
  let formActive = false;
  let currentlySubmitting = false;

  createPlaylistButton.addEventListener("click", generateForm);

  function generateForm() {
    // disable form creation and removal if it is currently submitting and a response is not received yet
    if (!currentlySubmitting) {
      if (formActive) {
        const currentForm = document.querySelector(".playlist-form");
        currentForm.remove();
      } else {
        const form = createForm();
        form.append(generateTextLabelandInput("Playlist name", "name"));
        form.append(generateButtons());
        form.addEventListener("submit", (event) => submitPlaylistCreation(event, form));
        document.body.append(form);
      }
      formActive = formActive ? false : true;
    }
  }

  function submitPlaylistCreation(event, form) {
    event.preventDefault();
    // put here so the querying isn't done twice. Could put it in the actual function for code cleanliness though
    const submitButton = document.querySelector(".playlist-submit-button");
    const closeButton = document.querySelector(".playlist-close-button");
    toggleButtonsDisabledState(submitButton, closeButton);

    const params = {};
    const nameElement = document.querySelector('input[name="name"]');
    params.name = nameElement.value;

    removeResponseTexts();
    fetch('/create_playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
      },
      body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
      switch (data.message) {
        case "success":
          appendNewPlaylist(data.id, params.name);
          successfulSubmit(form, submitButton, closeButton);
          createCrudMessage("Playlist created");
          break;
        case "exists":
          unsuccessfulSubmit("This playlist already exists", nameElement, submitButton, closeButton);
          break;
        default:
          unsuccessfulSubmit("The playlist could not be created at this time", submitButton, submitButton, closeButton);
        break;
      }
    })
    .catch(error => {
      console.error(error);
      unsuccessfulSubmit("The playlist could not be created at this time", submitButton, submitButton, closeButton)
    });
  }

  function appendNewPlaylist(id, name) {
    const playlistList = document.querySelector(".playlist-list");
    const playlistElement = document.createElement("li");
    playlistElement.classList.add("playlist-items");
    playlistElement.classList.add("col-12");
    playlistElement.classList.add("d-flex");
    playlistElement.classList.add("align-items-center");
    playlistElement.classList.add("justify-content-between");
    playlistElement.dataset.playlistId = id;
    playlistElement.innerText = name;
    playlistList.append(playlistElement);

    playlistElement.innerHTML = `
      <p class="playlist-name-container pe-2"><span class="playlist-name"></span>&nbsp;<span class="games-count text-primary">(0)</span></p>
      <div class="playlist-stats-container ms-auto me-5">
        <div class="stats-bar playlist-stats-bar d-flex flex-column justify-content-center align-items-end">
          <div class="stats-text-container d-flex flex-row justify-content-between">
            <p>Games completed:</p>
            <p><strong class="completed-percentage">0%</strong></p>
          </div>
          <div class="rate-bar position-relative">
            <div class="completed-rate position-absolute"></div>
          </div>
          <div class="stats-text-container d-flex flex-row justify-content-between">
            <p>Games played:</p>
            <p><strong class="played-percentage">0%</strong></p>
          </div>
          <div class="rate-bar position-relative">
            <div class="played-rate position-absolute"></div>
          </div>
        </div>
      </div>
      <form class="delete-playlist-form d-flex justify-content-center align-items-center">
        <input type="submit" value="Delete playlist" class="btn btn-danger ps-1 pe-1 pt-1 pb-1">
      </form>
    `;

    // This is done here instead of above to sanitize from any XSS vulnerabilities
    playlistElement.querySelector(".playlist-name").innerText = name;

    const playlistDeleteForm = playlistElement.querySelector("form");
    if (!playlistDeleteForm.dataset.hasEvent) {
      playlistDeleteForm.dataset.hasEvent = true;
      playlistDeleteForm.addEventListener("submit", deletePlaylist);
    }

    playlistElement.addEventListener("click", selectPlaylist);
    // Automatically select the first playlist created for better UE
    // if (document.querySelectorAll(".playlist-items").length === 1) {
    //   playlistElement.classList.add("selected-playlist");
    // }
    selectPlaylist(playlistElement);
  }

  function removeResponseTexts() {
    const responseTexts = document.querySelectorAll(".response-text");
    if (responseTexts) {
      responseTexts.forEach(element => element.remove());
    }
  }

  function successfulSubmit(form, submitButton, closeButton) {
    form.remove();
    formActive = false;
    toggleButtonsDisabledState(submitButton, closeButton);
  }

  function unsuccessfulSubmit(text, elementToAppendTo, submitButton, closeButton) {
    const failText = document.createElement("p");
    failText.innerText = text;
    failText.classList.add("response-text");
    failText.classList.add("text-danger")
    setTimeout(() => {
      failText.classList.add("error-text-opacity-filled");
    }, 10);

    elementToAppendTo.insertAdjacentElement("afterend", failText);

    toggleButtonsDisabledState(submitButton, closeButton);
  }

  function toggleButtonsDisabledState(submitButton, closeButton) {
    submitButton.disabled = !submitButton.disabled;
    closeButton.disabled = !closeButton.disabled;
    currentlySubmitting = !currentlySubmitting;
  }

  function generateButtons() {
    const buttonDivFlexContainer = document.createElement("div");
    buttonDivFlexContainer.classList.add("d-flex");
    buttonDivFlexContainer.classList.add("flex-column");
    buttonDivFlexContainer.classList.add("align-items-center");
    buttonDivFlexContainer.classList.add("justify-content-center");
    buttonDivFlexContainer.classList.add("button-div-flex-container");

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-div");
    buttonDiv.classList.add("d-flex");
    buttonDiv.classList.add("flex-column");
    buttonDiv.classList.add("align-items-center");
    buttonDiv.classList.add("justify-content-center");

    buttonDiv.append(generateSubmitInput());
    buttonDiv.append(generateCloseButton());

    buttonDivFlexContainer.append(buttonDiv);
    return buttonDivFlexContainer;
  }

  function generateCloseButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.innerText = "Close";
    button.classList.add("btn");
    button.classList.add("btn-danger");
    button.classList.add("mt-1");
    button.classList.add("playlist-close-button");

    button.addEventListener("click", () => {
      const currentForm = document.querySelector(".playlist-form");
      currentForm.remove();
      formActive = false;
    })
    return button;
  }

  function generateTextLabelandInput(labelText, name) {
    const labelInputHolder = document.createElement("div");

    const label = document.createElement("label");
    label.innerText = labelText;
    label.classList.add("form-label");
    labelInputHolder.append(label);

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = labelText;
    input.name = name;
    input.classList.add("form-control");
    input.spellcheck = false;
    labelInputHolder.append(input);

    // SetTimeout needs to be done as the form is not really "created" yet so to speak
    setTimeout(() => {
      input.select();
    }, 1);

    return labelInputHolder;
  }

  function generateSubmitInput() {
    const input = document.createElement("input");
    input.type = "submit";
    input.classList.add("btn");
    input.classList.add("btn-success");
    input.classList.add("mt-2");
    input.classList.add("text-center");
    input.classList.add("playlist-submit-button");
    input.value = "Create playlist"
    return input;
  }

  function createForm() {
    const form = document.createElement("form");
    form.classList.add("playlist-form");
    form.classList.add("card");
    return form;
  }
}

// logic here checks the path so it doesn't load on another page that it shouldn't, like library
// document.addEventListener("turbo:load", () => {
//   console.log("hi");

//   if (window.location.pathname === '/playlists') {
//     loadCreatePlaylistLogic();
//   }
// });

export { loadCreatePlaylistLogic }
