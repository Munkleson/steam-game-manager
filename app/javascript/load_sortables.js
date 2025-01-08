//= require sortable.min
import { changeOwnedGameOrder, changePlaylistGamesOrder, changePlaylistOrder } from './change_order';
import { selectPlaylist } from './playlist/select_playlist';

function loadSortable() {
  switch (window.location.pathname) {
    case "/playlists":
      loadPlaylistSortable();
      loadPlaylistGamesSortable();
      break;
    case "/games":
      loadOwnedGamesSortable();
      break;
  }
}

function loadOwnedGamesSortable() {
  new Sortable(document.querySelector(".main-body-container"), {
    animation: 150,
    ghostClass: 'blue-background-class',
    onEnd: function() { changeOwnedGameOrder() },
    scroll: true,
    scrollSensitivity: 100,
    scrollSpeed: 300,
  })
}

function loadPlaylistSortable() {
  new Sortable(document.querySelector(".playlist-list"), {
    animation: 150,
    ghostClass: 'blue-background-class',
    onEnd: function(event) {
      selectPlaylist(event.item);
      changePlaylistOrder();
    },
    scroll: true,
    scrollSensitivity: 100,
    scrollSpeed: 300,
  })
}

function loadPlaylistGamesSortable() {
  new Sortable(document.querySelector(".playlist-games-list"), {
    animation: 150,
    ghostClass: 'blue-background-class',
    onEnd: function() { changePlaylistGamesOrder() },
    scroll: true,
    scrollSensitivity: 100,
    scrollSpeed: 300,
  })
}

document.addEventListener("turbo:load", loadSortable);
