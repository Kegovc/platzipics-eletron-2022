import { ipcMain, dialog } from "electron";

import fs from "fs";
import isImage from "is-image";
import path from "path";
import { filesize } from "filesize";

export function setMainIpc(win) {
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
              throw err;
            }

            images.push(
              ...files
                .filter((file) => isImage(file))
                .map((img) => {
                  const imageFile = path.join(dir.filePaths[0], img);
                  const stats = fs.statSync(imageFile);
                  return {
                    filename: img,
                    src: `file://${imageFile}`,
                    size: filesize(stats.size, { round: 0 }),
                  };
                })
            );
            event.sender.send("load-images", images);
          });
        }
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
