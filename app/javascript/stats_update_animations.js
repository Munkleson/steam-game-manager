function statsBarAnimateUpdate(progressBar, progressPercentageString) {
  const percentageNumber = convertToNumber(progressPercentageString);
  startAnimation(progressBar, percentageNumber);
}

function startAnimation(progressBar, percentageNumber) {
  const duration = 500;
  // Easing rate is set to 1 as acceleration will be constant for now until I figure out how I want to do this
  const easingRate = 1;
  const interval = 5;
  updateWidth(progressBar, percentageNumber, duration, easingRate, interval);
}

// This should update the bar to 80% at high speed
function updateWidth(progressBar, percentageNumber, duration, easingRate, interval) {
  // if the bar is empty, currentvalue will be 0
  let currentValue = getCurrentWidth(progressBar);
  // current difference is how much of the bar needs to be filled
  const currentDifference = percentageNumber - currentValue;
  if (currentDifference === 0) return;

  const incrementalvalue = (currentDifference * easingRate) / (duration / interval);
  // Boolean check to see when the interval should clear based on if it is increasing or decreasing
  const isIncreasing = currentDifference > 0;

  const animation = setInterval(() => {
    currentValue += incrementalvalue;
    if ((currentValue >= percentageNumber && isIncreasing) || (currentValue <= percentageNumber && !isIncreasing)) {
      clearInterval(animation);
      currentValue = formatWidthForEdgeCases(currentValue);
    }
    progressBar.style.width = `${currentValue}%`;
  }, interval);
}

function formatWidthForEdgeCases(currentValue) {
  if (currentValue < 0) {
    return 0;
  } else if (currentValue > 100) {
    return 100;
  } else {
    return currentValue;
  }
}

function convertToNumber(string) {
  return parseFloat(string.substring(0, string.length - 1));
}

function getCurrentWidth(progressBar) {
  return !progressBar.style.width ? 0 : convertToNumber(progressBar.style.width);
}
