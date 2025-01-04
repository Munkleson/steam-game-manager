import { insertGameToPlaylistBody } from "./refresh_playlists";
import updatePlaylistGamesCount from "./update_playlist_games_count";

function addEventListenersToAddButtons() {
  const addGameButtons = document.querySelectorAll(".green-add-button");
  addGameButtons.forEach((button) => {
    if (!button.dataset.hasEvent) {
      button.dataset.hasEvent = true;
      button.addEventListener("click", addGameToPlaylist);
    }
  });
}
document.addEventListener("turbo:load", addEventListenersToAddButtons);

function addGameToPlaylist(event) {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  const game = event.target.closest(".add-game-card");
  const ownedGameId = game.dataset.id;

  const playlistId = document.querySelector(".selected-playlist").dataset.playlistId;

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
      addGameToPlaylistSuccess(game, data, ownedGameId)
    } else {
      createCrudMessage("Failed to add game to your playlist");
    }
  })
  .catch(error => () => {
    console.error(error);
    createCrudMessage("Failed to add game to your playlist")
  });
}

function addGameToPlaylistSuccess(game, data, ownedGameId) {
  createCrudMessage("Game added to playlist");
  const gameDetails = getAddedGameDetails(game);
  const addedGame = insertGameToPlaylistBody(gameDetails.imageUrl, gameDetails.name, gameDetails.id, gameDetails.ownedGameOrder);
  checkAddedGameCheckboxes(addedGame, data);
  addEventListenerToAddedGame(addedGame, ownedGameId);
  const playlistContentContainer = document.querySelector(".playlist-games-list");
  playlistContentContainer.append(addedGame);
  game.remove(); // removes the element that was added to the playlist
  refreshStats();
  updatePlaylistGamesCount();
}

function addEventListenerToAddedGame(addedGame, ownedGameId) {
  const checkboxContainer = addedGame.querySelector(".checkboxes-container");
  checkboxContainer.dataset.id = ownedGameId;
  checkboxContainer.dataset.hasEvent = true;
  checkboxContainer.addEventListener("change", (event) => checkCheckboxes(event.target, checkboxContainer));
}

function checkAddedGameCheckboxes(addedGame, data) {
  addedGame.querySelector(".completed-checkbox").checked = data.completed;
  addedGame.querySelector(".played-checkbox").checked = data.played;
}

function getAddedGameDetails(game) {
  const imageUrl = game.querySelector("img").src;
  const name = game.querySelector(".add-game-text").innerText;
  const id = game.dataset.id; // Game's id in database
  const ownedGameOrder = game.dataset.ownedGameOrder;
  return { imageUrl: imageUrl, name: name, id: id, ownedGameOrder: ownedGameOrder };
}

export { addGameToPlaylist }
