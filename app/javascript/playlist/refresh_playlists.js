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
    console.log(data);

    const playlistContentContainers = document.querySelector(".playlist-games-list");
    const addGamesSection = document.querySelector(".add-games-section");
    playlistContentContainers.innerHTML = "";
    addGamesSection.innerHTML = "";

    if (data.ok) {
      beginGameInsert(data.playlist_games, "playlist", playlistContentContainers, addGamesSection);
      beginGameInsert(data.owned_games, "owned", playlistContentContainers, addGamesSection);
    } else {
      createCrudMesage("the playlist's details from the database", "fetch", "failure");
    }
  })
  .catch(error => console.error('Error:', error));
}

function beginGameInsert(games, type, playlistContentContainers, addGamesSection) {
  games.forEach(game => {
    const imageUrl = game.image_url;
    const name = game.name;
    const id = game.id;
    const ownedGameOrder = game.order;
    if (type === "playlist") {
      const playlistGame = insertGameToPlaylistBody(imageUrl, name, id, ownedGameOrder);
      playlistGame.querySelector(".completed-checkbox").checked = game.completed;
      playlistGame.querySelector(".played-checkbox").checked = game.played;
      playlistContentContainers.append(playlistGame);
    } else {
      addGamesSection.append(insertGameToPlaylistAddList(imageUrl, name, id, ownedGameOrder));
    }
    // type === "playlist" ? playlistContentContainers.append(insertGameToPlaylistBody(imageUrl, name, id, ownedGameOrder)) : addGamesSection.append(insertGameToPlaylistAddList(imageUrl, name, id, ownedGameOrder));
  });
}

function insertGameToPlaylistAddList(imageUrl, name, id, ownedGameOrder) {
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
  ownedGame.dataset.ownedGameOrder = ownedGameOrder;

  ownedGame.innerHTML = `
    <img src="${imageUrl}" class="add-game-img-width img-fluid" alt="...">
    <div class="add-game-text-div d-flex m-0 p-0 ps-3 pe-2 flex-column justify-content-center">
      <p class="add-game-text card-title m-0 p-0">${name}</p>
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <img src="/assets/green-add-button-136a90f6c4383debcf203faba144284c03a78e7b540ef3d10e2df0276d9dba67.png" class="green-add-button" alt="...">
    </div>
  `;
  ownedGame.addEventListener("click", addGameToPlaylist);
  return ownedGame;
}

function insertGameToPlaylistBody(imageUrl, name, id, ownedGameOrder) {
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
  playlistGame.dataset.ownedGameOrder = ownedGameOrder;

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
    <form class="remove-game-from-playlist-form d-flex justify-content-center align-items-center" data-id="${id}">
      <input type="submit" value="Remove" class="btn btn-danger ps-1 pe-1 pt-1 pb-1">
    </form>
  `;

  playlistGame.addEventListener("submit", removeGameFromPlaylist);
  return playlistGame;
}
