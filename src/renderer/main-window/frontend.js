// const os = window.require('os')

const url = window.require("url");
const path = window.require("path");

const { setIpc, openDirectory, saveFile, openPreferences, uploadImage } = window.require("./main-window/ipcRendererEvent");
const { addImagesEvents, searchImageEvent, selectEvent, print } =
  window.require("./main-window/images-ui");

window.addEventListener("load", () => {
  setIpc();
  addImagesEvents();
  searchImageEvent();
  selectEvent();
  buttonEvent("open-directory", openDirectory);
  buttonEvent("open-preference", openPreferences);
  buttonEvent("save-button", saveFile);
  buttonEvent("print-button", print);
  buttonEvent("upload-button", uploadImage);
});

function buttonEvent(id, func) {
  const btn = document.getElementById(id);
  btn.addEventListener("click", func);
}
