//= require sortable.min
function initializeOwnedGameListLogic() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  const gameListBodyContainer = document.querySelector(".main-body-container");
  const deleteGameForm = document.querySelectorAll(".delete-game-form");
  const checkboxContainers = document.querySelectorAll(".checkboxes-container");

  const statsBar = document.querySelector(".stats-bar");
  const completedRateBar = document.querySelector(".completed-rate");
  const playedRateBar = document.querySelector(".played-rate");

  let counts = JSON.parse(statsBar.dataset.count);

  new Sortable(gameListBodyContainer, {
    animation: 150,
    ghostClass: 'blue-background-class',
    onEnd: function() { changeOrder() },
    scroll: true,
    scrollSensitivity: 100,
    scrollSpeed: 300,
  })

  function onPageLoad() {
  //// this is here when the page refreshes due to a removal of a game, the order is updated
  changeOrder();
  populateProgressBars("onLoad");
  }
  onPageLoad();

  function populateProgressBars(source) {
    const completedRate = counts.completed / counts.all * 100;
    const completedCount = Number.isInteger(completedRate) ? completedRate : completedRate.toFixed(2);

    const playedRate = counts.played / counts.all * 100;
    const playedCount = Number.isInteger(playedRate) ? playedRate : playedRate.toFixed(2);

    const currentRates = { completed: completedCount, played: playedCount};
    const rates = (source === "onLoad") ? JSON.parse(statsBar.dataset.rates) : currentRates;

    completedRateBar.style.width = !isNaN(rates.completed) ? `${rates.completed}%` : `0%`;
    playedRateBar.style.width = !isNaN(rates.played) ? `${rates.played}%` : `0%`;

    const completedText = document.querySelector(".completed-percentage");
    const playedText = document.querySelector(".played-percentage");

    // If the game list is empty, these will result in the texts being 0 rather than NaN
    if (isNaN(rates.completed)) {
      completedText.innerText = "0%";
    } else {
      completedText.innerText = Number.isInteger(rates.completed) ? `${Math.round(rates.completed)}%` : `${parseFloat(rates.completed)}%`;
    }
    if (isNaN(rates.played)) {
      playedText.innerText = "0%";
    } else {
      playedText.innerText = Number.isInteger(rates.played) ? `${Math.round(rates.played)}%` : `${parseFloat(rates.played)}%`;
    }
  }

  function changeOrder() {
    const currentGameCardsPosition = document.querySelectorAll(".game-card");
    const params = { games: [] };
    currentGameCardsPosition.forEach((game, index) => {
      const id = game.dataset.id;
      params.games.push({ id: id, order: index + 1});
    })
    fetch('/update_order', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(params)
    }).then(response => response.json())
    .then(data => data)
    .catch(error => console.error('Error:', error));
  }

  checkboxContainers.forEach((container) => {
    container.addEventListener("change", () => {
      numberOfCompletedPlayedGames();
      populateProgressBars("change");
    })
  })

  // completedCheckboxes.forEach((checkbox) => {
  //   checkbox.addEventListener("change", (event) => {
  //     const parentElement = event.target.closest(".checkboxes-container");
  //     if (event.currentTarget.checked) {
  //       const playedCheckbox = parentElement.querySelector(".played-checkbox");
  //       playedCheckbox.checked = true;
  //     }
  //     sendCheckboxChange(parentElement)
  //     numberOfCompletedPlayedGames();
  //     populateProgressBars("change");
  //   })
  // })

  // playedCheckboxes.forEach((checkbox) => {
  //   checkbox.addEventListener("change", (event) => {
  //     const parentElement = event.target.closest(".checkboxes-container");
  //     if (!event.currentTarget.checked) {
  //       const playedCheckbox = parentElement.querySelector(".completed-checkbox");
  //       playedCheckbox.checked = false;
  //     }
  //     sendCheckboxChange(parentElement);
  //     numberOfCompletedPlayedGames();
  //     populateProgressBars("change");
  //   })
  // })

  // function sendCheckboxChange(parent) {
  //   const completedCheckbox = parent.querySelector(".completed-checkbox");
  //   const playedCheckbox = parent.querySelector(".played-checkbox");
  //   const dbId = completedCheckbox.dataset.id;
  //   const params = { id: dbId, completed: completedCheckbox.checked, played: playedCheckbox.checked };

  //   fetch('/update', {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'X-CSRF-Token': csrfToken,
  //     },
  //     body: JSON.stringify(params)
  //   }).then(response => response.json())
  //   .then(data => {
  //     if (data.ok) {
  //       // createCrudMesage("Game", "updated", "success");
  //     }
  //   })
  //   .catch(error => console.error('Error:', error));
  //   // Down here because if it isn't sent then it shouldn't update even in Frontend
  //   numberOfCompletedPlayedGames();
  //   populateProgressBars("change");
  // }

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
          populateProgressBars("change");
          createCrudMesage("Game", "deleted", "success");
        }
      })
      .catch(error => console.error('Error:', error));
    });
  });
}

initializeOwnedGameListLogic();
