'use strict';

const { app } = require('electron');
const path = require('path');

module.exports = class CSSLoader {
	constructor(main){
		this.main = main;
		this.options = {
			cssPath: path.join(__dirname, 'style.css')
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
					else resolve(data);
				});
			});
		}
		
		const cssPath = options.cssPath;

		readFile(cssPath).then(css => {
			if (!window.customCss) {
				window.customCss = document.createElement('style');
				document.head.appendChild(window.customCss);
			}
			window.customCss.innerHTML = css;
			console.log('%c[Electron] %cCustom stylesheet loaded!', 'color:#039be5;font-weight:bold', 'color:inherit;font-weight:normal;');

			if (window.cssWatcher == null) {
				window.cssWatcher = fs.watch(cssPath, { encoding: 'utf-8' },
				eventType => {
					if (eventType == 'change') {
						readFile(cssPath).then(newCss => {
							window.customCss.innerHTML = newCss;
							console.log('%c[Electron] %cCustom stylesheet reloaded!', 'color:#039be5;font-weight:bold', 'color:inherit;font-weight:normal;');
						});
					}
				});
			}
		}).catch(() => console.warn('%c[Electron] %cCustom stylesheet not found. Skipping...', 'color:#039be5;font-weight:bold', 'color:inherit;font-weight:normal;'));
	}
}
