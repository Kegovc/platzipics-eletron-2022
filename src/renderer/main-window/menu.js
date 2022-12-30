const {
  openDirectory,
  saveFile,
  openPreferences,
  uploadImage,
  pasteImage,
} = window.require("./main-window/ipcRendererEvent");
const { print } = window.require("./main-window/images-ui");

function createMenu() {
  const { Menu } = window.require("@electron/remote");
  const template = [
    {
      label: "Archivo",
      submenu: [
        {
          label: "Abrir ubicación",
          accelerator: "CmdOrCtrl+O",
          click() {
            openDirectory();
          },
        },
        {
          label: "Guardar",
          accelerator: "CmdOrCtrl+G",
          click() {
            saveFile();
          },
        },
        {
          label: "Preferencias",
          accelerator: "CmdOrCtrl+,",
          click() {
            openPreferences();
          },
        },
        {
          label: "Cerrar",
          role: "quit",
        },
      ],
    },
    {
      label: "Edición",
      submenu: [
        {
          label: "Imprimir",
          accelerator: "CmdOrCtrl+P",
          click() {
            print();
          },
        },
        {
          label: "Subir a Cloudup",
          accelerator: "CmdOrCtrl+U",
          click() {
            uploadImage();
          },
        },
        {
          label: "Pegar imagen",
          accelerator: "CmdOrCtrl+V",
          click() {
            pasteImage();
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = createMenu