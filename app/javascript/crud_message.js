// text
// record created/updated/deleted successfully

// recordType will be either: "Game" or "Playlist" for now
// crudType will be either: "created", "updated", or "deleted", so more like crd heh
// Game created probably won't be a thing, as there is a message saying that in the add page underneath the input

// ***** This is not done for update operations for now, as it would be too annoying to have them popup every single time you clicked a completed or played checkbox

function createCrudMesage(recordType, crudType, result) {
  // Removes the current popup if there is one already
  const currentPopupCard = document.querySelector(".popup-card");
  currentPopupCard && currentPopupCard.remove();

  const popup = createPopup();
  if (result === "success") {
    popup.innerText = `${recordType} was ${crudType} successfully`;
  } else {
    popup.innerText = `Failed to ${crudType} ${recordType.toLowerCase()}`;
  }
  setTimeout(() => {
    popup.classList.add("popup-drop-in");
    popup.classList.add("popup-drop-in-opacity");
  }, 1);

  // Could change where it is appended to later so it doesn't interfere with something a user might want to click on
  document.body.append(popup);
  setTimeout(() => {
    popup.classList.add("popup-fade-away");
    setTimeout(() => {
      popup.remove();
    }, 1500);
  }, 3000);
}

function createPopup() { // more like "popdown", because it comes down from the top of the page. Get it? GET IT??
  // This could be done all as innerHTML instead for reducing the number of lines
  const popup = document.createElement("div");

  popup.classList.add("popup-card");
  popup.classList.add("card");
  popup.classList.add("d-flex");
  popup.classList.add("flex-column");
  popup.classList.add("justify-content-center");
  popup.classList.add("align-items-center");
  popup.classList.add("text-center");
  popup.classList.add("position-absolute");
  popup.classList.add("p-3");

  return popup;
}
