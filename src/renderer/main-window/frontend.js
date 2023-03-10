// const os = window.require('os')

const url = window.require("url");
const path = window.require("path");

const { setIpc, openDirectory, saveFile, openPreferences, uploadImage, pasteImage } = window.require("./main-window/ipcRendererEvent");
const { addImagesEvents, searchImageEvent, selectEvent, print } =
  window.require("./main-window/images-ui");
const createMenu = window.require("./main-window/menu");

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
  buttonEvent("paste-button", pasteImage);
  createMenu()
});

function buttonEvent(id, func) {
  const btn = document.getElementById(id);
  btn.addEventListener("click", func);
}
