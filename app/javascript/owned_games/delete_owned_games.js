function deleteOwnedGamesInitialize() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  const deleteGameForm = document.querySelectorAll(".delete-game-form");
  deleteGameForm.forEach((game) => {
    game.addEventListener("submit", (event) => deleteGame(event, csrfToken, game));
  });
}

function deleteGame(event, csrfToken, game) {
  event.preventDefault();
  const id = event.target.dataset.id;
  // const params = { id: event.target.dataset.id };

  fetch(`/owned_games/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    // body: JSON.stringify(params)
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
}

document.addEventListener("turbo:load", deleteOwnedGamesInitialize);
