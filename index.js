const glasstron = require('glasstron');


glasstron.init(); // THIS should be called before we require the BrowserWindow class
const { app, BrowserWindow } = require('electron');
const path = require('path');
const Main = require('./main.js');
const pak = require('./package.json');

function createWindow(){
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 400,
		minHeight: 300,
		title: 'Android Messages',
		icon: path.join(__dirname, 'img', 'icon.png'),
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		},
		_package: require('./package.json')
	});
	
	glasstron.update({
		windows: {
			blurType: 'acrylic',
			performanceMode: true
		},
		linux: {
			requestBlur: true
		},
		macos: {
			vibrancy: 'fullscreen-ui'
		}
	});
	
	new Main(win);
	
	// and load the index.html of the app.
	win.loadURL(pak.mw_url);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();
}

app.allowRendererProcessReuse = true;

app.on('ready', function(){
	createWindow();
});

app.on('activate', function(){
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
