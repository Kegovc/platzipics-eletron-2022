// const os = window.require('os')

const url = window.require("url");
const path = window.require("path");

const { setIpc, openDirectory, saveFile, openPreferences } = window.require("./ipcRendererEvent");
const { addImagesEvents, searchImageEvent, selectEvent } =
  window.require("./images-ui");

window.addEventListener("load", () => {
  setIpc();
  addImagesEvents();
  searchImageEvent();
  selectEvent();
  buttonEvent("open-directory", openDirectory);
  buttonEvent("open-preference", openPreferences);
  buttonEvent("save-button", saveFile);
});

function buttonEvent(id, func) {
  const btn = document.getElementById(id);
  btn.addEventListener("click", func);
}
