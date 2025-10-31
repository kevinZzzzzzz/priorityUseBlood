import React, { useState, useEffect, memo, useMemo } from 'react';
import styles from './index.module.scss'
import iconTransBox from "@/assets/iconTransBox.png";

function ConfirmStartComp(props: any) {
  const { handoverData, title } = props;
  const boxList = useMemo(() => {
    let arr = []
    handoverData.forEach((item: any) => {
      arr.push(...item.boxNoList)
    })
    return arr
  }, [handoverData])
  return (
    <div className={styles.confirmStart}>
      <p>{title}</p>
      <div className={styles.confirmStart_boxList}>
        {
          boxList.map((item: string) => {
            return (
              <div key={item} className={styles.confirmStart_boxList_item}>
                <img width={24} height={24} src={iconTransBox} />
                <p>{item || '--'}</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
export default memo(ConfirmStartComp)