'use strict';

const { app } = require('electron');
const path = require('path');

module.exports = class CSSLoader {
	constructor(main){
		this.main = main;
		this.options = {
			cssPaths: [
				path.join(__dirname, 'style.css'),
				path.join(app.getPath('userData'), 'css', 'style.css')
			]
		};
		this.main._log('CSS module initialized');
	}

	// Renderer function
	_load(options){
		const path = ElectronApi.require('path');
		const fs = ElectronApi.require('fs');

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
				console.log(css);
				window.customCss[p].innerHTML = css;
				console.log(`%c[Electron] %cCustom stylesheet loaded!`, 'color:#039be5;font-weight:bold', 'color:inherit;font-weight:normal;');
				console.dir(window.customCss[p]);
				
				if (!window.cssWatchers[i]) {
					window.cssWatchers[i] = fs.watch(p, { encoding: 'utf-8' },
					eventType => {
						if (eventType == 'change') {
							readFile(p).then(newCss => {
								window.customCss[p].innerHTML = newCss;
								console.log(`%c[Electron] %cCustom stylesheet reloaded!`, 'color:#039be5;font-weight:bold', 'color:inherit;font-weight:normal;');
								console.dir(window.customCss[p]);
							});
						}
					});
				}
			}).catch((p) => console.warn(`%c[Electron] %cCustom stylesheet not found. Skipping... (${p})`, 'color:#039be5;font-weight:bold', 'color:inherit;font-weight:normal;'));
		}
	}
}
