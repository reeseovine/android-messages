const { app, BrowserWindow } = require('electron');
// const path = require('path');
const Main = require('./main.js');
const pak = require('./package.json');

// const glasstron = require('./glasstron');
// glasstron.init();

function createWindow(){
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 400,
		minHeight: 300,
		title: 'Android Messages',
		icon: './img/icon.png',
		frame: false,
		transparent: true,
		backgroundColor: '#00000000',
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		},
		_package: require('./package.json')
	});
	
	// glasstron.update(win, {
	// 	windows: {
	// 		blurType: 'acrylic',
	// 		performanceMode: true
	// 	},
	// 	linux: true,
	// 	macos: {
	// 		vibrancy: 'fullscreen-ui'
	// 	}
	// });
	
	new Main(win);
	
	// and load the index.html of the app.
	win.loadURL(pak.mw_url);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();
}

app.allowRendererProcessReuse = true;

app.on('ready', function(){
	setTimeout(createWindow, 300);
});

// Quit when all windows are closed.
app.on('window-all-closed', function(){
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function(){
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// require('./tray');
