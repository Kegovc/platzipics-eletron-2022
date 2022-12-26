const { ipcRenderer } = window.require("electron");

function showDialog(type, title, message) {
  ipcRenderer.send("show-dialog", { type, title, message });
}

module.exports = showDialog