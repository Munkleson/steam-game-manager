function refreshStats() {
  // this is here to check if the page navigated to does not have stats
  if (!checkStatsLocation()) {
    return;
  }
  const statsContainers = document.querySelectorAll(".stats-bar");
  updateStats();
  updateRateBarWidths(statsContainers);
}

function updateStats() {
  const rates = getRates();
  formatRates(rates);
  modifyText(rates);
}

function getRates() {
  const gamesCount = document.querySelectorAll(".game-card").length;
  const completedRate = checkedCount("completed") / gamesCount * 100;
  const playedRate = checkedCount("played") / gamesCount * 100;
  return { completed: completedRate, played: playedRate };
}

function checkedCount(progressType) {
  return document.querySelectorAll(`.${progressType}-checkbox:checked`).length;
}

function formatRates(rates) {
  Object.keys(rates).forEach((progressType) => {
    // isNaN is needed for when playlist is empty
    if (isNaN(rates[progressType])) {
      rates[progressType] = 0;
    } else {
      rates[progressType] = Number.isInteger(rates[progressType]) ? Math.round(rates[progressType]) : parseFloat(rates[progressType].toFixed(2));
    }
  })
}

function modifyText(rates) {
  console.log(rates);

  const container = document.querySelector(checkStatsLocation());
  container.querySelector(".completed-percentage").innerText = `${rates.completed}%`;
  container.querySelector(".played-percentage").innerText = `${rates.played}%`;
}

function updateRateBarWidths(containers) {
  containers.forEach(container => updateSingleContainerBars(container));
}

function updateSingleContainerBars(container) {
  ["completed", "played"].forEach((progressType) => {
    const progressPercentage = container.querySelector(`.${progressType}-percentage`).innerText;
    const progressBar = container.querySelector(`.${progressType}-rate`);
    // progressBar.style.width = progressPercentage;
    statsBarAnimateUpdate(progressBar, progressPercentage);
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
