let timer;
let currentTime = 1;
let timerRunning = false;

function startTimer() {
  timerRunning = true;

  browser.browserAction.setBadgeText({ text: String(currentTime) });
  clearInterval(timer);

  timer = setInterval(() => {
    currentTime--;
    browser.browserAction.setBadgeText({ text: String(currentTime) });
    if (currentTime <= 0) {
      clearInterval(timer);
      browser.tabs.create({ url: browser.extension.getURL("prompts/start_break.html") }); // open a new tab when timer ends
    }
  }, 60000);
}

function pauseTimer() {
  clearInterval(timer);
  browser.browserAction.setBadgeText({ text: "-" });
  timerRunning = false;
}

browser.browserAction.onClicked.addListener(() => {
  if (!timerRunning) {
    startTimer(); // start timer for 60 minutes
  } else {
    pauseTimer();
  }
});

