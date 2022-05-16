import Cookies from "js-cookie";
const userInfo = {
    state: {
        user: null,
        // loginBtnlShow: Cookies.get("username") ? false : true,
        loginModlelShow: false
    },
    getters: {
        userPhoto: (state: any) => {
            if (!state.user) {
                return require("@/assets/images/default-user.png");
            }
            return state.user.photo;
        }
    },
    mutations: {
        saveUser(state: any, userInfo: any) {
            state.user = userInfo.user;
            Cookies.set("username", userInfo.user.userName);
            if (userInfo.access_token) {
                Cookies.set("access_token", userInfo.access_token);
            }
            Cookies.set("xToken", userInfo.xToken);
        },
        clearUser(state: any) {
            state.user = null;
            Cookies.remove("username");
            Cookies.remove("access_token");
            Cookies.remove("xToken");
        },
        // updateLoginBtn(state: any, isLogin: any) {
        //     state.loginBtnlShow = isLogin;
        // },
        updateLoginModal(state: any, loginModlelShow: any) {
            state.loginModlelShow = loginModlelShow;
        },
        logout(vm: any) {
            userInfo.mutations.clearUser(userInfo.state);
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
        }
    }

};

export default userInfo;
