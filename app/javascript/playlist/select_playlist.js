import { refreshPlaylists } from "./refresh_playlists";

export function selectPlaylist(item) {
  // Don't want the change playlist to trigger on form deletion press
  const clickedElement = checkEventOrTarget(item);
  if (clickedElement.tagName !== "FORM" && clickedElement.tagName !== "INPUT") {
    checkIfCurrentlySelectedExists();
    const target = clickedElement.closest(".playlist-items");
    target.classList.add("selected-playlist");
    refreshPlaylists(target.dataset.playlistId);
  }
}

function checkEventOrTarget(item) {
  // checks if the item is an element. Needed for how the sortable js is set up
  if (item.nodeType) {
    return item;
  // checks if the item is an event
  } else if (item.preventDefault) {
    return item.target;
  }
}

function checkIfCurrentlySelectedExists() {
  const currentSelected = document.querySelector(".selected-playlist");
  if (currentSelected) {
    currentSelected.classList.remove("selected-playlist");
  }
}
