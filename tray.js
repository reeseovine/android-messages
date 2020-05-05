const { app, Menu, Tray } = require('electron');
const path = require('path');

module.exports = class AppTray {
	constructor(main){
		this.main = main;
		this.options = {
			iconDark: true
		};
		this.tray = new Tray();
		// this._updateMenu(0);
		
		this._load();
		
		// Keep tray open unless explicitly told to quit
		this.main.win.on('close', function(event){
			if(!app.isQuitting){
				event.preventDefault();
				this.hide();
			}

			return false;
		});
		
		this.main._log('Tray module initialized');
	}
	
	_load(){
		function getCount(appTray){
			appTray.main._executeInRenderer(function(){ return document.querySelectorAll('.text-content.unread').length; })
			.then((count) => {
				appTray._updateMenu(count);
				setTimeout(function(){
					getCount(appTray);
				}, 5000);
			});
		}
		
		var appTray = this;
		setTimeout(function(){
			getCount(appTray);
		}, 10000);
	}
	
	_updateMenu(count){
		var image = count > 0 ? 'tray-unread.png' : 'tray.png';
		
		var unreadStr = count + ' unread conversation' + (count !== 1 ? 's' : '');
		var contextMenu = Menu.buildFromTemplate([
			{
				label: unreadStr,
				disabled: true
			},
			{ type: 'separator' },
			{
				label: 'Open', click: async () => {
					this.main.win.show();
					this.main.win.focus();
				}
			},
			{
				label: 'Quit', click: async () => {
					app.isQuitting = true;
					app.quit();
				}
			},
		]);
		
		this.tray.setImage(path.join(__dirname, 'img', image));
		this.tray.setContextMenu(contextMenu);
		this.tray.setToolTip(unreadStr);
	}
}
