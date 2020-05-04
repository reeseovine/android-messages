'use strict';

module.exports = class Controls {
	constructor(main){
		this.main = main;
		this.options = {
			dblClickable: false,
			draggable: false,
			fixed: true,
			style: 'mac',
			tall: true,
		 	transparent: true
		};
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
		
		document.body.classList.add('wb-' + wb.options.style);
		
		window.darkTimer = function(){
			var dark = document.body.classList.contains('dark-mode');
			var wb = document.getElementsByClassName('windowbar')[0];
			if (dark){
				wb.classList.add('dark');
			} else {
				wb.classList.remove('dark');
			}
			setTimeout(window.darkTimer, 1000);
		}
		window.darkTimer();
	}
}
