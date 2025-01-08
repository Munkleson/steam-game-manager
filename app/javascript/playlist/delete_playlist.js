import { selectPlaylistAfterDeletion } from "./select_playlist";

function addEventToDeletePlaylistForms() {
  const deletePlaylistForms = document.querySelectorAll(".delete-playlist-form");

  deletePlaylistForms.forEach((form) => {
    if (!form.dataset.hasEvent) {
      form.dataset.hasEvent = true;
      form.addEventListener("submit", deletePlaylist);
    }
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

  fetch('/playlists', {
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
      deletePlaylistDomFunctions(playlist);

    } else {
      createCrudMessage("Failed to delete playlist");
    }
  })
  .catch(error => console.error('Error:', error));
}

function deletePlaylistDomFunctions(playlist) {
  // If you have another playlist selected, deleting a playlist will not take you away from it. Edge case
  if (playlist.classList.contains("selected-playlist")) {
    // This needs to be called here too with how the select playlist after deletion function is called
    playlist.remove();
    selectPlaylistAfterDeletion();
  }
  playlist.remove();
}

addEventToDeletePlaylistForms();

export { deletePlaylist, addEventToDeletePlaylistForms }
