function addEventToDeletePlaylistForms() {
  const deletePlaylistForms = document.querySelectorAll(".delete-playlist-form");

  deletePlaylistForms.forEach((form) => {
    form.addEventListener("submit", deletePlaylist);
  });
}

function deletePlaylist(event) {
  // Still keeping it here with no action just in case
  event.preventDefault();

  if (!confirm("Are you sure you would like to delete this playlist? This action is irreversible")) {
    return;
  }
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  const playlist = event.target.closest(".playlist-items");
  const id = playlist.dataset.playlistId;
  const params = { playlist_id: id};

  fetch('/delete_playlist', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(params)
  }).then(response => response.json())
  .then(data => {
    if (data.ok) {
      createCrudMessage("Playlist deleted");
      playlist.remove();
    } else {
      createCrudMessage("Failed to delete playlist");
    }
  })
  .catch(error => console.error('Error:', error));
}

addEventToDeletePlaylistForms();
