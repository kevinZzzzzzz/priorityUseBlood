import React, { useState, useEffect } from 'react';
import styles from './index.module.scss'
import succResult from '@/assets/images/succResult.png'
import { Button } from 'antd-mobile';

function SubmitResult(props: any) {
  useEffect(() => {
    document.title = "提交成功";
  }, []);
    
  return (
    <div className={styles.submitResult}>
      <div className={styles.submitResult_main}>
        <img src={succResult} alt="" />
        <h1 className={styles.submitResult_main_title}>提交成功</h1>
        <p className={styles.submitResult_main_desc}>您的申请将在2个工作日内完成审核</p>
        <p className={styles.submitResult_main_result}>结果查询：审核结果将通过短信或微信服务小程序发送，请及时查收</p>
        <p className={styles.submitResult_main_tips}>如遇特殊情况或其他相关疑问，请拨打客服热线：858-XXXX-9956进行咨询</p>
        <Button block shape='rounded' size='large' color='primary'>
          查询申请记录
        </Button>
        <Button color='primary' style={{marginTop: 16}} fill='none'>
          退出
        </Button>
      </div>
      <div className={styles.submitResult_bottom}>本系统权益规则根据《献血法》及地方条例动态调整</div>
    </div>
  )
}
export default SubmitResult