function sendCheckboxChange(game, completed, played) {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  const dbId = game.dataset.id;
  const params = { id: dbId, completed: completed, played: played };

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

function updateCheckboxes(target, completedCheckbox, playedCheckbox) {
  if (target === completedCheckbox) {
    if (completedCheckbox.checked) {
      playedCheckbox.checked = true;
    }
  } else {
    if (!playedCheckbox.checked) {
      completedCheckbox.checked = false;
    }
  }
}

function checkCheckboxes(target, checkboxContainer) {
  const completedCheckbox = checkboxContainer.querySelector(".completed-checkbox");
  const playedCheckbox = checkboxContainer.querySelector(".played-checkbox");

  updateCheckboxes(target, completedCheckbox, playedCheckbox)
  sendCheckboxChange(checkboxContainer, completedCheckbox.checked, playedCheckbox.checked);
  // refreshing stats has to be down here after all checkboxes have been updated in updateCheckboxes
  refreshStats();
}

function addEventListenersToCheckBoxesInitializer() {
  document.querySelectorAll(".checkboxes-container").forEach((checkboxContainer) => {
    if (!checkboxContainer.dataset.hasEvent) {
      checkboxContainer.dataset.hasEvent = true;
      checkboxContainer.addEventListener("change", (event) => checkCheckboxes(event.target, checkboxContainer));
    }
  })
}

document.addEventListener("turbo:load", addEventListenersToCheckBoxesInitializer);
