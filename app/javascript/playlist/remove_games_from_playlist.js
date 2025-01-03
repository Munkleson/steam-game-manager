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
  }).then(response => response.json())
  .then(data => {
    if (data.ok) {
      const addGamesSection = document.querySelector(".add-games-section");
      const ownedGamesList = addGamesSection.querySelectorAll(".add-game-card");
      const ownedGamesLength = ownedGamesList.length;
      const lastGame = ownedGamesList[ownedGamesLength - 1];
      const lastGameOrder = lastGame.dataset.ownedGameOrder;
      const removedGameOrder = data.owned_game_order;
      const removedGame = event.target.closest(".game-card");

      if (removedGameOrder > lastGameOrder) {
        insertAtEndOfList(lastGame, removedGame);
      } else {
        insertBeforeEndOfList(removedGameOrder, removedGame, ownedGamesList);
      }
      createCrudMesage("Game", "removed from the playlist", "success");
      removedGame.remove();
    }
  })
  .catch(error => console.error('Error:', error));
}

function insertAtEndOfList(lastGame, removedGame, removedGameOrder) {
  const imageUrl = removedGame.querySelector("img").src;
  const name = removedGame.querySelector(".card-title").innerText;
  const id = removedGame.dataset.id;
  lastGame.insertAdjacentElement("afterend", insertGameToPlaylistAddList(imageUrl, name, id, removedGameOrder));
}

function insertBeforeEndOfList(removedGameOrder, removedGame, ownedGamesList) {
  const imageUrl = removedGame.querySelector("img").src;
  const name = removedGame.querySelector(".card-title").innerText;
  const id = removedGame.dataset.id;

  const elementToInsertBefore = findElementToInsertBefore(removedGameOrder, ownedGamesList);
  elementToInsertBefore.insertAdjacentElement("beforebegin", insertGameToPlaylistAddList(imageUrl, name, id, removedGameOrder));
}

function findElementToInsertBefore(removedGameOrder, ownedGamesList) {
  const addGamesSection = document.querySelector(".add-games-section");
  for (let index = 0; index < ownedGamesList.length; index++) {
    if (removedGameOrder < ownedGamesList[index].dataset.ownedGameOrder) {
      return addGamesSection.querySelector(`li[data-owned-game-order="${ownedGamesList[index].dataset.ownedGameOrder}"]`);
    }
  }
}

function addRemoveEventOnLoad() {
  const currentRemoveForms = document.querySelectorAll(".remove-game-from-playlist-form");
  currentRemoveForms.forEach((button) => {
    button.removeEventListener("submit", removeGameFromPlaylist);
    button.addEventListener("submit", removeGameFromPlaylist);
  })
}

addRemoveEventOnLoad();
