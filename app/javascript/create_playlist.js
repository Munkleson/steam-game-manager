function loadCreatePlaylistLogic() {
  const createPlaylistButton = document.querySelector(".create-playlist-button");

  // controls the opening and closing of the form
  let formActive = false;
  let currentlySubmitting = false;

  createPlaylistButton.addEventListener("click", generateForm);

  function generateForm() {
    const currentForm = document.querySelector(".playlist-form");
    // disable form creation and removal if it is currently submitting and a response is not received yet
    if (!currentlySubmitting) {
      if (formActive) {
        currentForm.remove();
      } else {
        const form = createForm();
        form.append(generateTextLabelandInput("Playlist name", "name"));
        form.append(generateButtons());
        form.addEventListener("submit", submitPlaylistCreation);
        document.body.append(form);
      }
      formActive = formActive ? false : true;
    }
  }

  function submitPlaylistCreation(event) {
    event.preventDefault();
    // put here so the querying isn't done twice. Could put it in the actual function for code cleanliness though
    const submitButton = document.querySelector(".submit-button");
    const closeButton = document.querySelector(".close-button");
    toggleButtonsDisabledState(submitButton, closeButton);
    const params = {};
    const name = document.querySelector('input[name="name"]').value;

    params.name = name;

    fetch('/create_playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
      },
      body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));

  }

  function toggleButtonsDisabledState(submitButton, closeButton) {

    submitButton.disabled = !submitButton.disabled;
    closeButton.disabled = !closeButton.disabled;
    currentlySubmitting = !currentlySubmitting;
  }

  function generateButtons() {
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-div");
    buttonDiv.classList.add("row");
    buttonDiv.classList.add("col-12");
    buttonDiv.classList.add("d-flex");
    buttonDiv.classList.add("d-column");

    buttonDiv.append(generateSubmitInput());
    buttonDiv.append(generateCloseButton());
    return buttonDiv;
  }

  function generateCloseButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.innerText = "Close";
    button.classList.add("btn");
    button.classList.add("btn-danger");
    button.classList.add("mt-1");
    button.classList.add("close-button");

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

    return labelInputHolder;
  }

  function generateSubmitInput() {
    const input = document.createElement("input");
    input.type = "submit";
    input.classList.add("btn");
    input.classList.add("btn-success");
    input.classList.add("mt-2");
    input.classList.add("text-center");
    input.classList.add("submit-button");
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

loadCreatePlaylistLogic();
