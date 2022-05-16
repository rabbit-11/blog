import { component } from "@egova/flagwind-web";
import Vue from "vue";
import Cookies from "js-cookie";

@component
export class UserMixin extends Vue {

    public get $user(): any {
        return this.$store.state.user;
    }

    public get $isLogin(): boolean {
        return this.$store.state.user.username !== "";
    }
    public get $username() {
        return Cookies.get("username");
    }

    public get $showLoginModal(): boolean {
        return this.$store.getters["user/showLogin"];
    }

    public $openLoginModal() {

        this.$store.commit("user/openLoginModal");
    }

    public $closeLoginModal() {
        this.$store.commit("user/closeLoginModal");
    }

    public get $notice() {
        return this.$Notice;
    }

    public get $message() {
        return this.$Message;
    }
}