// Renderer process
const modal = require('electron-modal');
const path = require('path');
 
modal.open(path.join(__dirname, 'modal.html'), {
 
  // Any BrowserWindow options
  width: 400,
  height: 300
 
});