const{app, BrowserWindow, Menu} = require('electron')

const path = require('path')
const url = require('url')

require('electron-reload')(__dirname)


let win

function createWindow() {
	win = new BrowserWindow({width:975, height:592, resizable:false})

	win.loadURL(url.format({
		pathname:path.join(__dirname, 'main.html'),
		protocol: 'file',
		slashes:true
	}))

	win.on('closed', () => {
		win = null
	})
	//win.openDevTools()
}

app.on('ready', createWindow)

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

