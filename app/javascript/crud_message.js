// text
// record created/updated/deleted successfully

// recordType will be either: "Game" or "Playlist" for now
// crudType will be either: "created", "updated", or "deleted", so more like crd heh
// Game created probably won't be a thing, as there is a message saying that in the add page underneath the input

// ***** This is not done for update operations for now, as it would be too annoying to have them popup every single time you clicked a completed or played checkbox

function createCrudMessage(message) {
  checkIfPopupExists();
  const popup = createPopup();
  popup.innerText = message;
  showPopup(popup);
  // Could change where it is appended to later so it doesn't interfere with something a user might want to click on
  document.body.append(popup);
  removePopup(popup);
}

function checkIfPopupExists() {
  const currentPopupCard = document.querySelector(".popup-card");
  currentPopupCard && currentPopupCard.remove();
}

function showPopup(popup) {
  setTimeout(() => {
    popup.classList.add("popup-drop-in");
    popup.classList.add("popup-drop-in-opacity");
  }, 1);
}

function removePopup(popup) {
  setTimeout(() => {
    popup.classList.add("popup-fade-away");
    setTimeout(() => {
      popup.remove();
    }, 1500);
  }, 3000);
}

function createPopup() { // more like "popdown", because it comes down from the top of the page. Get it? GET IT??
  const popup = document.createElement("div");
  popup.classList.add("popup-card", "card", "d-flex", "flex-column", "justify-content-center", "align-items-center", "text-center", "position-absolute", "p-3");
  return popup;
}
