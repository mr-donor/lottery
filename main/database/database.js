'use strict';

const { EventEmitter } = require('events');

module.exports = class DataBase extends EventEmitter {
	constructor() {
        super()
        this.queue = []
        this.port = 3388;
    }

    async connect() {
    	return new Promise((resolve, reject) => {

    	});
    }

    close() {

    }


}