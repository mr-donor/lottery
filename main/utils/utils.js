'use strict';

const { app, BrowserWindow } = require("electron");
const ElectronStore = require("electron-store");

function encodeBase64(string) {
    return btoa(encodeURI(string));
}

function decodeBase64(string) {
    return decodeURI(atob(string));
}

function isDevMode() {
    return !app.isPackaged;
};

class RendererConsole {
    static window = BrowserWindow;

    /** 輸出偵錯訊息到 Renderer (Development Mode) */
    static log(message, ...params) {
        if (isDevMode()) {
            this.window.webContents.send("console-log", { message, params });
        }
    }

    /** 輸出警告訊息到 Renderer (Development Mode) */
    static warn(message, ...params) {
        if (isDevMode()) {
            this.window.webContents.send("console-warn", { message, params });
        }
    }

    /** 清除 Renderer console (Development Mode) */
    static clear() {
        if (isDevMode()) {
            this.window.webContents.send("console-clear")
        }
    }

    /** 輸出錯誤訊息到 Renderer */
    static error(message, ...params) {
        this.window.webContents.send("console-error", { message, params });
    }
}

class LogFile {
    static storeName = "lottery";
    static store = new ElectronStore({ name: LogFile.storeName });

    constructor(name) {
        LogFile.store = new ElectronStore({ name });
    }

    static log(message) {
        if (message) {
            const log = LogFile.store.get("log");
            
            if (log.isArray) {
                log.push(message);
                LogFile.store.set("log", log);
            } else {
                const log = []
                log.push(message);
                LogFile.store.set("log", log);
            }
        }
    }

    static clear() {
        LogFile.store.set("log", []);
    }
}

module.exports = {
    RendererConsole: RendererConsole,
    LogFile: LogFile,
    isDevMode: isDevMode
};