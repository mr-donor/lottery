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
const { 
	default: installExtension, 
	REACT_DEVELOPER_TOOLS 
} = require("electron-devtools-installer");
const {
    graphql,
    buildSchema,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLError,
    GraphQLEnumType,
} = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { common, RendererConsole, LogStore } = require("./utils");
const { ApiRoute } = require("./models");
const Lottery = require("./lottery");
const path = require ("path");
const url = require('url');
const fs = require('fs');
const { default:Semaphore } = require('semaphore-async-await');

const isDevMode = common.isDevMode;

class Main {
	constructor() {
		this.lock = new Semaphore(1);
        this.mainWindow = null;
        this.tray = null;
        this.icon = path.join(__dirname, "../resources/icons/lottery-256x256.png");
		this.windowOptions = {
            icon: this.icon,
            title: 'LOTTERY 抽獎機',
            width: 400,
            height: 600,
            frame: false,
            backgroundColor: "#202020",
            webPreferences: {
				// nodeIntegration: true,
				contextIsolation: true,
				preload: path.join(app.getAppPath(), 'preload.js')
            },
            show: false,
            hasShadow: true,
            zoomToPageWidth: false,
            transparent: false,
            // skipTaskbar: process.platform === "win32" ? true : false,
        };
	}

	run() {
		if (!isDevMode()) {
            process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
        } else {
            process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "false";
        }

        this.lottery = new Lottery();

		app.whenReady().then(() => this.createMainWindow());

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
            LogStore.clear()
            LogStore.log("hello world");

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

    	if (isDevMode()) {

            globalShortcut.register("f5", () => {
                this.mainWindow.reload();
            });

            globalShortcut.register("f12", () => {
                this.mainWindow.webContents.toggleDevTools()
            });

    		// 安裝 react 開發者工具
            installExtension(REACT_DEVELOPER_TOOLS, true).then(name => {
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
        fs.readFile(
            path.resolve(__dirname, "../resources/graphql/lottery.gql"),
            { encoding: "utf-8" },
            (err, data) => {
                if (err) {
                    console.error(err)
                    return;
                }
                const typeDefs = data;
                const resolvers = {
                    Query: {
                        user: () => {
                            return {
                                username: () => ''
                            }
                        }
                    },
                    Mutation: {

                    }
                };
                this.schema = makeExecutableSchema({ typeDefs, resolvers });
            }
        );

        ipcMain.on(ApiRoute.test, async(event, gqlquery, inputObject) => {
            // await this.lock.wait()
            // event.sender.send(ApiRoute.test, { message: "test" });
            // this.lock.signal();
            try {
                const result = await graphql(this.schema, gqlquery, null, null, inputObject)
                e.sender.send(ApiRoute.GraphQL, result)
            } catch (err) {
                e.sender.send(ApiRoute.GraphQL, err)
            }
        });


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