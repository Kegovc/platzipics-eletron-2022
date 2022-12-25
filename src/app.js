"use strict";

// El objeto app permitirá controlar eventos

import { app, BrowserWindow } from "electron";
import { setMainIpc } from "./ipcMainEvents";
import * as dev from "./devtools";
import { setupErrors } from "./handle-error";

import * as remote from "@electron/remote/main";

// const dev = require('./devtools')

// console.dir(app)
// let win;
global.win // eslint-disable-line camelcase

function createWindow() {
  global.win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,

      plugins: true, 
      
      
      backgroundThrottling: false,
      nativeWindowOpen: false,
      webSecurity: false 
    },
    width: 800,
    height: 600,
    title: "Hola Mundo!",
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
}

// Imprimirá en consola saliendo después de quitar
app.on("before-quit", () => {
  console.log("saliendo...");
});

// Construye nuestra primera ventana
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// app.quit()
