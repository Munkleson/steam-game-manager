function refreshPlaylists(playlistId) {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  const params = new URLSearchParams({ playlist_id: playlistId }).toString();

  fetch(`/refresh_playlists?${params}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    }
  })
  .then(response => response.json())
  .then(data => {
    const playlistContentContainers = document.querySelector(".playlist-games-list");
    const addGamesSection = document.querySelector(".add-games-section");
    playlistContentContainers.innerHTML = "";
    addGamesSection.innerHTML = "";

    if (data.ok) {
      beginGameInsert(data.playlist_games, "playlist");
      beginGameInsert(data.owned_games, "owned");
      loadAddGamesToPlaylist();
    } else {
      createCrudMesage("the playlist's details from the database", "fetch", "failure");
    }
  })
  .catch(error => console.error('Error:', error));
}

function beginGameInsert(games, type) {
  games.forEach(game => {
    const imageUrl = game.image_url;
    const name = game.name;
    const id = game.id;
    type === "playlist" ? insertGameToPlaylistBody(imageUrl, name, id) : insertGameToPlaylistAddList(imageUrl, name, id);
  });
}

function insertGameToPlaylistAddList(imageUrl, name, id) {
  const addGamesSection = document.querySelector(".add-games-section");
  const ownedGame = document.createElement("li");
  ownedGame.classList.add("add-game-card");
  ownedGame.classList.add("card");
  ownedGame.classList.add("col-9");
  ownedGame.classList.add("m-2");
  ownedGame.classList.add("p-0");
  ownedGame.classList.add("align-items-center");
  ownedGame.classList.add("d-flex");
  ownedGame.classList.add("flex-row");
  ownedGame.dataset.id = id;

  ownedGame.innerHTML = `
    <img src="${imageUrl}" class="add-game-img-width img-fluid" alt="...">
    <div class="add-game-text-div d-flex m-0 p-0 ps-3 pe-2 flex-column justify-content-center">
      <p class="add-game-text card-title m-0 p-0">${name}</p>
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <img src="/assets/green-add-button-136a90f6c4383debcf203faba144284c03a78e7b540ef3d10e2df0276d9dba67.png" class="green-add-button" alt="...">
    </div>
  `;
  addGamesSection.append(ownedGame);

  // ownedGame.querySelector(".green-add-button").addEventListener()
}

function insertGameToPlaylistBody(imageUrl, name, id) {
  const playlistContentContainers = document.querySelector(".playlist-games-list");
  const playlistGame = document.createElement("li");
  playlistGame.classList.add("game-card");
  playlistGame.classList.add("card");
  playlistGame.classList.add("col-11");
  playlistGame.classList.add("m-2");
  playlistGame.classList.add("p-0");
  playlistGame.classList.add("align-items-center");
  playlistGame.classList.add("d-flex");
  playlistGame.classList.add("flex-row");
  playlistGame.dataset.id = id;

  playlistGame.innerHTML = `
    <img src="${imageUrl}" class="card-img img-fluid card-img-width" alt="...">
    <div class="d-flex m-0 p-0 ps-3 pe-2 flex-column card-info-dimensions ">
      <h6 class="card-info-item card-title m-0 p-0">${name}</h6>
      <div class="checkboxes-container d-flex mt-2">
        <div class="d-flex align-items-center card-info-item" >
          <label for="completed${id}" class="m-0 completed-text">Completed?</label>
          <input type="checkbox" name="completed${id}" id="completed${id}" value="t" class="completed-checkbox ms-2 me-5" data-id="${id}">
        </div>
        <div class="d-flex align-items-center card-info-item ">
          <label for="played${id}" class="m-0 played-text">Started?</label>
          <input type="checkbox" name="played${id}" id="played${id}" value="t" class="played-checkbox ms-2 me-5" data-id="${id}">
        </div>
      </div>
    </div>
    <form action="/delete" class="delete-game-form d-flex justify-content-center align-items-center" data-id="${id}">
      <input type="submit" value="Remove" class="btn btn-danger ps-1 pe-1 pt-1 pb-1">
    </form>
  `;
  playlistContentContainers.append(playlistGame);
}
