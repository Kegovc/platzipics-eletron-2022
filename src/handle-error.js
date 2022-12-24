const { app, dialog } = require("electron");

function relaunchApp(win) {
  dialog.showMessageBox(win, {
    type: "error",
    title: "Platzipics",
    message: "Ocurrio un error inesperado, se reiniciara el aplicativo",
  }).then(res=>{
    app.relaunch()
    app.exit(0)
  });
}

function setupErrors(win) {
  win.webContents.on("crashed", () => {
    relaunchApp(win)
  });

  win.webContents.on("unresponsive", () => {
    dialog.showMessageBox(win, {
      type: "warning",
      title: "Platzipics",
      message: "Un proceso está tardando demasiado, puede esperar o reiniciar el aplicativo manualmente",
    }).then(res=>{
      app.relaunch()
      app.exit(0)
    });
  });

  process.on('uncaughtException', function(err){
    relaunchApp(win)
  })
}


module.exports = {setupErrors}