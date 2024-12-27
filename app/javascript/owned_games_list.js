var checkboxes = document.querySelectorAll(".completed-checkbox");

var csrfToken = document.querySelector('meta[name="csrf-token"]').content;

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    sendCheckboxCompletionChange(event.currentTarget)
  })
})

function sendCheckboxCompletionChange(target) {
  const completion = target.checked;
  const dbId = target.id;
  const params = {id: dbId, completed: completion};

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
