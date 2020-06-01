'use strict';

const { app } = require('electron');
const path = require('path');

module.exports = class CSSLoader {
	constructor(main){
		this.main = main;
		this.options = {
			cssPaths: [
				path.join(__dirname, '..', 'style.css'),
				path.join(app.getPath('userData'), 'css', 'user-style.css')
			]
		};
		this.main.log('CSS module initialized');
	}

	// Renderer function
	load(options){
		const path = ElectronApi.require('path');
		const fs = ElectronApi.require('fs');
		
		function createFile(path, callback){
			fs.writeFile(path, `/* Write your custom styles here */\n`, { flag: 'wx' }, err => {
				if (err) callback(err);
				this.main._log(`Empty user stylesheet created at ${path}`);
				callback(false);
			});
		}

		function readFile(path, encoding = 'utf-8') {
			return new Promise((resolve, reject) => {
					fs.readFile(path, encoding, (err, data) => {
					if (err) reject(err);
					else resolve([path, data]);
				});
			});
		}
		
		window.customCss = window.customCss || {};
		window.cssWatchers = window.cssWatchers || {};
		
		for (var i = 0, p; p = options.cssPaths[i]; i++){
			readFile(p).then(arr => {
				const p = arr[0];
				const css = arr[1];
				
				if (!window.customCss[p]){
					window.customCss[p] = document.createElement('style');
					document.head.appendChild(window.customCss[p]);
				}
				window.customCss[p].innerHTML = css;
				window.ElectronApi.log(`Stylesheet loaded!`);
				
				if (!window.cssWatchers[i]) {
					window.cssWatchers[i] = fs.watch(p, { encoding: 'utf-8' },
					eventType => {
						if (eventType == 'change') {
							readFile(p).then(newCss => {
								window.customCss[p].innerHTML = newCss;
								window.ElectronApi.log(`Stylesheet reloaded!`);
							});
						}
					});
				}
			}).catch((p) => window.ElectronApi.log(`Stylesheet not found. (${p})`, 'warn'));
		}
	}
}
