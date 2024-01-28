// listen for clicks
let restartButton = document.querySelector("#restart");
let pauseButton = document.querySelector("#pause");
let startBreakButton = document.querySelector("#break");
let startWorkButton = document.querySelector("#work");

restartButton.addEventListener("click", () => {
  browser.runtime.sendMessage({ buttonClicked: "restart" });
});

pauseButton.addEventListener("click", () => {
  browser.runtime.sendMessage({ buttonClicked: "pause" });
});

startBreakButton.addEventListener("click", () => {
  browser.runtime.sendMessage({ buttonClicked: "break" });
});

startWorkButton.addEventListener("click", () => {
  browser.runtime.sendMessage({ buttonClicked: "work" });
});

