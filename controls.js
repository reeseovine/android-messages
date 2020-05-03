'use strict';

module.exports = class Controls {
	constructor(main){
		this.main = main;
		this.options = {
			dark: true,
			dblClickable: false,
			draggable: false,
			fixed: true,
			tall: true,
		 	transparent: true };
		this.main._log('Windowbar module initialized');
	}

	// Renderer function
	_load(options){
		const win = ElectronApi.require('electron').remote.getCurrentWindow();
		const windowbar = ElectronApi.require('windowbar');
		
		const wb = new windowbar(options)
			.on('close', () => { win.close() })
			.on('minimize', () => { win.minimize() })
			.on('fullscreen', () => { win.setFullScreen(!(win.isFullScreen())) })
			.on('maximize', () => { win.isMaximized() ? win.unmaximize() : win.maximize() })
			.appendTo(document.body);
		
		document.body.className = document.body.className.concat(' wb-' + wb.options.style);
		
		return wb;
	}
}
