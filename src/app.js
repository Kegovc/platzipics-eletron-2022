"use strict";

// El objeto app permitirá controlar eventos

const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const devtool = require("./devtools");

const fs = require("fs");
const isImage = require("is-image");
import path from "path";
import {filesize} from "filesize";

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

ipcMain.on("open-directory", (event) => {
  console.log("open-directory");
  dialog
    .showOpenDialog(win, {
      title: "Selecione la nueva ubicación",
      buttonLabel: "Abrir ubicación",
      properties: ["openDirectory"],
    })
    .then((dir) => {
      if (dir) {
        const images = [];
        fs.readdir(dir.filePaths[0], (err, files) => {
          if (err) {
            console.log("err", err);
            throw err
          }

          images.push(
            ...files
              .filter((file) => isImage(file))
              .map((img) => {
                const imageFile = path.join(dir.filePaths[0], img)
                const stats = fs.statSync(imageFile)
                return {
                  filename: img,
                  src: `file://${imageFile}`,
                  size: filesize(stats.size, {round: 0}),
                };
              })
          );
          event.sender.send('load-images', images)
        });
      }
      console.log(dir);
    });
  //event.sender.send('pong', new Date())
});

// app.quit()
