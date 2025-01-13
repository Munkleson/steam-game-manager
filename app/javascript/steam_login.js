function steamLogin() {
  const loginButton = document.querySelector(".steam-login-button");
  if (loginButton) {
    loginButton.addEventListener("click", () => window.location.href = '/steam/authenticate');
  }

}

document.addEventListener("turbo:load", steamLogin);
