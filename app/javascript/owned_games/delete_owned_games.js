import { changeOwnedGameOrder } from "../change_order";

function deleteOwnedGamesInitialize() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  const deleteGameForm = document.querySelectorAll(".delete-game-form");
  deleteGameForm.forEach((game) => {
    if (!game.dataset.hasEvent) {
      game.dataset.hasEvent = true;
      game.addEventListener("submit", (event) => deleteGame(event, csrfToken, game));
    }
  });
}

function deleteGame(event, csrfToken, game) {
  event.preventDefault();
  const id = event.target.dataset.id;

  fetch(`/owned_games/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
  }).then(response => response)
  .then(data => {
    afterOwnedGameDeletion(data, game)
  })
  .catch(error => console.error('Error:', error));
}

function afterOwnedGameDeletion(data, game) {
  if (data.ok) {
    const deletedGameCard = game.closest(".game-card");
    deletedGameCard.remove();
    refreshStats();
    createCrudMessage("Game removed from your library");
    changeOwnedGameOrder();
  } else {
    createCrudMessage("Failed to remove game from your library at this time. Please try again");
  }
}

document.addEventListener("turbo:load", deleteOwnedGamesInitialize);
