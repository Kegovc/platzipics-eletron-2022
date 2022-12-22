// const os = window.require('os')

const url = window.require("url");
const path = window.require("path");
const applyFilter = window.require("./filters");
const { setIpc, openDirectory } = window.require("./ipcRendererEvent");
const { addImagesEvents, searchImageEvent, selectEvent } =
  window.require("./images-ui");

window.addEventListener("load", () => {
  setIpc();
  addImagesEvents();
  searchImageEvent();
  selectEvent();
  buttonEvent("open-directory", openDirectory);
});

function buttonEvent(id, func) {
  const btn = document.getElementById(id);
  btn.addEventListener("click", func);
}
