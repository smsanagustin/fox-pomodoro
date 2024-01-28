// listens for button clicks in start_break.html
let start_button = document.getElementById("start-button");
let userPrompt, count;
userPrompt = document.getElementById("pomodoro-count");

function handleResponse(response) {
  count = response.count;
}

function promptUser() {
  userPrompt.innerText = "You've completed " + count + " pomodoros";
  console.log(userPrompt.innerText);
}

// fetch count from background.js 
browser.runtime.sendMessage({ command: "getCount" }).then(handleResponse).then(promptUser);

start_button.addEventListener("click", () => {
  // send message to background script
  browser.runtime.sendMessage({ command: "startPomodoro" });
})
