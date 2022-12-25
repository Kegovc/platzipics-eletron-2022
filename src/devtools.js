const env = process.env.NODE_ENV || 'development';
import {session, BrowserWindow} from 'electron'
import electronDebug from 'electron-debug'
import path from 'path'
  
if (env === 'development') {
    try {
        require('electron-reloader')(module, {
            debug: true,
            watchRenderer: true
        });
        //electronDebug({showDevTools: true})
        
    } catch (_) { console.log('Error', _); }    
}