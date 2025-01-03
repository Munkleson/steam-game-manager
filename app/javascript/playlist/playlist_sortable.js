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
  const params = { games: [] };
  playlistItems.forEach((game, index) => {
    const playlist_id = game.dataset.playlistId;
    params.games.push({ playlist_id: playlist_id, order: index + 1});
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
