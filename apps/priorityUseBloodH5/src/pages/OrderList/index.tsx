import { Tabs } from 'antd-mobile';
import React, { useState, useEffect } from 'react';
import styles from './index.module.scss'


function OrderPage(props: any) {
  const [activeKey, setActiveKey] = useState('pending');
    
  return (
    <div className={styles.orderList}>
      <div className={styles.orderList_tabs}>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          style={{
            '--title-font-size': '13px',
          }}>
          <Tabs.Tab title='待审核' key='pending'>
          </Tabs.Tab>
          <Tabs.Tab title='已通过' key='passed'>
          </Tabs.Tab>
          <Tabs.Tab title='已驳回' key='rejected'>
          </Tabs.Tab>
          <Tabs.Tab title='已取消' key='cancelled'>
          </Tabs.Tab>
        </Tabs>
      </div>
      <div className={styles.orderList_content}>
        {activeKey}
      </div>
    </div>
  )
}
export default OrderPage