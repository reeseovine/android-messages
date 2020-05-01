const { app, Menu, Tray } = require('electron');
const path = require('path');

let tray = null;

app.on('ready', () => {
	tray = new Tray(path.join(__dirname, 'img', 'message-white.png'));
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Open', click: async () => {
				app.focus();
			}
		},
		{
			label: 'Quit', click: async () => {
				app.quit();
			}
		},
	]);
	tray.setToolTip('0 unread messages');
	tray.setContextMenu(contextMenu);
});
