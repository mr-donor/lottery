'use strict';

const { app } = require("electron");

function encodeBase64(string) {
    return btoa(encodeURI(string));
}

function decodeBase64(string) {
    return decodeURI(atob(string));
}

function isDevMode() {
    return !app.isPackaged;
}

module.exports = {
    isDevMode: isDevMode,
    encodeBase64: encodeBase64,
    decodeBase64: decodeBase64
}