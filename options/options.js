let workTimeInput = document.getElementById("worktime");
let shortBreakInput = document.getElementById("shortbreak");
let longBreakInput = document.getElementById("longbreak");
let settings = document.querySelector(".settings");
let promptUser = document.querySelector(".prompt-user")

// set current time duration sent by the background script as input field values
function handleResponse(response) {
  workTimeInput.value = Number(response.workTime);
  shortBreakInput.value = Number(response.shortBreak);
  longBreakInput.value = Number(response.longBreak);
}

browser.runtime.sendMessage({ command: "getCurrentSettings" }).then(handleResponse); // request current time duration from background script

// change settings
settings.addEventListener("submit", (e) => {
  e.preventDefault();
  workTime = workTimeInput.value;
  shortBreak = shortBreakInput.value;
  longBreak = longBreakInput.value;
  browser.runtime.sendMessage({ workTime: String(workTime), shortBreak: String(shortBreak), longBreak: String(longBreak) });

  promptUser.innerText = "Saved settings!";
})
