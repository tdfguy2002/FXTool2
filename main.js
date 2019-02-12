const{app, BrowserWindow, Menu} = require('electron')
const modal = require('electron-modal');

const path = require('path')
const url = require('url')

require('electron-reload')(__dirname)


let win

function createWindow() {
	win = new BrowserWindow({width:1200, height:650, resizable:true})
	// childWindow = new BrowserWindow({width:500, height:350, resizable:true, parent: win, modal: true, visible: false})

	win.loadURL(url.format({
		pathname:path.join(__dirname, 'main.html'),
		protocol: 'file',
		slashes:true
	}))

	// childWindow.loadURL(url.format({
	// 	pathname:path.join(__dirname, 'modal.html'),
	// 	protocol: 'file',
	// 	slashes:true
	// }))

	win.on('closed', () => {
		win = null
	})
	//win.openDevTools()
}

app.on('ready', () => {
	modal.setup();
	createWindow();
});

app.on('window-all-closed', ()=>{
	if(process.platform !== 'darwin'){
		app.quit()
	}
})

app.on('activate', ()=> {
	if (win === null){
		createWindow()
	}
})

