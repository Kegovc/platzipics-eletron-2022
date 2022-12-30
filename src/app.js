"use strict";

// El objeto app permitirá controlar eventos

import { app, BrowserWindow, Tray, globalShortcut, protocol } from "electron";
import { setMainIpc } from "./ipcMainEvents";
import * as dev from "./devtools";
import { setupErrors } from "./handle-error";
import os from "os";
import path from "path";

import * as remote from "@electron/remote/main";

// const dev = require('./devtools')

// console.dir(app)
// let win;
global.win; // eslint-disable-line
global.tray; // eslint-disable-line

function createWindow() {
  global.win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,

      plugins: true,

      backgroundThrottling: false,
      nativeWindowOpen: false,
      webSecurity: false,
    },
    width: 800,
    height: 600,
    title: "Platzipics",
    center: true,
    maximizable: false,
    show: false,
  });

  global.win.once("ready-to-show", () => {
    global.win.show();
    remote.initialize();
    remote.enable(global.win.webContents);
    setupErrors(global.win);
    setMainIpc(global.win);
    globalShortcut.register('CommandOrControl+Alt+p', () => {
      global.win.show()
      global.win.focus()
    })
  });

  global.win.on("move", () => {
    const position = global.win.getPosition();
    console.log(`la posición es ${position}`);
  });

  global.win.on("closed", () => {
    global.win = null;
    app.quit();
  });

  global.win.loadFile("./renderer/index.html");

  let icon = path.join(__dirname, "assets", "icons", "tray-icon.png");

  if (os.platform() === "win32") {
    icon = path.join(__dirname, "assets", "icons", "tray-icon.ico");
  }

  global.tray = new Tray(icon);
  global.tray.setToolTip("Esto es platizipics");
  global.tray.on("click", () => {
    global.win.isVisible() ? global.win.hide() : global.win.show();
  });
  // const contextMenu = Menu.buildFromTemplate([
  //   { label: 'Item1', type: 'radio' },
  //   { label: 'Item2', type: 'radio' }
  // ])

  // // Make a change to the context menu
  // contextMenu.items[1].checked = false

  // // Call this again for Linux because we modified the context menu
  // global.tray.setContextMenu(contextMenu)
}

// Imprimirá en consola saliendo después de quitar
app.on("before-quit", () => {
  globalShortcut.unregisterAll()
});

// Construye nuestra primera ventana
app.whenReady().then(() => {

  protocol.registerFileProtocol('plp', (request, callback) => {
    const url = request.url.substr(6)
    callback({path: path.normalize(url)}) // eslint-disable-line
  }, (err) => {
    if (err) throw err
  })

  createWindow();


  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  console.log("window-all-closed")
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// app.quit()
