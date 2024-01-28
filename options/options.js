let workTimeInput = document.getElementById("worktime");
let breakTimeInput = document.getElementById("breaktime");
let settings = document.querySelector(".settings");
let promptUser = document.querySelector(".prompt-user")

// set current time duration sent by the background script as input field values
function handleResponse(message) {
  console.log("received message!")
  workTimeInput.value = Number(message.workTime);
  breakTimeInput.value = Number(message.breakTime);
}

browser.runtime.sendMessage({ command: "getCurrentSettings" }).then(handleResponse); // request current time duration from background script

// change settings
settings.addEventListener("submit", (e) => {
  e.preventDefault();
  workTime = workTimeInput.value;
  breakTime = breakTimeInput.value;
  browser.runtime.sendMessage({ workTime: String(workTime), breakTime: String(breakTime) });

  promptUser.innerText = "Saved settings!";
})
