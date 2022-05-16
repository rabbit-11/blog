import Vue, { DirectiveOptions } from "vue";
import Router, { RouterOptions } from "vue-router";
import Vuex, { Store, StoreOptions } from "vuex";
import flagwind from "flagwind-core";
import Workbench from "@/application/workbench";
import IWorkbench = flagwind.IWorkbench;
import ApplicationContextBase = flagwind.ApplicationContextBase;
import InvalidOperationException = flagwind.InvalidOperationException;

/**
 * 包含当前应用程序的上下文实例。
 * @class
 * @version 1.0.0
 */
export default class ApplicationContext extends ApplicationContextBase {
    private routes!: any;
    private _router!: Router;
    private _store!: Store<any>;

    private _directives: DirectiveOptions | undefined;

    public routerOptions: RouterOptions;
    public storeOptions: StoreOptions<any>;

    /**
     * 获取或设置当前应用的主路由对象。
     * @property
     * @returns Router
     */
    public get router(): Router {
        return this._router;
    }

    public set router(value: Router) {
        if (!value) {
            throw new InvalidOperationException();
        }

        this._router = value;
    }

    /**
     * 获取或设置当前应用的状态管理对象。
     * @property
     * @returns StoreOptions<any>
     */
    public get store(): Store<any> {
        return this._store;
    }

    public set store(value: Store<any>) {
        if (!value) {
            throw new InvalidOperationException();
        }

        this._store = value;
    }

    /**
     * 获取当前应用程序的上下文实例。
     * @static
     * @member
     */
    // public static current: ApplicationContext = new ApplicationContext();
    /**
     * 私有构造函数。
     * @private
     */
    public constructor(routes: any, modules: any) {
        super("egova-web-demo");
        this.routerOptions = { routes: routes };
        this.storeOptions = { modules: modules };
    }

    /**
     * 创建一个工作台对象。
     * @override
     * @returns IWorkbench
     */
    protected createWorkbench(args: Array<string>): IWorkbench {
        return new Workbench(this);
    }
}
