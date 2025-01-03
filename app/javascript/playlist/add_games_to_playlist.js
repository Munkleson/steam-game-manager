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

    const selectedPlaylist = document.querySelector(".selected-playlist");
    const playlistId = selectedPlaylist.dataset.playlistId;

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

        const imageUrl = game.querySelector("img").src;
        const name = game.querySelector(".add-game-text").innerText;
        const id = game.dataset.id; // Game's id in database
        insertGameToPlaylistBody(imageUrl, name, id);

        game.remove(); // removes the element that was added to the playlist
      } else {
        createCrudMesage("to playlist", "add game", "failure");
      }
    })
    .catch(error => () => {
      createCrudMesage("to playlist", "add game", "failure")
    });
  }
}

loadAddGamesToPlaylist();