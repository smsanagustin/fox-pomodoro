let timer, currentTime, type, timerRunning, workTime, breakTime;
workTime = breakTime = 1;
type = "work"; // initialize type to work

function endTimer() {
  clearInterval(timer);
  browser.browserAction.setBadgeText({ text: "" });

  // show prompt based on what type of timer should be ran next
  if (type === "work") {
    browser.tabs.create({ url: browser.extension.getURL("prompts/start_break.html") }); // open a new tab when timer ends
  } else {
    browser.tabs.create({ url: browser.extension.getURL("prompts/start_pomodoro.html") }); // open a new tab when timer ends
  }
}

function startTimer() {
  timerRunning = true;

  browser.browserAction.setBadgeText({ text: String(currentTime) });
  clearInterval(timer);

  timer = setInterval(() => {
    currentTime--;
    browser.browserAction.setBadgeText({ text: String(currentTime) });

    if (currentTime <= 0) {
      endTimer();
    }
  }, 60000);
}

function pauseTimer() {
  clearInterval(timer);
  browser.browserAction.setBadgeText({ text: "-" });
  timerRunning = false;
}

function prepareWorkTimer() {
  currentTime = workTime;
  browser.browserAction.setBadgeBackgroundColor({ color: "red" })
}

function prepareBreakTimer() {
  currentTime = breakTime;
  browser.browserAction.setBadgeBackgroundColor({ color: "green" })
}

browser.browserAction.onClicked.addListener(() => {
  if (!timerRunning) {
    if (type === "work") {
      prepareWorkTimer();
    } else {
      prepareBreakTimer();
    }
    startTimer();
  } else {
    pauseTimer();
  }
});

function closeCurrentTab() {
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    browser.tabs.remove(tabs[0].id);
  })
}

/* listen for messages from other scripts (start_break.js and start_pomodoro.js) */
browser.runtime.onMessage.addListener((message) => {
  // close tab when button is clicked 
  closeCurrentTab();
  if (message.command == "startBreak") {
    type = "break";
    prepareBreakTimer();
  } else {
    type = "work";
    prepareWorkTimer();
  }
  startTimer();
});

