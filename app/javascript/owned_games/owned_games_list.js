function updateOwnedGamesInitialize() {
  const checkboxContainers = document.querySelectorAll(".checkboxes-container");
  checkboxContainers.forEach((container) => {
    // The 1 millisecond set timeout is to ensure that both checkboxes are updated (when meeting the condition) before the stats are updated
    container.addEventListener("change", () => {
      setTimeout(() => {
        refreshStats();
      }, 1);
    })
  })
}


document.addEventListener("turbo:load", updateOwnedGamesInitialize);
