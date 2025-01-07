function initializeOwnedGameListLogic() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  const deleteGameForm = document.querySelectorAll(".delete-game-form");
  const checkboxContainers = document.querySelectorAll(".checkboxes-container");

  checkboxContainers.forEach((container) => {
    container.addEventListener("change", () => {
      setTimeout(() => {
        refreshStats();
      }, 1);

    })
  })

  deleteGameForm.forEach((game) => {
    game.addEventListener("submit", (event) => {
      event.preventDefault();

      const id = event.target.dataset.id;
      const params = { id: id };

      fetch('/destroy', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(params)
      }).then(response => response)
      .then(data => {
        if (data.ok) {
          const deletedGameCard = game.closest(".game-card");
          deletedGameCard.remove();
          refreshStats();
          createCrudMessage("Game removed from your library");
        }
      })
      .catch(error => console.error('Error:', error));
    });
  });
}

initializeOwnedGameListLogic();
