import { observable, action, computed, runInAction } from "mobx";
import { GraphQLError } from "graphql";
import { ApiRoute, Renderer, User, SocketState } from "../../main/models";

class UserStore {
    constructor() {
        runInAction(() => {
            this.socketState = SocketState.Closed;
            this.loginState = "logout";
            this.errMessage = "";
        })
    }

    @action setSocketState(SocketState) {
        this.socketState = SocketState;
    }

    @computed get logined() {
        return this.loginState === "logined";
    }

    @computed get logging() {
        return this.loginState === "logging";
    }

	@action async login(username, password) {
		const gql = `
        # query {
        #    me { username }
        # }
        mutation LoginMutation($user: UserInput!) {
            login(user: $user)
        }
        `;

        const args = {
            user: {
                username,
                password
            },
        }

        runInAction(() => {
            this.loginState = "logging";
        });

        const result = await Renderer.send(ApiRoute.test, gql, args);

        if (result.errors) {
            console.error(result.errors)
            runInAction(() => {
                this.loginState = "failed";
            })
            return
        }

        if (result.data.login !== "Ok") {
            runInAction(() => {
                this.loginState = "failed"
            })

            switch (result.data.login) {
                case "WebSocketFailed":
                    break
                case "WrongPassword":
                    break
                case "Overloading":
                    break
                case "HeavyLogin":
                    break
                default:
                    break
            }
            return;
        }

        runInAction(() => {
            this.loginState = "logined";
        });

	}

    async logout() {
        const gql = `mutation { logout }`;
        await Renderer.send(ApiRoute.test, gql);
        runInAction(() => {
            this.loginState = "logout";
        })
    }

}

module.exports = UserStore;