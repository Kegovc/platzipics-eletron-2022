const { ipcRenderer } = window.require("electron");
const path = window.require("path");
const {saveImage} = window.require('./filters')
const { clearImages, loadImages, addImagesEvents, selectFirstImage, file } = window.require("./images-ui");

function setIpc() {
  ipcRenderer.on("load-images", (event, images) => {
    clearImages();
    console.log(`load-images recibido - `, images);
    loadImages(images);
    addImagesEvents();
    selectFirstImage();
  });
  ipcRenderer.on("save-image", (event, file) => {
    saveImage(file).then(res=>{
      showDialog('info','Platzipics', 'La imagen fue guardada')
    }).catch(err=>{
      showDialog('error','Platzipics', err.message)
    })
  })
}

function openDirectory() {
  ipcRenderer.send("open-directory");
}

function showDialog(type, title, message){
  ipcRenderer.send('show-dialog', {type, title, message})
}

function saveFile() {
  const image = document.getElementById('image-displayed').dataset.original
  const ext = path.extname(image)
  ipcRenderer.send("open-save-dialog", ext);
}

module.exports = {
  setIpc,
  openDirectory,
  saveFile,
  showDialog,
};
