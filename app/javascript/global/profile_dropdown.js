function initializeProfileDropdown() {
  const profilePic = document.querySelector(".profile-pic");
  const profileDropdown = document.querySelector(".profile-dropdown");

  // This will check if a session is active. Not a meaningful error, but still shows in console
  if (profilePic) {
    profilePic.addEventListener("click", () => displayProfileDropdown(profileDropdown));
    document.addEventListener("click", (event) => startDropdownHide(event, profileDropdown, profilePic));
  }
}

initializeProfileDropdown();

function displayProfileDropdown(profileDropdown) {
  if (profileDropdown.classList.contains("d-none")) {
    showDropdown(profileDropdown);
  } else {
    hideDropdown(profileDropdown);
  }
};

function startDropdownHide(event, profileDropdown, profilePic) {
  if (event.target !== profileDropdown && event.target !== profilePic) {
    hideDropdown(profileDropdown);
  }
}

function hideDropdown(profileDropdown) {
  profileDropdown.classList.add("d-none");
}

function showDropdown(profileDropdown) {
  profileDropdown.classList.remove("d-none");
}
