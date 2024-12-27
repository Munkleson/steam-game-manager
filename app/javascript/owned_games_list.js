var completedCheckboxes = document.querySelectorAll(".completed-checkbox");
var playedCheckboxes = document.querySelectorAll(".played-checkbox");

var csrfToken = document.querySelector('meta[name="csrf-token"]').content;

completedCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    sendCheckboxChange(event.currentTarget, "completed")
  })
})

playedCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    sendCheckboxChange(event.currentTarget, "played")
  })
})

function sendCheckboxChange(target, type) {
  const checkboxValue = target.checked;
  const dbId = target.dataset.id;
  const params = { id: dbId };
  switch(type) {
    case "completed":
      params.completed = checkboxValue;
      break;
    case "played":
      params.played = checkboxValue;
      break;
  }

  fetch('/update', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(params)
  }).then(response => response)
  .then(data => data)
  .catch(error => console.error('Error:', error));
}
