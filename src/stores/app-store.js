import { configure } from "mobx";
import { UserStore } from "./user-store"

// configure({
//     enforceActions: "always",
// });

class AppStore {
    static user = "user"

    constructor() {
        this.user = new UserStore()
    }
}

module.exports = AppStore;