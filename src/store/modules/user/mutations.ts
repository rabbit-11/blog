
import { MutationTree } from "vuex";
import flagwind from "flagwind-core";
import Type = flagwind.Type;
import UserState from "./state";
import { UserInfo } from "@/models";
import Cookies from "js-cookie";

const clearTheme = () => {
    // 恢复默认样式
    let themeLink = document.querySelector('link[name="theme"]');
    if (themeLink) {
        themeLink.setAttribute("href", "");
    }
    // 清空打开的页面等数据，但是保存主题数据
    let theme = "";
    if (localStorage.theme) {
        theme = localStorage.theme;
    }
    localStorage.clear();
    if (theme) {
        localStorage.theme = theme;
    }
};

export function openLoginModal(state: UserState) {
    state.loginModalVisible = true;
}

export function closeLoginModal(state: UserState) {
    state.loginModalVisible = false;
}

export function save(state: UserState, userInfo: UserInfo): void {
    state.id = userInfo.user.id;
    state.name = userInfo.user.name;
    state.username = userInfo.user.username || userInfo.user.userName;
    state.photo = userInfo.user.photo;
    state.detail = userInfo.user;
    state.permissions = userInfo.permissions || [];
    Cookies.set("username", state.username);
    Cookies.set("personId", userInfo.user.personId || "");
    if (userInfo.access_token) {
        Cookies.set("access_token", userInfo.access_token);
    }
}
export function clear(state: UserState): void {
    state.id = "";
    state.name = "";
    state.username = "";
    state.detail = {};
    state.permissions = [];
    Cookies.remove("username");
    Cookies.remove("personId");
    Cookies.remove("access_token");
}
export function logout(state: UserState): void {
    clear(state);
    clearTheme();
}

export default <MutationTree<UserState>>
    {
        openLoginModal,
        closeLoginModal,
        save,
        clear,
        logout
    };
