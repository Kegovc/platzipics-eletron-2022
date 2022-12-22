const { ipcRenderer } = window.require("electron");
const { clearImages, loadImages, addImagesEvents, selectFirstImage } = window.require("./images-ui");

function setIpc() {
  ipcRenderer.on("load-images", (event, images) => {
    clearImages();
    console.log(`load-images recibido - `, images);
    loadImages(images);
    addImagesEvents();
    selectFirstImage();
  });
}

function openDirectory() {
  ipcRenderer.send("open-directory");
}

module.exports = {
  setIpc,
  openDirectory,
};
