import { resolve } from "path";
import Cookies from "js-cookie";

export const appRouter = {
  name: "menu",
  path: "/",
  title: "首页",
  meta: { title: "主页", single: false },
  redirect: "/home",
  component: () => import("@/pages/juntai/components/layout/container/index"),
  children: [
    {
      name: "home",
      path: "/home",
      title: "主页",
      meta: { title: "主页" },
      component: (resolve: any) => (<any>require)(["../views/home/index"], resolve)
    },
    {
      name: "article",
      path: "/article",
      title: "文章",
      meta: { title: "文章" },
      component: (resolve: any) => (<any>require)(["../views/article/index"], resolve)
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
