import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import step1 from '@/assets/images/step1.png';
import step2 from '@/assets/images/step2.png';
import step3 from '@/assets/images/step3.png';
import step4 from '@/assets/images/step4.png';
import step5 from '@/assets/images/step5.png';


const stepList = [
  {
    title: '1.填写献血者信息',
    image: step1,
  },
  {
    title: '2.填写用血者信息',
    image: step2,
  },
  {
    title: '3.填写用血者住院信息',
    image: step3,
  },
  {
    title: '4.提交申请',
    image: step4,
  },
  {
    title: '5.审核与通知',
    image: step5,
  },
]

function Workspace(props: any) {
  const navigate = useNavigate();
  return (
    <div className={styles.workspace}>
      <div className={styles.workspace_title}></div>
      <div className={styles.workspace_content}>
        <h1>申请流程</h1>
        <ul className={styles.workspace_content_list}>
          {stepList.map((item, index) => (
            <li key={index} className={styles.workspace_content_list_item}>
              <img src={item.image} alt={item.title} />
              <p className={styles.workspace_content_list_item_title}>{item.title}</p>
            </li>
          ))}
        </ul>
        <p className={styles.workspace_content_footer}>
        如遇特殊情况或其他相关疑问，请拨打客服热线：858-XXXX-9956进行咨询
        </p>
      </div>
      <div className={styles.workspace_footer}>
        <ul className={styles.workspace_footer_btn}>
          <li className={styles.workspace_footer_btn_left}>
            <small>我的申请</small>
          </li>
          <li className={styles.workspace_footer_btn_right} onClick={() => {
            navigate('/auth/instruction');
          }}>
            <small>开始申请</small>
          </li>
        </ul>
      </div>
    </div>
  )
}
export default Workspace