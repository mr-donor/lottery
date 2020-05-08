const {
    app,
    BrowserWindow,
    BrowserWindowConstructorOptions,
    Menu,
    MenuItemConstructorOptions,
    MenuItem,
    ipcMain,
    Tray,
    globalShortcut,
    Event,
    shell
} = require("electron");
const path = require ("path");
const installExtension = require("electron-devtools-installer");
const { isDevMode, RendererConsole, LogFile } = require("./utils/index.js");
const Lottery = require("./lottery/index.js");

class Main {
	constructor() {
		this.mainWindow = null;
        this.tray = null;
        this.icon = path.join(__dirname, "../resources/icons/lottery-256x256.png");
		this.windowOptions = {
            icon: this.icon,
            title: 'LOTTERY 抽獎機',
            width: 400,
            height: 600,
            backgroundColor: "#FFF",
            webPreferences: {
				// nodeIntegration: true,
				contextIsolation: true,
				preload: path.join(app.getAppPath(), 'preload.js')
            },
            // show: false,
            // frame: true,
            // zoomToPageWidth: false,
            // transparent: false, // 透明的時候將不能resize
            // skipTaskbar: process.platform === "win32" ? true : false,
        };
	}

	run() {
		if (!isDevMode()) {
            process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
        }

        this.lottery = new Lottery();

		app.whenReady().then(this.createMainWindow());

        app.on('activate', () => {
			if (BrowserWindow.getAllWindows().length === 0) {
		    	createWindow();
		  	}
		});

		app.on("before-quit", () => {
            this.forceQuit = true;
        })
	}

	/** 建立主程式視窗 */
    createMainWindow() {
    	this.mainWindow = new BrowserWindow(this.windowOptions);

		this.mainWindow.on("blur", () => {
            // this.hide()
        });

		this.mainWindow.on("focus", () => {
            this.mainWindow.webContents.send("update:focus");
        });

    	this.mainWindow.once("ready-to-show", () => {
            this.mainWindow.maximize()
            this.mainWindow.show()
        });

		this.mainWindow.on("close", event => {
            if (!this.forceQuit) {
                event.preventDefault();
                this.forceQuit = true;
                this.quit();
            }
        });

        this.mainWindow.once("show", () => {
            LogFile.clear()
            LogFile.log("hello world");

            if (isDevMode()) {
                const options = {
                    body: "開發者模式",
                }
                this.mainWindow.webContents.send("/notification", options);
            }
        })

		RendererConsole.window = this.mainWindow;

		this.tray = new Tray(this.icon);

		this.tray.on("click", () => {
            this.mainWindow.show();
        })

    	Menu.setApplicationMenu(null);

    	this.mainWindow.setMenuBarVisibility(false);

    	if (isDevMode()) {

            globalShortcut.register("f5", () => {
                this.mainWindow.reload();
            })

    		// 安裝 react 開發者工具
            installExtension(installExtension.REACT_DEVELOPER_TOOLS, true).then(name => {
                console.warn(`Added Extension:  ${name}`)
            }).catch(err => {
                console.error("REACT_DEVELOPER_TOOLS ", err);
            });

    		this.mainWindow.webContents.openDevTools();
    		this.mainWindow.loadURL('http://localhost:3000/');
    	} else {
    		this.mainWindow.loadFile('dist/index.html');
    	}

    	 this.createAPI();
    }

	/** 建立前端應用 API */
    createAPI() {

    }

	quit() {
        app.quit();
        this.mainWindow = null;
    }

    /** Chromium 的語系 */
    get locale() {
        return app.getLocale();
    }
}

module.exports = Main;