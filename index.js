const glasstron = require('glasstron');
glasstron.init(); // this should be called before we require the BrowserWindow class

const { app, BrowserWindow } = require('electron');
const path = require('path');
const Main = require('./main.js');
const pak = require('./package.json');

// Check if an instance is already running
if (!app.requestSingleInstanceLock()){
  app.quit()
}

let win = null;
let main = null;

function createWindow(){
	win = new BrowserWindow({
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
	
	main = new Main(win);
	
	try {
		glasstron.update(win, {
			windows: {
				blurType: 'blurbehind',
				performanceMode: true
			},
			linux: {
				requestBlur: true
			},
			macos: {
				vibrancy: 'fullscreen-ui'
			}
		});
	} catch (e){
		main._log('Glasstron was unable to blur the window.', 'warn');
	}
		
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

app.on('second-instance', (event, commandLine, workingDirectory) => {
	// Someone tried to run a second instance, we should focus our window.
	if (win){
		if (win.isMinimized()) win.restore();
		win.show();
		win.focus();
	}
});
