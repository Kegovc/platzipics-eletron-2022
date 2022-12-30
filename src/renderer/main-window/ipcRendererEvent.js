const { ipcRenderer, clipboard, shell } = window.require("electron");
const path = window.require("path");
const { saveImage } = window.require("./main-window/filters");
const store = window.require("./utilities/store");
const showDialog = window.require("./utilities/dialog");
const { decrypt } = window.require("./utilities/crypto");
const os = window.require("os");
const { clearImages, loadImages, addImagesEvents, selectFirstImage, file } =
  window.require("./main-window/images-ui");
const Cloudup = window.require("cloudup-client");
const pcloudSdk = window.require("pcloud-sdk-js");

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
        console.log("save-image:then");
        document.getElementById("image-displayed").dataset.filtered = file;
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
    frame: false,
    show: false,
  });

  if (os.platform() !== "win32") {
    preferencesWindow.setParentWindow(mainWindow);
  }

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
  console.log("saveFile");
  const image = document.getElementById("image-displayed").dataset.original;
  const ext = path.extname(image);
  ipcRenderer.send("open-save-dialog", ext || ".png");
}

function getAccessToken(client_id) {
  console.log("getAccessToken", client_id);

  return new Promise((resolve, reject) => {
    pcloudSdk.oauth.initOauthPollToken({
      client_id,

      receiveToken: (token, locationid) => {
        console.log({ token, locationid });
        resolve(token);
      },
      onError: reject,
    });
  });
  //return pcloudSdk.getTokenFromCode(code, client_id, app_secret);
}

async function uploadImage() {
  let imageNode = document.getElementById("image-displayed");
  let image = imageNode.src;
  if (imageNode.dataset.filtered) {
    image = imageNode.dataset.filtered;
  }

  image = image.replace("file://", "");
  let fileName = path.basename(image);

  if (12) {
    const notify = new Notification("Platzipics", {
      //eslint-disable-line
      body: `la vida es muy tristes y cloudup ya no te deja usar cuentas free`,
      silent: false,
    });
    notify.onclick = () => {
      shell.openExternal("https://www.youtube.com/watch?v=mCdA4bJAGGk");
    };
    return;
  }

  // if (await store.has("pcloud.client_id")) {
  //   const access_token = await getAccessToken(
  //     await store.get("pcloud.client_id")
  //   );
  //   console.log({access_token})
  //   const client = pcloudSdk.createClient(access_token);

  //   // then list root folder's contents:
  //   client.listfolder(0).then((fileMetadata) => {
  //     console.log(fileMetadata);
  //   });
  // } else {
  //   showDialog(
  //     "error",
  //     "Platzipics",
  //     "Por favor complete las preferencias de pCloud"
  //   );
  // }

  if (
    (await store.has("cloudup.user")) &&
    (await store.has("cloudup.password"))
  ) {
    document.getElementById("overlay").classList.toggle("hidden");

    const client = Cloudup({
      user: await store.get("cloudup.user"),
      pass: decrypt(await store.get("cloudup.password")),
    });

    const stream = client.stream({ title: `Platzipics - ${fileName}` });
    stream.file(image).save((err) => {
      document.getElementById("overlay").classList.toggle("hidden");
      if (err) {
        console.log(err);
        showDialog(
          "error",
          "Platzipics",
          "Verifique su conexión y/o sus credenciales de Cloudup"
        );
      } else {
        clipboard.writeText(stream.url);
        const notify = new Notification("Platzipics", {
          //eslint-disable-line
          body:
            `Imagen cargada con éxito - ${stream.url}, el enlace se copio al portapeles ` +
            `De click para abrir la url`,
          silent: false,
        });

        notify.onclick = () => {
          shell.openExternal(stream.url);
        };
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

function pasteImage() {
  const image = clipboard.readImage();
  const data = image.toDataURL();
  if (data.indexOf("data:image/png;base64") !== -1 && !image.isEmpty()) {
    const mainImage = document.getElementById("image-displayed");
    mainImage.src = data;
    console.log("pasteImage");
    mainImage.dataset.original = data;
  } else {
    showDialog(
      "error",
      "Platzipics",
      "No hay una imagen valida en el portapapeles"
    );
  }
}

module.exports = {
  setIpc,
  openDirectory,
  saveFile,
  openPreferences,
  uploadImage,
  pasteImage,
};
