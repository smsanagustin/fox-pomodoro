// listens for button clicks in start_break.html

let start_button = document.getElementById("start-button");

start_button.addEventListener("click", () => {
  // send message to background script
  browser.runtime.sendMessage({ command: "startBreak" });
})
