const glasstron = require('glasstron');
glasstron.init(); // THIS should be called before we require the BrowserWindow class

const { app, BrowserWindow } = require('electron');
const path = require('path');
const Main = require('./main.js');
const pak = require('./package.json');

function createWindow(){
	var win = new BrowserWindow({
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
	
	win.loadURL(pak.mw_url);
}

app.allowRendererProcessReuse = true;

app.on('ready', function(){
	createWindow();
});

app.on('activate', function(){
	if (BrowserWindow.getAllWindows().length === 0){
		createWindow();
	} else {
		BrowserWindow.getAllWindows()[0].show();
	}
});
