'use strict';

const electron = require('electron');
const fs = require('fs');
const path = require('path');

const config = require('./config');
const CSS = require('./modules/css_loader');
const Windowbar = require('./modules/windowbar');
const AppTray = require('./modules/tray');

module.exports = class Main {
	constructor(win){
		Object.defineProperty(this, 'win', {get: function() { return win; }});
		
		this.css = new CSS(this);
		this.wb = new Windowbar(this);
		this.tray = new AppTray(this);
		
		// Let's register our event listeners now.
		this._eventListener();
	}
	
	/**
	 * handy method to log directly to DevTools
	 */
	_log(message, level = 'log'){
		this._executeInRenderer(
			// RENDERER CODE BEGIN
			function(message, level){
				console[level]('%c[Electron] %c' + message, 'color:#039be5;font-weight:bold', 'color:inherit;font-weight:normal;');
			}
			// RENDERER CODE END
		, message, level);
	}
	
	/**
	 * The hook method
	 */
	_hook(){
		this._exposeApi();
		
		// Let's read our stylesheet now.
		this._executeInRenderer(this.css._load, this.css.options);
		this._executeInRenderer(this.wb._load,  this.wb.options);
	}
	
	/**
	 * This is the event listener. Every fired event gets listened here.
	 */
	_eventListener(){
		// Hook when the window is loaded
		this.win.webContents.on('dom-ready', () => {
			this._hook();
		});
	}
	
	/**
	 * Expose a quite handy ElectronApi object to the renderer
	 */
	_exposeApi(){
		this._executeInRenderer(
			// RENDERER CODE BEGIN
			function(version){
				window.ElectronApi = {
					require: window.require,
					log: function(message, level = 'log'){
						console[level]('%c[Electron] %c' + message, 'color:#039be5;font-weight:bold', 'color:inherit;font-weight:normal;');
					}
				};
			}
			// RENDERER CODE END
		);
	}
	
	_executeInRenderer(method, ...params){
		if(method.name.length !== 0)
			method = method.toString().replace(method.name, 'function').replace('function function', 'function');
		else method = method.toString();
		return this.win.webContents.executeJavaScript(`(${method})(...${JSON.stringify(params)});`);
	}
}
