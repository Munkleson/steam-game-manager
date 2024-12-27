//= require sortable.min

var gameCards = document.querySelectorAll(".game-card");
var gameListBodyContainer = document.querySelector(".games-list-body-container");
new Sortable(gameListBodyContainer, {
  animation: 150,
  ghostClass: 'blue-background-class',
  // onEnd: function(event) {

  // }
})

var completedCheckboxes = document.querySelectorAll(".completed-checkbox");
var playedCheckboxes = document.querySelectorAll(".played-checkbox");

var csrfToken = document.querySelector('meta[name="csrf-token"]').content;

completedCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    const parentElement = event.target.closest(".checkboxes-container");
    if (event.currentTarget.checked) {
      const playedCheckbox = parentElement.querySelector(".played-checkbox");
      playedCheckbox.checked = true;
    }
    sendCheckboxChange(parentElement)
  })
})

// completedCheckboxes.forEach((checkbox) => {
//   checkbox.addEventListener("change", (event) => {
//     sendCheckboxChange(event.currentTarget, "completed")
//     // if (event.currentTarget.checked) {
//     //   const parentElement = event.target.closest(".checkboxes-container");
//     //   const playedCheckbox = parentElement.children[1].querySelector(".played-checkbox");
//     //   playedCheckbox.checked = true;
//     //   sendCheckboxChange(playedCheckbox, "played");
//     // }
//   })
// })

playedCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    const parentElement = event.target.closest(".checkboxes-container");
    if (!event.currentTarget.checked) {
      const playedCheckbox = parentElement.querySelector(".completed-checkbox");
      playedCheckbox.checked = false;
    }
    sendCheckboxChange(parentElement);
  })
})

// playedCheckboxes.forEach((checkbox) => {
//   checkbox.addEventListener("change", (event) => {
//     sendCheckboxChange(event.currentTarget, "played")
//   })
// })

function sendCheckboxChange(parent) {
  const completedCheckbox = parent.querySelector(".completed-checkbox");
  const playedCheckbox = parent.querySelector(".played-checkbox");
  const dbId = completedCheckbox.dataset.id;
  const params = { id: dbId, completed: completedCheckbox.checked, played: playedCheckbox.checked };

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

// function sendCheckboxChange(target, type) {
//   const checkboxValue = target.checked;
//   const dbId = target.dataset.id;
//   const params = { id: dbId };
//   switch(type) {
//     case "completed":
//       params.completed = checkboxValue;
//       break;
//     case "played":
//       params.played = checkboxValue;
//       break;
//   }

//   fetch('/update', {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-CSRF-Token': csrfToken,
//     },
//     body: JSON.stringify(params)
//   }).then(response => response)
//   .then(data => data)
//   .catch(error => console.error('Error:', error));
// }
