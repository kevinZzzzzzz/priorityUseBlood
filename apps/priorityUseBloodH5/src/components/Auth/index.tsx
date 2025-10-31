import React, { useState, useEffect, useMemo } from "react";
import styles from "./index.module.scss";
import { Outlet, useLocation, useNavigate, useOutlet } from "react-router-dom";
import { LeftOutline } from "antd-mobile-icons";
import { SafeArea, Toast } from "antd-mobile";
import { RootState, useSelector } from "@/store";
import { isMobile, isWechatWebview } from "@/utils/broswer";
import { multiClassName } from "@/utils";

function Auth() {
  const outlet = useOutlet(); // 获取当前匹配的子路由元素
  const navigate = useNavigate();
  // const { token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log('Auth', isWechatWebview());
  //   if (!token) {
  //     Toast.show({
  //       content: "请先登录",
  //     });
  //     navigate("/login", {
  //       replace: true,
  //     });
  //   }
  }, []);
  const isMob = isMobile();
  const routerInfo = useMemo(() => {
    const meta = outlet?.props?.children?.props.match?.route?.meta;
    if (meta?.title) {
      document.title = meta.title;
    }
    return meta;
  }, [outlet]);
  return (
    <>
    {/* {
      !isMob ? (
        <div className={styles.navbar}>
          {routerInfo.needBack ? (
            <div className={styles.navbar_back} onClick={() => navigate(-1)}>
              <LeftOutline />
            </div>
          ) : (
            <span></span>
          )}
          <p className={styles.navbar_title}>
            {routerInfo.title}
          </p>
          <span></span>
        </div>) : null
    } */}
      <div className={multiClassName([styles.content, isMob  ? styles['content-wx'] : null])}>
        <Outlet></Outlet>
        <SafeArea position='bottom' />
      </div>
    </>
  );
}
export default Auth;
