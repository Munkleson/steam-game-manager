export default function updatePlaylistGamesCount() {
  const count = countPlaylistGames();
  updateSelectedPlaylistCount(count);
}

function updateSelectedPlaylistCount(count) {
  const gamesCount = document.querySelector(".selected-playlist .games-count");
  gamesCount.innerText = `(${count})`
}

function countPlaylistGames() {
  const container = document.querySelector(".playlist-games-list");
  return container.querySelectorAll(".game-card").length;
}
