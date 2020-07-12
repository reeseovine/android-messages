const { app, Menu, Tray } = require('electron');
const path = require('path');
const fs = require("fs")
const os = require("os")

module.exports = class AppTray {
	constructor(main){
		this.main = main;
		this.options = {
			iconDark: true
		};
		this.tray = new Tray(path.join(__dirname, '..', 'img', 'tray.png'));
		this._updateMenu(0);
		var contextMenu = Menu.buildFromTemplate([
			{
				label: 'Open', click: async () => {
					this.main.win.show();
					this.main.win.focus();
				}
			},
			{
				label: 'Quit', click: async () => {
					// app.isQuitting = true;
					app.quit();
				}
			},
			{
				label: 'Start on login',
				type: 'checkbox',
				enabled: /^(darwin|win32|linux)$/.test(process.platform),
				checked: this.__isAutostartEnabled(),
				click: async (item) => {
					if (item.checked) {
						this._enableAutostart()
					} else {
						this.__disableAutostart()
					}
				},
			}
		]);
		this.tray.setContextMenu(contextMenu);
		
		this.load();
		
		// Keep tray open unless explicitly told to quit -- feature turned off for now
		this.main.win.on('close', function(event){
			app.quit();
			
			// if(!app.isQuitting){
			// 	event.preventDefault();
			// 	this.hide();
			// }
			//
			// return false;
			//
			// app.isQuitting = true;
		});
		
		this.main.log('Tray module initialized');
	}
	
	load(){
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
		
		this.tray.setImage(path.join(__dirname, '..', 'img', image));
		this.tray.setToolTip(unreadStr);
	}

	_enableAutostart() {
		if (process.platform === "linux") {
			const appPath = (process.env.APPIMAGE ? process.env.APPIMAGE : process.execPath)

			const data = `[Desktop Entry]
Type=Application 
Version=1.0
Name=Android Message
Comment=Android Message startup script
Exec='${appPath}'
StartupNotify=false
Terminal=false`

			fs.writeFile(path.join(os.homedir(), ".config", "autostart", "android-message.desktop"), data, (error) => {
				if (error) console.error(error)
			})

		} else {
			app.setLoginItemSettings({
				openAtLogin: true
			})
		}
	}
	__disableAutostart() {
		if (process.platform === "linux") {
			fs.unlink(path.join(os.homedir(), ".config", "autostart", "android-message.desktop"), (error) => {
				if (error) console.error(error)
			})
		} else {
			app.setLoginItemSettings({
				openAtLogin: false
			})

		}
	}
	__isAutostartEnabled() {
		if (process.platform === "linux") {
			return fs.existsSync(path.join(os.homedir(), ".config", "autostart", "android-message.desktop"))
		} else {
			return app.getLoginItemSettings().openAtLogin
		}
	}
}
