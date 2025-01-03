//= require sortable.min

new Sortable(document.querySelector(".playlist-list"), {
  animation: 150,
  ghostClass: 'blue-background-class',
  onEnd: function() { changePlaylistOrder() },
  scroll: true,
  scrollSensitivity: 100,
  scrollSpeed: 300,
})

function changePlaylistOrder() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  const playlistItems = document.querySelectorAll(".playlist-items");
  const params = { playlists: [] };
  playlistItems.forEach((game, index) => {
    const playlist_id = game.dataset.playlistId;
    params.playlists.push({ playlist_id: playlist_id, order: index + 1});
  })
  fetch('/update_playlist_order', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(params)
  }).then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
}

new Sortable(document.querySelector(".playlist-games-list"), {
  animation: 150,
  ghostClass: 'blue-background-class',
  onEnd: function() { changePlaylistGamesOrder() },
  scroll: true,
  scrollSensitivity: 100,
  scrollSpeed: 300,
})

function changePlaylistGamesOrder() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  const playlistId = document.querySelector(".selected-playlist").dataset.playlistId;
  const playlistGames = document.querySelectorAll(".game-card");
  const params = { playlist_games: [], playlist_id: playlistId };
  playlistGames.forEach((game, index) => {
    const playlist_game_id = game.dataset.id;
    params.playlist_games.push({ playlist_game_id: playlist_game_id, order: index + 1});
  })
  fetch('/update_playlist_games_order', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(params)
  }).then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
}
