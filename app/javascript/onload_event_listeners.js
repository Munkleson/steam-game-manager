import { loadCreatePlaylistLogic } from "./playlist/create_playlist";
import { addEventToDeletePlaylistForms } from "./playlist/delete_playlist";
import { selectPlaylist } from "./playlist/select_playlist";

function addEventListeners() {
  switch (window.location.pathname) {
    case "/playlists":
      addPlaylistSelectionEventListeners();
      loadCreatePlaylistLogic();
      addEventToDeletePlaylistForms();
      break;
  }
}

function addPlaylistSelectionEventListeners() {
  const allPlaylists = document.querySelectorAll(".playlist-items");
  allPlaylists.forEach(playlistElement => playlistElement.addEventListener("click", selectPlaylist));
}

document.addEventListener("turbo:load", addEventListeners);
