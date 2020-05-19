'use strict';

const ElectronStore = require("electron-store");

class LogStore {
    static name = "lottery";
    static store = new ElectronStore({ name: LogStore.name });

    constructor(name) {
        LogStore.store = new ElectronStore({ name });
    }

    static log(message) {
        if (message) {
            const log = LogStore.store.get("log");
            
            if (log.isArray) {
                log.push(message);
                LogStore.store.set("log", log);
            } else {
                const log = []
                log.push(message);
                LogStore.store.set("log", log);
            }
        }
    }

    static clear() {
        LogStore.store.set("log", []);
    }
}

module.exports = LogStore;