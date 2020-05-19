'use strict';

const { BrowserWindow } = require("electron");
const { isDevMode } = require("./common");

class RendererConsole {
    static window = BrowserWindow;

    /** 開發模式下，輸出偵錯訊息到 Renderer */
    static log(message, ...params) {
        if (isDevMode()) {
            this.window.webContents.send("console-log", { message, params });
        }
    }

    /** 開發模式下，輸出警告訊息到 Renderer */
    static warn(message, ...params) {
        if (isDevMode()) {
            this.window.webContents.send("console-warn", { message, params });
        }
    }

    /** 開發模式下，清除 Renderer */
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

module.exports = RendererConsole;