const { app, Menu, Tray } = require('electron');
const path = require('path');

module.exports = class AppTray {
	constructor(main){
		this.main = main;
		
		this.tray = new Tray(path.join(__dirname, 'img', 'message-white.png'));
		this.updateUnread(0);
		
		// Keep tray open unless explicitly told to quit
		this.main.win.on('close', function(event){
			if(!app.isQuitting){
				event.preventDefault();
				this.hide();
			}

			return false;
		});
	}
	
	updateUnread(count){
		var contextMenu = Menu.buildFromTemplate([
			{
				label: count + ' unread message' + (count !== 1 ? 's' : ''),
				disabled: true
			},
			{ type: 'separator' },
			{
				label: 'Open', click: async () => {
					this.main.win.show();
				}
			},
			{
				label: 'Quit', click: async () => {
					app.isQuitting = true;
					app.quit();
				}
			},
		]);
		this.tray.setContextMenu(contextMenu);
		this.tray.setToolTip(count + ' unread message' + (count !== 1 ? 's' : ''));
	}
}
