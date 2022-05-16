import * as models from "@/models";
import { GetterTree } from "vuex";
import State from "./state";

export function showLogin(state: State): boolean {
    return state.loginModalVisible;
}

export default <GetterTree<State, any>>
    {
        showLogin
    };