import { ipcMain, dialog, Menu } from "electron";

import fs from "fs";
import isImage from "is-image";
import path from "path";
import { filesize } from "filesize";

import Store from 'electron-store'

function loadImages(event, dir){
  if (dir) {
    const images = [];
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.log("err", err);
        throw err;
      }

      images.push(
        ...files
          .filter((file) => isImage(file))
          .map((img) => {
            const imageFile = path.join(dir, img);
            const stats = fs.statSync(imageFile);
            return {
              filename: img,
              src: `plp://${imageFile}`,
              size: filesize(stats.size, { round: 0 }),
            };
          })
      );
      event.sender.send("load-images", dir, images);
    });
  }
}

export function setMainIpc(win) {
  const store = new Store()
  ipcMain.handle('hasStore', (event, key) => {
    return store.has(key);
  });
  ipcMain.handle('getStore', (event, key) => {
    return key?store.get(key):store.get();
  });
  ipcMain.handle('setStore', (event, key, value) => {
    return store.set(key, value);
  });

  ipcMain.on("load-directory", loadImages)

  ipcMain.on("open-directory", (event) => {
    console.log("open-directory");
    dialog
      .showOpenDialog(win, {
        title: "Selecione la nueva ubicación",
        buttonLabel: "Abrir ubicación",
        properties: ["openDirectory"],
      })
      .then((dir) => {
        loadImages(event, dir.filePaths[0])
        console.log(dir);
      });
  });

  ipcMain.on("open-save-dialog", (event, ext) => {
    console.log("open-save-dialog", ext);
    dialog
      .showSaveDialog(win, {
        title: "Guardar imagen modificada",
        buttonLabel: "Guardar imagen",
        filters: [{ name: "Images", extensions: [ext.substring(1)] }],
      })
      .then((file) => {
        if (file.canceled) {
          return;
        }
        event.sender.send("save-image", file.filePath);
        // console.log(file.filePath);
      });
  });

  ipcMain.on("show-dialog", (event, { type, title, message }) => {
    dialog
      .showMessageBox(win, {
        type,
        title,
        message,
      })
      .then((res) => {
        console.log(res);
      });
  });

}
