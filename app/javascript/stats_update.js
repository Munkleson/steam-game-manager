function refreshStats() {
  const statsContainers = document.querySelectorAll(".stats-bar");
  updateStats();
  updateRateBarWidths(statsContainers);
}

function updateStats() {
  const rates = getRates();
  formatRates(rates);
  modifyText(rates);
}

function modifyText(rates) {
  const container = document.querySelector(checkStatsLocation());
  container.querySelector(".completed-percentage").innerText = rates.completed;
  container.querySelector(".played-percentage").innerText = rates.played;
}

function getRates() {
  const gamesCount = document.querySelectorAll(".game-card").length;
  const completedCount = checkedCount("completed") / gamesCount * 100;
  const playedCount = checkedCount("played") / gamesCount * 100;
  return { completed: completedCount, played: playedCount };
}

function formatRates(rates) {
  Object.keys(rates).forEach((progressType) => {
    rates[progressType] = Number.isInteger(rates[progressType]) ? `${Math.round(rates[progressType])}%` : `${parseFloat(rates[progressType].toFixed(2))}%`;
  })
}

function checkedCount(progressType) {
  return document.querySelectorAll(`.${progressType}-checkbox:checked`).length;
}

function updateRateBarWidths(containers) {
  containers.forEach(container => updateSingleContainerBars(container));
}

function updateSingleContainerBars(container) {
  ["completed", "played"].forEach((progressType) => {
    const progressPercentage = container.querySelector(`.${progressType}-percentage`).innerText;
    const progressBar = container.querySelector(`.${progressType}-rate`);
    progressBar.style.width = progressPercentage;
  })
}

// returns the class to check which container should be updated
function checkStatsLocation() {
  switch (window.location.pathname) {
    case "/games":
      return ".library-stats-bar";
    case "/playlists":
      return ".selected-playlist";
  }
}

document.addEventListener("turbo:load", refreshStats);
