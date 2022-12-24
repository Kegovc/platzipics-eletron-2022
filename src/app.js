"use strict";

// El objeto app permitirá controlar eventos

import { app, BrowserWindow } from "electron";
import {setMainIpc} from "./ipcMainEvents";
import * as dev from "./devtools";
import {setupErrors} from "./handle-error";


// const dev = require('./devtools')


// console.dir(app)
let win;

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
    },
    width: 800,
    height: 600,
    title: "Hola Mundo!",
    center: true,
    maximizable: false,
  });

  win.once("ready-to-show", () => {
    win.show();
    setupErrors(win)
    setMainIpc(win)
  });

  win.on("move", () => {
    const position = win.getPosition();
    console.log(`la posición es ${position}`);
  });

  win.on("closed", () => {
    win = null;
    app.quit();
  });

  win.loadFile("./renderer/index.html");
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
