import { getPriorityUseBloodTypeDict } from "@/api/modules/dict";
import {
  Button,
  Empty,
  Form,
  Grid,
  ImageUploader,
  Input,
  Picker,
  Popup,
  Space,
  Toast,
} from "antd-mobile";
import { AddOutline, DownOutline } from "antd-mobile-icons";
import React, { useState, useEffect, memo, useRef, FC } from "react";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import styles from "./index.module.scss";
import { sleep } from "@/utils";
import { PickerComp } from "@/components/PickerComp";

let optionObjT = {
  identityType: [],
  relationType: [],
};
let optionsMapsT = {
  identityType: {},
  relationType: {},
};
function Hospitalize(props: any, ref: any) {
  const { hospitalizeData = {}, handleSetFormData } = props;
  const [hospitalizeForm] = Form.useForm();
  const initialValues = {
    relationType: "",
    patientId: "",
    hospitalArea: "",
    bedNo: "",
    medicalNote: "",
  };

  const relationTypeRef = Form.useWatch("relationType", hospitalizeForm);
  const [selectedHistory, setSelectedHistory] = useState<any>(false);
  const [optionObj, setOptionObj] = useState(optionObjT);
  const optionsMapRef = useRef(optionsMapsT);
  const [relationProofFileList, setRelationProofFileList] = useState(
    [] as ImageUploadItem[],
  );
  

  // 暴露给父组件的属性
  useImperativeHandle(ref, () => ({
    getFormData,
    getFormDataWithoutValidate,
  }));
  // 获取表单数据（校验）
  const getFormData = async () => {
    let isSucc = false
    const value = await hospitalizeForm.validateFields();
    if (value) {
      isSucc = true
    }
    return isSucc ? {
      ...value,
      relationTypeName: relationTypeRef && optionsMapRef.current.relationType[relationTypeRef],
    } : null
  }
  // 获取表单数据（不校验）
  const getFormDataWithoutValidate = () => {
    const value = hospitalizeForm.getFieldsValue();
    return {
      ...value,
      relationTypeName: relationTypeRef && optionsMapRef.current.relationType[relationTypeRef],
    };
  }
  // 设置字典数据
  const getDictData = () => {
    const distAndKeyList = [
      ["CardType", "identityType"],
      ["RelationType", "relationType"],
    ];
    distAndKeyList.forEach(([dist, key]) => {
      getPriorityUseBloodTypeDict(dist).then((res: any) => {
        const { data = [] } = res || {};
        if (data[0] && data[0].enumObjList) {
          optionObjT[key] = data[0].enumObjList.map((d) => {
            optionsMapsT[key][d.key] = d.show;
            return {
              label: d.show,
              value: d.key,
            };
          });
          setOptionObj({ ...optionObjT });
          optionsMapRef.current = { ...optionsMapsT };
        }
      });
    });
  };
  // 处理初始化数据及历史数据
  const handleInitData = (history?: any) => {
    hospitalizeForm.resetFields()
    if (history) {
      hospitalizeForm.setFieldsValue(history);
    }
    if (hospitalizeData) {
      hospitalizeForm.setFieldsValue(hospitalizeData);
    }
  };
  useEffect(() => {
    getDictData();
    handleInitData()
  }, []);
  // 上传图片前校验
  function beforeUpload(file: File) {
    // 限制必须是图片
    if (
      !["image/jpeg", "image/png", "image/gif", "image/bmp"].includes(file.type)
    ) {
      Toast.show("只能上传图片文件！");
      return null;
    }
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      Toast.show("请选择小于 20M 的图片");
      return null;
    }
    return file;
  }

  // 上传图片
  async function mockUpload(file: File) {
    await sleep(3000);
    return {
      url: URL.createObjectURL(file),
    };
  }

  // 处理选择器值改变
  const handlePickerSetValue = useCallback((key: string, value: string) => {
    hospitalizeForm.setFieldValue(key, value);
  }, []);

  return (
    <div className={styles.hospitalize}>
      <div className={styles.hospitalize_main}>
        <div className={styles.hospitalize_main_title}>住院信息</div>
        <Form form={hospitalizeForm} initialValues={initialValues}>
          <Form.Item
            name="relationType"
            label="用血医院"
            rules={[{ required: true, message: "用血医院为空" }]}
          >
            <PickerComp
              style={{ width: "80%" }}
              options={optionObj.relationType}
              optionMap={optionsMapRef.current.relationType}
              formValue={relationTypeRef}
              keyName="relationType"
              placeholder="请选择用血者与献血者的关系"
              handlePickerSetValue={handlePickerSetValue}
            />
          </Form.Item>
          <Form.Item
            name="patientId"
            label="住院号/就诊号"
            rules={[{ required: true, message: "住院号为空" }]}
          >
            <Input
              placeholder="请输入住院号"
              style={{ "--font-size": "14px" }}
            />
          </Form.Item>
          <Form.Item
            name="hospitalArea"
            label="病区"
          >
            <Input
              placeholder="请输入病区"
              style={{ "--font-size": "14px" }}
            />
          </Form.Item>
          <Form.Item
            name="bedNo"
            label="床号"
          >
            <Input
              placeholder="请输入床号"
              style={{ "--font-size": "14px" }}
            />
          </Form.Item>
          <Form.Item
            name="medicalNote"
            label="病情简要说明"
          >
            <Input
              placeholder="请输入病情说明"
              style={{ "--font-size": "14px" }}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
export default memo(forwardRef(Hospitalize));
