const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

function changePlaylistOrder() {
  const params = createPlaylistOrderParams();
  sendOrderUpdateRequest("update_playlist_order", params)
}

function createPlaylistOrderParams() {
  const items = getItems(".playlist-items");
  const params = { playlists: [] };
  addContentToChangeOrderParams(items, params.playlists, "playlist_id", "playlistId")
  return params;
}

/////////////////////////////////

function changePlaylistGamesOrder() {
  const params = createPlaylistGamesOrderParams();
  sendOrderUpdateRequest("update_playlist_games_order", params)
}

function createPlaylistGamesOrderParams() {
  const playlistId = document.querySelector(".selected-playlist").dataset.playlistId;
  const items = getItems(".game-card");
  const params = { playlist_games: [], playlist_id: playlistId };
  addContentToChangeOrderParams(items, params["playlist_games"], "playlist_game_id", "id");
  return params;
}

////////////////////////////////

function changeOwnedGameOrder() {
  const params = createOwnedGameOrderParams();
  sendOrderUpdateRequest("update_order", params)
}

function createOwnedGameOrderParams() {
  const items = getItems(".game-card");
  const params = { games: [] };
  addContentToChangeOrderParams(items, params.games, "id", "id");
  return params;
}

////////////////////////////////

function getItems(selector) {
  return document.querySelectorAll(selector);
}

function addContentToChangeOrderParams(items, params, keyOfId, datasetIdName) {
  items.forEach((game, index) => {
    const itemDetails = {};
    itemDetails[keyOfId] = game.dataset[datasetIdName];
    itemDetails.order = index + 1;
    params.push(itemDetails);
  })
}

function sendOrderUpdateRequest(pathname, params) {
  fetch(`/${pathname}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(params)
  }).then(response => response.json())
  .then(data => data)
  .catch(error => console.error('Error:', error));
}

export { changePlaylistOrder, changePlaylistGamesOrder, changeOwnedGameOrder }
