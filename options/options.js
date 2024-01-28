let workTimeInput, breakTimeInput;
let settings = document.querySelector(".settings");

// send input values to the background script
settings.addEventListener("submit", (e) => {
  e.preventDefault();
  workTimeInput = document.getElementById("worktime").value;
  breakTimeInput = document.getElementById("breaktime").value;
  browser.runtime.sendMessage({ workTime: String(workTimeInput), breakTime: String(breakTimeInput) });
  console.log("message sent")
})
