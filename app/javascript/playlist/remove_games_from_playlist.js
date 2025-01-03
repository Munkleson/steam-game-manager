function removeGameFromPlaylist(event) {
  event.preventDefault();
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  const selectedPlaylist = document.querySelector(".selected-playlist").dataset.playlistId;

  const id = event.target.dataset.id;
  const params = { id: id, playlist_id: selectedPlaylist };

  fetch('/remove_game_from_playlist', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(params)
  }).then(response => response)
  .then(data => {
    console.log(data)
    if (data.ok) {
      // const deletedGameCard = game.closest(".game-card");
      // deletedGameCard.remove();
      createCrudMesage("Game", "deleted", "success");
    }
  })
  .catch(error => console.error('Error:', error));
}

function addRemoveEventOnLoad() {
  const currentRemoveForms = document.querySelectorAll(".remove-game-from-playlist-form");
  currentRemoveForms.forEach((button) => {
    button.addEventListener("submit", removeGameFromPlaylist);
  })
}

document.addEventListener("DOMContentLoaded", () => {
  addRemoveEventOnLoad();
})
