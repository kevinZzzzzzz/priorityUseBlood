import React, { Suspense } from "react";
import { Space, SpinLoading } from "antd-mobile";

/**
 * @description 加载中组件
 * @returns element
 */
export const Loading = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Space direction="horizontal" wrap block style={{ "--gap": "16px" }}>
        <SpinLoading color="primary" style={{ "--size": "100px" }} />
      </Space>
    </div>
  );
}

/**
 * @description 路由懒加载
 * @param {Element} Comp 需要访问的组件
 * @returns element
 */
const LazyLoad = (Comp: React.LazyExoticComponent<any>): React.ReactNode => {
  return (
    <Suspense
      fallback={
        <Loading />
      }
    >
      <Comp />
    </Suspense>
  );
};
export default LazyLoad;
