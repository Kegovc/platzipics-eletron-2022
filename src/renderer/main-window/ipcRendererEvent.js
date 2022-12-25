const { ipcRenderer } = window.require("electron");
const path = window.require("path");
const { saveImage } = window.require("./main-window/filters");
const { clearImages, loadImages, addImagesEvents, selectFirstImage, file } =
  window.require("./main-window/images-ui");

function setIpc() {
  ipcRenderer.on("load-images", (event, images) => {
    clearImages();
    console.log(`load-images recibido - `, images);
    loadImages(images);
    addImagesEvents();
    selectFirstImage();
  });
  ipcRenderer.on("save-image", (event, file) => {
    saveImage(file)
      .then((res) => {
        showDialog("info", "Platzipics", "La imagen fue guardada");
      })
      .catch((err) => {
        showDialog("error", "Platzipics", err.message);
      });
  });
}

function openPreferences() {
  console.log("openPreferences");
  const {BrowserWindow, getGlobal, require} = window.require("@electron/remote");
  const remoteMain = require("@electron/remote/main");
  const mainWindow = getGlobal('win')
  console.log({mainWindow})
  const preferencesWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
    },
    width: 400,
    height: 300,
    title: "Preferencias",
    center: true,
    modal: true,
    frame: true,
    show: false,
  });
  preferencesWindow.setParentWindow(mainWindow)
  preferencesWindow.once('ready-to-show',()=>{
    preferencesWindow.show();
    preferencesWindow.focus();
    remoteMain.enable(preferencesWindow.webContents);
  })
  
  preferencesWindow.loadURL(`file://${path.join(__dirname, '..')}/preferences.html`)
  
}

function openDirectory() {
  ipcRenderer.send("open-directory");
}

function showDialog(type, title, message) {
  ipcRenderer.send("show-dialog", { type, title, message });
}

function saveFile() {
  const image = document.getElementById("image-displayed").dataset.original;
  const ext = path.extname(image);
  ipcRenderer.send("open-save-dialog", ext);
}

module.exports = {
  setIpc,
  openDirectory,
  saveFile,
  showDialog,
  openPreferences,
};
