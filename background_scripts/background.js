let timer, currentTime, type, timerRunning, workTime, breakTime;
currentTime = workTime = 1; // intialize current time to work time
breakTime = 3;
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

// listens for icon clicks
browser.browserAction.onClicked.addListener(() => {
  if (!timerRunning) {
    if (type === "work") {
      browser.browserAction.setBadgeBackgroundColor({ color: "red" })
    } else {
      browser.browserAction.setBadgeBackgroundColor({ color: "green" })
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

/* listen for messages from other scripts (start_break.js and start_pomodoro.js, options.js) */
browser.runtime.onMessage.addListener((message) => {
  if (message.workTime && message.breakTime) {
    // change settings and restart the timer;
    workTime = Number(message.workTime);
    breakTime = Number(message.breakTime);

    if (!timerRunning) {
      if (type == "work") {
        currentTime = workTime;
      } else {
        currentTime = breakTime;
      }
    }
  } else {
    // close tab when button is clicked 
    closeCurrentTab();
    if (message.command == "startBreak") {
      type = "break";
      currentTime = breakTime;
      browser.browserAction.setBadgeBackgroundColor({ color: "green" })
    } else {
      type = "work";
      currentTime = workTime;
      browser.browserAction.setBadgeBackgroundColor({ color: "red" })
    }
    startTimer();
  }
});

