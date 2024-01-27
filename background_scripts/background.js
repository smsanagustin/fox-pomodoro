let timer;

function startTimer(duration) {
  let remaining = duration;
  browser.browserAction.setBadgeText({ text: String(remaining) });
  clearInterval(timer);
  timer = setInterval(() => {
    remaining--;
    browser.browserAction.setBadgeText({ text: String(remaining) });
    if (remaining <= 0) {
      clearInterval(timer);
    }
  }, 60000); // Update every minute
}

browser.browserAction.onClicked.addListener(() => {
  startTimer(60); // Start a 60-minute timer
});

