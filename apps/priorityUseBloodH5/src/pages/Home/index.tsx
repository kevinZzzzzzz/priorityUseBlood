import React, { useState, useEffect } from 'react';
import styles from './index.module.scss'
import { useNavigate } from "react-router-dom";
let timer = null

function Home(props: any) {
  const navigate = useNavigate();
  useEffect(() => {
    timer = setTimeout(() => {
      navigate("/auth/workspace");
    }, 3000);
    return () => {
      clearTimeout(timer);
    }
  }, []);
    
  return (
    <div className={styles.home}>
      <div className={styles.home_logo}></div>
      <div className={styles.home_title}>生命守护-优先用血</div>
    </div>
  )
}
export default Home;
