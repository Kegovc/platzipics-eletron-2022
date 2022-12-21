'use strict'

// El objeto app permitirá controlar eventos
import { app, BrowserWindow } from 'electron'
import './devtools'

// console.dir(app)
// Imprimirá en consola saliendo después de quitar
app.on('before-quit', () => {
    console.log("saliendo...");
})

// Construye nuestra primera ventana
app.on('ready', () => {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Hola Mundo!',
        center: true,
        maximizable: false,
        show: false
    })

    win.once('ready-to-show', ()=>{
        win.show();
    })

    win.on('move', ()=>{
        const position = win.getPosition()
        console.log(`la posición es ${position}`)
    })

    win.on('closed', () => {
        win = null
        app.quit()
    })
    
    win.loadURL(`file://${__dirname}/renderer/index.html`)
})

// app.quit()
