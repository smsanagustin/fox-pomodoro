// listens for button clicks in start_break.html
let start_button = document.getElementById("start-button");
let userPrompt, count, countBeforeLongBreak;
userPrompt = document.getElementById("pomodoro-count");

function handleResponse(response) {
  countBeforeLongBreak = response.countBeforeLongBreak;
  count = response.count;
}

function promptUser() {
  if (count < countBeforeLongBreak) {
    start_button.innerText = "Start break";
  } else {
    start_button.innerText = "Start long break";
  }
  userPrompt.innerText = "You've completed " + count + " pomodoros";
  console.log(userPrompt.innerText);
}

// fetch count from background.js 
browser.runtime.sendMessage({ command: "getCount" }).then(handleResponse).then(promptUser);

start_button.addEventListener("click", () => {
  // send message to background script
  browser.runtime.sendMessage({ command: "startBreak" });
})
