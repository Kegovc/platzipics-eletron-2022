const env = process.env.NODE_ENV || 'development';
import electronDebug from 'electron-debug'
import devtron from 'devtron'
  
if (env === 'development') {
    try {
        // devtron.install()
        require('electron-reloader')(module, {
            debug: true,
            watchRenderer: true
        });
        electronDebug({showDevTools: true})
    } catch (_) { console.log('Error', _); }    
}