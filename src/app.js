"use strict";

// El objeto app permitirá controlar eventos

const { app, BrowserWindow } = require ("electron");
const devtool =  require("./devtools");

// console.dir(app)

function createWindow() {
  let win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
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
  
  win.on('closed', () => {
    win = null
    app.quit()
})

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
