import { lazy } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import LazyLoad from "./LazyLoad";
import { RouteObject as ReactRouterRouteObject } from "react-router-dom";
import Auth from "@/components/Auth";

export interface MetaProps {
	keepAlive?: boolean;
	requiresAuth?: boolean;
	title: string;
	key?: string;
  needBack?: boolean;
}

export type RouteObject = ReactRouterRouteObject & {
	children?: RouteObject[];
	meta?: MetaProps;
	isLink?: string;
};


const Router = () => {
  const AllRouters: RouteObject[] = [
    {
      path: '/',
      element: <Navigate to='/home' />,
    },
    {
      path: '/home',
      element: LazyLoad(lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home/index'))),
      meta: {
        requiresAuth: true,
        title: '首页',
        key: 'home',
      }
    },
    {
      path: "/auth",
      element: <Auth  />,
      children: [
        {
          path: "workspace",
          element: LazyLoad(lazy(() => import(/* webpackChunkName: "workspace" */ '@/pages/Workspace/index'))),
          meta: { title: "申请通道", requiresAuth: true, needBack: false }
        },
        {
          path: "instruction",
          element: LazyLoad(lazy(() => import(/* webpackChunkName: "instruction" */ '@/pages/Instruction/index'))),
          meta: { title: "优先用血", requiresAuth: true, needBack: true }
        },
        {
          path: "information",
          element: LazyLoad(lazy(() => import(/* webpackChunkName: "information" */ '@/pages/Information/index'))),
          meta: { title: "个人信息", requiresAuth: true, needBack: true }
        },
        {
          path: "submitResult",
          element: LazyLoad(lazy(() => import(/* webpackChunkName: "submitResult" */ '@/pages/SubmitResult/index'))),
          meta: { title: "提交结果", requiresAuth: true, needBack: true }
        }
      ]
    },
    {
      path: "/404",
      element: LazyLoad(lazy(() => import(/* webpackChunkName: "404" */ '@/pages/404/index'))),
      meta: {
        requiresAuth: false,
        title: "404",
        key: "404"
      }
    },
    {
      path: "*",
      element: <Navigate to="/404" />
    }
  ]
  const routes = useRoutes(AllRouters);
  return routes;
}

export default Router;