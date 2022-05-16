import { resolve } from "path";
import Cookies from "js-cookie";

export const appRouter = {
  name: "menu",
  path: "/",
  title: "首页",
  meta: { title: "面板", single: false },
  redirect: "/panel",
  component: () => import("../components/layout/container/index"),
  children: [
    {
      name: "panel",
      path: "/panel",
      title: "面板",
      meta: { title: "面板" },
      component: (resolve: any) => (<any>require)(["../views/panel/index"], resolve)
    }
  ]
};

export const routes = [
  appRouter,
  {
    name: "500",
    path: "/500",
    component: () => import("@/views/errors/500")
  },
  {
    name: "403",
    path: "/403",
    component: () => import("@/views/errors/403")
  },
  {
    name: "401",
    path: "/401",
    component: () => import("@/views/errors/401")
  },
  {
    name: "404",
    path: "/*",
    component: () => import("@/views/errors/404")
  }
];
