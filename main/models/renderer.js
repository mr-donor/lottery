'use strict';

const { ipcRenderer, EventEmitter } = require('electron');

class Renderer {
    static async send(channel, ...args) {
        
        return new Promise(resolve => {
            ipcRenderer.once(channel, (event, response) => {
                resolve(response);
            });

            console.warn("render: " + channel);

            ipcRenderer.send(channel, ...args);
        });
    }
}

module.exports = Renderer;