const { app, BrowserWindow } = require('electron');
const { Menu, ipcMain }      = require('electron');
const path                   = require('path');
const fs 					 = require("fs");

const main = {
	init: () => {
		Menu.setApplicationMenu(null);

	},
    createWindow: () => {
		let win = new BrowserWindow({
			width: 800,
			height: 600,
			backgroundColor: '#FFF',
			WebPreferences: {
				nodeIntegration: true,
				preload: path.join(__dirname, 'preload.js')
			}
		});
		
		win.loadURL('http://localhost:3000/');
		// win.loadFile('dist/index.html');
		win.webContents.openDevTools();
	}
};


main.init();

app.whenReady().then(main.createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

