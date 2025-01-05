import { selectPlaylist } from "./playlist/select_playlist";

function addEventListeners() {
  switch (window.location.pathname) {
    case "/playlists":
      addPlaylistSelectionEventListeners();
      break;
  }
}

function addPlaylistSelectionEventListeners() {
  const allPlaylists = document.querySelectorAll(".playlist-items");
  allPlaylists.forEach(playlistElement => playlistElement.addEventListener("click", selectPlaylist));
}

document.addEventListener("turbo:load", addEventListeners);
