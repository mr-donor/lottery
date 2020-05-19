import { observable, action } from "mobx";
import { Socket } from "../../main/models";

class SocketStore {
    constructor() {
        this.socketState = SocketState.Closed;
    }

    setSocketState(SocketState) {
        this.socketState = Socket.state;
    }

}

module.exports = SocketStore;