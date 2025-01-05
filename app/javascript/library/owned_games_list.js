//= require sortable.min
function initializeOwnedGameListLogic() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  // const gameListBodyContainer = document.querySelector(".main-body-container");
  const deleteGameForm = document.querySelectorAll(".delete-game-form");
  const checkboxContainers = document.querySelectorAll(".checkboxes-container");

  const statsBar = document.querySelector(".stats-bar");

  let counts = JSON.parse(statsBar.dataset.count);

  // console.log(gameListBodyContainer);
  // new Sortable(gameListBodyContainer, {
  //   animation: 150,
  //   ghostClass: 'blue-background-class',
  //   onEnd: function() { changeOwnedGameOrder() },
  //   scroll: true,
  //   scrollSensitivity: 100,
  //   scrollSpeed: 300,
  // })

  // function onPageLoad() {
  // //// this is here when the page refreshes due to a removal of a game, the order is updated
  // changeOwnedGameOrder();
  // }
  // onPageLoad();

  // function changeOwnedGameOrder() {
  //   const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  //   const currentGameCardsPosition = document.querySelectorAll(".game-card");
  //   const params = { games: [] };
  //   currentGameCardsPosition.forEach((game, index) => {
  //     const id = game.dataset.id;
  //     params.games.push({ id: id, order: index + 1});
  //   })
  //   fetch('/update_order', {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'X-CSRF-Token': csrfToken,
  //     },
  //     body: JSON.stringify(params)
  //   }).then(response => response.json())
  //   .then(data => data)
  //   .catch(error => console.error('Error:', error));
  // }

  checkboxContainers.forEach((container) => {
    container.addEventListener("change", () => {
      setTimeout(() => {
        numberOfCompletedPlayedGames();
        refreshStats();
        // populateProgressBars("change");
      }, 1);

    })
  })

  function numberOfCompletedPlayedGames() {
    counts.all = document.querySelectorAll(".game-card").length;
    counts.completed = document.querySelectorAll(".completed-checkbox:checked").length;
    counts.played = document.querySelectorAll(".played-checkbox:checked").length;
  }

  deleteGameForm.forEach((game) => {
    game.addEventListener("submit", (event) => {
      event.preventDefault();
      // confirmation messasge disabled for now until I decide if it's user-friendly enough to have to confirm for every single message
      // if (!confirm("Are you sure you would like to remove this game from your library?")) {
      //   return;
      // }

      const id = event.target.dataset.id;
      const params = { id: id };

      fetch('/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(params)
      }).then(response => response)
      .then(data => {
        if (data.ok) {
          const deletedGameCard = game.closest(".game-card");
          deletedGameCard.remove();
          numberOfCompletedPlayedGames();
          refreshStats();
          createCrudMessage("Game removed from your library");
        }
      })
      .catch(error => console.error('Error:', error));
    });
  });
}

initializeOwnedGameListLogic();
