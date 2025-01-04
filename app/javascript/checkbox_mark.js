function sendCheckboxChange(game, playedCheckbox, completedCheckbox) {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  // const completedCheckbox = game.querySelector(".completed-checkbox");
  // const playedCheckbox = game.querySelector(".played-checkbox");
  const dbId = game.dataset.id;
  const params = { id: dbId, completed: completedCheckbox.checked, played: playedCheckbox.checked };

  fetch('/update', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(params)
  }).then(response => response.json())
  .then(data => data)
  .catch(error => console.error('Error:', error));
}

function checkCheckboxes(target, checkboxContainer) {
  const playedCheckbox = checkboxContainer.querySelector(".played-checkbox");
  const completedCheckbox = checkboxContainer.querySelector(".completed-checkbox");
  if (target === playedCheckbox) {
    if (!playedCheckbox.checked) {
      completedCheckbox.checked = false;
    }
  } else {
    if (completedCheckbox.checked) {
      playedCheckbox.checked = true;
    }
  }
  sendCheckboxChange(checkboxContainer, playedCheckbox, completedCheckbox);
}

function addEventListenersToCheckBoxesInitializer() {
  console.log("hi");

  document.querySelectorAll(".checkboxes-container").forEach((checkboxContainer) => {
    if (!checkboxContainer.dataset.hasEvent) {
      checkboxContainer.dataset.hasEvent = true;
      checkboxContainer.addEventListener("change", (event) => checkCheckboxes(event.target, checkboxContainer));
    }
  })
}

document.addEventListener("turbo:load", addEventListenersToCheckBoxesInitializer);
