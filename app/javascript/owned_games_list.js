const checkboxes = document.querySelectorAll(".completed-checkbox");

const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    console.log("hi");
    sendChangeToBackend(event.currentTarget)


  })
})

function sendChangeToBackend(target) {
  const completion = target.checked;
  const dbId = target.id;
  const params = {id: dbId, completed: completion};
  console.log(params);

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
