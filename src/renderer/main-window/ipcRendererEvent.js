const { ipcRenderer } = window.require("electron");
const path = window.require("path");
const { saveImage } = window.require("./main-window/filters");
const store = window.require("./utilities/store");
const showDialog = window.require("./utilities/dialog");
const { decrypt } = window.require("./utilities/crypto");
const { clearImages, loadImages, addImagesEvents, selectFirstImage, file } =
  window.require("./main-window/images-ui");
const Cloudup = window.require("cloudup-client");

async function setIpc() {
  if (await store.has("directory")) {
    ipcRenderer.send("load-directory", await store.get("directory"));
  }

  ipcRenderer.on("load-images", (event, dir, images) => {
    clearImages();
    loadImages(images);
    addImagesEvents();
    selectFirstImage();
    store.set("directory", dir);
    document.getElementById("directory").innerText = dir;
  });

  ipcRenderer.on("save-image", (event, file) => {
    saveImage(file)
      .then((res) => {
        document.getElementById('image-display').dataset.filtered = file
        showDialog("info", "Platzipics", "La imagen fue guardada");
      })
      .catch((err) => {
        showDialog("error", "Platzipics", err.message);
      });
  });
}

function openPreferences() {
  console.log("openPreferences");
  const { BrowserWindow, getGlobal, require } =
    window.require("@electron/remote");
  const remoteMain = require("@electron/remote/main");
  const mainWindow = getGlobal("win");
  console.log({ mainWindow });
  const preferencesWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // nodeIntegrationInWorker: true,
    },
    width: 400,
    height: 300,
    title: "Preferencias",
    center: true,
    modal: true,
    frame: false,
    show: false,
  });
  preferencesWindow.setParentWindow(mainWindow);
  preferencesWindow.once("ready-to-show", () => {
    preferencesWindow.show();
    preferencesWindow.focus();
    remoteMain.enable(preferencesWindow.webContents);
  });

  preferencesWindow.loadURL(
    `file://${path.join(__dirname, "..")}/preferences.html`
  );
}

function openDirectory() {
  ipcRenderer.send("open-directory");
}

function saveFile() {
  const image = document.getElementById("image-displayed").dataset.original;
  const ext = path.extname(image);
  ipcRenderer.send("open-save-dialog", ext);
}

async function uploadImage() {
  let imageNode = document.getElementById("image-displayed");
  let image = imageNode.src;
  if (imageNode.dataset.filtered) {
    image = imageNode.dataset.filtered
  }

  image = image.replace("file://", "");
  let fileName = path.basename(image);

  if (
    (await store.has("cloudup.user")) &&
    (await store.has("cloudup.password"))
  ) {
    //document.getElementById('overlay').classList.toggle('hidden')

    const client = Cloudup({
      user: await store.get("cloudup.user"),
      pass: decrypt(await store.get("cloudup.password")),
    });

    const stream = client.stream({ title: `Platzipics - ${fileName}` });
    stream.file(image).save((err) => {
      // document.getElementById('overlay').classList.toggle('hidden')
      if (err) {
        console.log(err);
        showDialog(
          "error",
          "Platzipics",
          "Verifique su conexión y/o sus credenciales de Cloudup"
        );
      } else {
        // clipboard.writeText(stream.url)
        // const notify = new Notification('Platzipics', { //eslint-disable-line
        //   body: `Imagen cargada con éxito - ${stream.url}, el enlace se copio al portapeles ` +
        //         `De click para abrir la url`,
        //   silent: false
        // })

        // notify.onclick = () => {
        //   shell.openExternal(stream.url)
        // }
        showDialog(
          `info', 'Platzipics', 'Imagen cargada con exito ${stream.url}`
        );
      }
    });
  } else {
    showDialog(
      "error",
      "Platzipics",
      "Por favor complete las preferencias de Cloudup"
    );
  }
}

module.exports = {
  setIpc,
  openDirectory,
  saveFile,
  openPreferences,
  uploadImage,
};
