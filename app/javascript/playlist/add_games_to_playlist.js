function loadAddGamesToPlaylist() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  function addEventListenersToAddButtons() {
    const addGameButtons = document.querySelectorAll(".green-add-button");
    addGameButtons.forEach(button => button.addEventListener("click", addGameToPlaylist));
  }
  addEventListenersToAddButtons();

  function addGameToPlaylist(event) {
    const game = event.target.closest(".add-game-card");
    const ownedGameId = game.dataset.id;

    // currently hardcoded for testing only
    const playlistId = 11;

    fetch("/add_game_to_playlist", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ owned_game_id: ownedGameId, playlist_id: playlistId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        createCrudMesage("Game", "added to playlist", "success");
        game.remove(); // removes the element that was added to the playlist
      } else {
        createCrudMesage("to playlist", "add game", "failure");
      }
    })
    .catch(error => createCrudMesage("to playlist", "add game", "failure"));
  }

  function insertGameToBody() {

  }
}



loadAddGamesToPlaylist();
