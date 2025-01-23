import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["lastPlayed"];
  static values = {
    playtime: Number
  };

  connect() {
    const currentEpochTime = Math.floor(Date.now() / 1000);
    const timeInMinutes = this.mathFloor(currentEpochTime - this.playtimeValue, 60);

    if (timeInMinutes <= 100) {
      this.lastPlayedTarget.innerText = `${timeInMinutes} minutes ago`;
    } else {
      const timeInHours = this.mathFloor(timeInMinutes, 60);
      if (timeInHours < 48) {
        this.lastPlayedTarget.innerText = `${timeInHours} hours ago`;
      } else {
        const timeInDays = this.mathFloor(timeInHours, 24);
        this.lastPlayedTarget.innerText = `${timeInDays} days ago`
      }
    }
  }

  mathFloor(time, divisor) {
    return Math.floor(time / divisor)
  }
}
