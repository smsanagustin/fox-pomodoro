let timer, currentTime, type, timerRunning, workTime, count, shortBreak, longBreak, countBeforeLongBreak;
count = 0;
type = "work";                // initialize type to work

// restore options
function restoreOptions() {
  function setSettings(result) {
    workTime = result.workTime || 25;
    shortBreak = result.shortBreak || 5;
    longBreak = result.longBreak || 15;
    countBeforeLongBreak = result.countBeforeLongBreak || 4;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  // fetch saved options 
  browser.storage.local.get(["workTime", "shortBreak", "longBreak", "countBeforeLongBreak"]).then(setSettings, onError);
}

restoreOptions();

function endTimer() {
  clearInterval(timer);
  timerRunning = false;
  browser.browserAction.setBadgeText({ text: "" });

  // show prompt based on what type of timer should be ran next
  if (type === "work") {
    browser.tabs.create({ url: browser.extension.getURL("prompts/start_break.html") });
  } else {
    browser.tabs.create({ url: browser.extension.getURL("prompts/start_pomodoro.html") });
  }
}

function timerStart() {
  if (type == "work") {
    prepareBreakTime();
  } else {
    prepareWorkTime();
  }
  startTimer();
}

function sendNotifications() {
  let content;
  const title = "Times up!"
  if (type == "work") {
    content = "Work is over! Take a break now.";
  } else {
    content = "Break is over! It's time to start working.";
  }
  browser.notifications.create({
    type: "basic",
    iconUrl: browser.extension.getURL("icons/tomato-64.png"),
    title,
    message: content,
  });

  // start timer when user clicks on the notification 
  browser.notifications.onClicked.addListener(timerStart);
}

function startTimer() {
  timerRunning = true;

  // reset pomodoro count 
  if (count == countBeforeLongBreak) {
    count = 0;
  }

  browser.browserAction.setBadgeText({ text: String(currentTime) + "m" });
  clearInterval(timer);

  timer = setInterval(() => {
    currentTime--;
    browser.browserAction.setBadgeText({ text: String(currentTime) + "m" });

    if (currentTime <= 0) {
      if (type == "work") {
        count++;
      }
      endTimer();
      sendNotifications();
    }
  }, 60000);
}

function toggleTimer() {
  if (!timerRunning) {
    startTimer();
  } else {
    clearInterval(timer);
    browser.browserAction.setBadgeText({ text: "-" });
    timerRunning = false;
  }
}

function closeCurrentTab() {
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    browser.tabs.remove(tabs[0].id);
  })
}

function prepareBreakTime() {
  type = "break";
  if (count < countBeforeLongBreak) {
    currentTime = shortBreak;
  } else {
    currentTime = longBreak;
  }
  browser.browserAction.setBadgeBackgroundColor({ color: "green" })
}

function prepareWorkTime() {
  type = "work";
  currentTime = workTime;
  browser.browserAction.setBadgeTextColor({ color: "white" });
  browser.browserAction.setBadgeBackgroundColor({ color: "red" })
}

function restartTimer() {
  clearInterval(timer);
  if (type == "work") {
    prepareWorkTime();
  } else {
    prepareBreakTime();
  }
  startTimer();
}

/* listen for messages from other scripts (start_break.js and start_pomodoro.js, options.js) */
browser.runtime.onMessage.addListener((message) => {
  if (message.workTime && message.shortBreak && message.longBreak && message.countBeforeLongBreak) {
    // change settings and restart the timer;
    workTime = Number(message.workTime);
    shortBreak = Number(message.shortBreak);
    longBreak = Number(message.longBreak);
    countBeforeLongBreak = message.countBeforeLongBreak;

    if (!timerRunning) {
      if (type == "work") {
        prepareWorkTime();
      } else {
        prepareBreakTime();
      }
    }
  } else if (message.command == "getCount") {
    return Promise.resolve({ count: count, countBeforeLongBreak: countBeforeLongBreak });
  } else if (message.command == "getCurrentSettings") {
    return Promise.resolve({ workTime: workTime, shortBreak: shortBreak, longBreak: longBreak, countBeforeLongBreak: countBeforeLongBreak });
  } else if (message.buttonClicked) {
    switch (message.buttonClicked) {
      case "restart":
        restartTimer();
        break;
      case "pause":
        toggleTimer();
        break;
      case "break":
        prepareBreakTime();
        startTimer();
        break;
      case "work":
        prepareWorkTime()
        startTimer();
        break;
    }
  } else {
    closeCurrentTab();
    if (message.command == "startBreak") {
      prepareBreakTime();
    } else {
      prepareWorkTime();
    }
    startTimer();
  }
});

