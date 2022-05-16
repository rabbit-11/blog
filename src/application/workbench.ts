import flagwind from "flagwind-core";
import WorkbenchBase = flagwind.WorkbenchBase;
import ApplicationContextBase = flagwind.ApplicationContextBase;
import ApplicationContext from "@/application/context";
import Workspace from "@/application/workspace";
import Vue from "vue";
import Router from "vue-router";
import Vuex, { Store } from "vuex";

// 导入系统组件
import components, { Component } from "@egova/flagwind-web";
import Cookies from "js-cookie";
import axios from "axios";
// 倒入全局样式
import "@/assets/styles/index.scss";
import { EventBusMixin } from "./broadcast";
import directives from "@/common/utils/directive";

// import "iview/dist/styles/iview.css";
/**
 * 提供工作台的基本封装。
 * @class
 * @version 1.0.0
 */
export default class Workbench extends WorkbenchBase {
    private _workspace: Workspace | undefined;

    /**
     * 获取当前应用的主工作空间。
     * @property
     * @returns Workspace
     */
    public get workspace(): Workspace | undefined {
        return this._workspace;
    }

    /**
     * 初始化工作台的新实例。
     * @param  {ApplicationContextBase} applicationContext
     */
    public constructor(context: ApplicationContextBase) {
        super(context);
    }

    /**
     * 当工作台打开时调用。
     * @async
     * @protected
     * @virtual
     * @param  {Array<string>} args
     * @returns void
     */
    protected async onOpen(args: Array<string>): Promise<void> {
        let context = this.applicationContext as ApplicationContext;

        Vue.config.devtools = process.env.NODE_ENV === "development";
        Vue.mixin(EventBusMixin);
        // 初始化组件
        this.initializeComponent();

        // 初始化路由程序
        this.initializeRouter(context);

        // 初始化状态管理程序
        this.initializeStore(context);

        // 初始化自定义指令
        this.initializeDirective();

        // Axios请求拦截器，随着业务的复杂，Axios层的使用将会越来越复杂，写个精简版的就行了。
        axios.interceptors.request.use(
            config => {
                let token = Cookies.get("access_token");
                // console.log("web api url:" + config.url);
                if (token && config.url && config.url.indexOf("unity") >= 0) {
                    // 判断是否存在token，如果存在的话，则每个http header都加上token
                    // console.log(
                    //     "config heaher authorization:" + "Bearer " + token
                    // );
                    config.headers.Authorization = "Bearer " + token;
                    // console.log("interceptors config=", config);
                }
                return config;
            },
            error => {
                console.error(error);
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            res => {
                // Do something with response data
                return res;
            },
            e => {
                // Do something with response error
                if (e.response && e.response.data) {
                    let data = e.response.data;
                    if (
                        data.error === "invalid_token" ||
                        e.response.status === 401
                    ) {
                        Cookies.remove("username");
                        return;
                    }
                }
                return Promise.reject(e);
            }
        );
        // 初始化工作空间
        this._workspace = this.createWorkspace();
    }

    /**
     * 创建一个工作空间对象。
     * @override
     * @returns IWorkspace
     */
    protected createWorkspace(): Workspace {
        return new Workspace(this);
    }

    /**
     * 初始化全局组件。
     * @param  {ApplicationContext} context 应用程序上下文实例。
     * @returns void
     */
    private initializeComponent(): void {
        // 注册系统组件
        Vue.use(components);
        // 解决flagwind-web中cascader组件解析成carousel
        const iview = require("view-design");
        Vue.use(iview);
        Vue.component("i-carousel", iview.Carousel);
        Vue.component("i-cascader", iview.Cascader);
    }

    /**
     * 初始化路由程序。
     * @param  {ApplicationContext} context 应用程序上下文实例。
     * @returns void
     */
    private initializeRouter(context: ApplicationContext): void {
        // 注册路由组件
        Vue.use(Router);

        // 初始化路由程序
        let router = new Router(context.routerOptions);

        router.beforeEach((to: any, from, next) => {
            let title = to.meta.title || "军泰英利";
            window.document.title = title;
            if (to.query.token) {
                let token = to.query.token;
                let username = to.query.username;
                Cookies.set("username", username);
                Cookies.set("access_token", token);
            }
            this.toPage(context, to, from, next);
        });

        router.afterEach(() => {
            window.scrollTo(0, 0);
        });

        // 设置路由程序
        context.router = router;
    }

    /**
     * 处理页面跳转
     * @param context
     */
    private toPage(context: any, to: any, from: any, next: any) {
        if (!Cookies.get("username")) {
            if (to.name === "publish" || to.name === "intro") {
                // (context.store as Store<any>).commit("updateLoginBtn", true);
                // (context.store as Store<any>).commit("updateLoginModal", true);
                (context.store as Store<any>).commit("user/openLoginModal");
                localStorage.setItem("destinationPath", to.name);
                return;
            } else {
                next();
            }
        } else {
            next();
        }

        // else {
        //     // 只有appRouter才需要进行权限控制 login 401 等等不需要
        //     PermissionUtil.handePermissionBeforeEach(
        //         [
        //             (context.routerOptions.routes as Array<any>).find(
        //                 r => r.name === "menu"
        //             )
        //         ],
        //         to,
        //         from,
        //         next
        //     );
        // }
    }

    /**
     * 初始化状态管理程序。
     * @param  {ApplicationContext} context 应用程序上下文实例。
     * @returns void
     */
    private initializeStore(context: ApplicationContext): void {
        // 注册状态管理程序
        Vue.use(Vuex);

        // 初始化状态容器
        let store = new Vuex.Store(context.storeOptions);

        // 设置状态容器
        context.store = store;
    }

    /**
     * 初始化自定义指令。
     * @param  {ApplicationContext} context 应用程序上下文实例。
     * @returns void
     */
    private initializeDirective(): void {
        Vue.use(directives);
    }
}
