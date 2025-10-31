import { Picker } from "antd-mobile";
import { DownOutline } from "antd-mobile-icons";
import React, { useState, useEffect, memo, useRef, FC } from "react";
import styles from "./index.module.scss";
let timer: any = null;
export const PickerComp = memo((props: any) => {
  const {
    options = [],
    optionMap = {},
    formValue = "",
    keyName = "",
    handlePickerSetValue,
    placeholder = "请选择",
  } = props;
  const [visible, setVisible] = useState(false);
  const [pickerValue, setPickerValue] = useState(formValue);
  const [pickerValueLabel, setPickerValueLabel] = useState("");
  // 处理选择器值改变
  const onPreValueChange = (val: any) => {
    setPickerValue(val[0]);
    setPickerValueLabel(optionMap?.[val[0]] || "");
    handlePickerSetValue(keyName, val[0]);
  };

  useEffect(() => {
    timer = setTimeout(() => {
      setPickerValueLabel(optionMap?.[formValue] || "");
    }, 500);
    return () => {
      clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <div className={styles.pickerComp} onClick={() => setVisible(true)}>
        <p className={styles.pickerComp_value}>
          {pickerValueLabel || (
            <span className={styles.pickerComp_placeholder}>{placeholder}</span>
          )}
        </p>
        <DownOutline />
      </div>
      <Picker
        columns={[options]}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        value={[pickerValue]}
        onConfirm={onPreValueChange}
      />
    </>
  );
});