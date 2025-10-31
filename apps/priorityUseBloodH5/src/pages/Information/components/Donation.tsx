import { getPriorityUseBloodTypeDict } from "@/api/modules/dict";
import {
  Button,
  Form,
  ImageUploader,
  Input,
  Picker,
  Space,
  Toast,
} from "antd-mobile";
import { AddOutline, DownOutline } from "antd-mobile-icons";
import React, { useState, useEffect, memo, useRef, forwardRef } from "react";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import styles from "./index.module.scss";
import { isCaid, sleep } from "@/utils";
import { PickerComp } from "@/components/PickerComp";
interface MobileValue {
  preValue: string | number
  realValue: string
}
let optionObjT = {
  identityType: [],
  donationAreas: [],
};
let optionsMapsT = {
  identityType: {},
  donationAreas: {},
};
function Donation(props: any, ref: any) {
  const { donationData = {}, handleSetFormData } = props;
  const [donationForm] = Form.useForm();
  const initialValues = {
    idType: "",
    idNumber: "",
    name: "",
    localDonation: "",
    contact: "",
  };
  const localDonationRef = Form.useWatch("localDonation", donationForm);
  const idTypeRef = Form.useWatch("idType", donationForm);
  const [optionObj, setOptionObj] = useState(optionObjT);
  const optionsMapRef = useRef(optionsMapsT);
  const [donationProofFileList, setDonationProofFileList] = useState(
    [] as ImageUploadItem[],
  );

  // 暴露给父组件的属性
  useImperativeHandle(ref, () => ({
    getFormData,
    getFormDataWithoutValidate,
  }));
  // 获取表单数据（校验）
  const getFormData = async () => {
    let isSucc = false;
    const value = await donationForm.validateFields();
    // 1: 当选择“外地献血”(0)时，需上传献血凭证
    if (localDonationRef == "0" && !donationProofFileList.length) {
      Toast.show("请上传献血凭证");
      return null;
    }
    // 2: 当选择“本地献血”(1)时，需要查询献血信息
    if (localDonationRef == "1") {
      // if (!value.idType || !value.idNumber || !value.name || !value.contact) {
      //   Toast.show("请填写献血信息");
      //   return null;
      // }
    }
    if (value && (localDonationRef == "1" || (localDonationRef == "0" && donationProofFileList.length))) {
      isSucc = true;
    }
    return isSucc
      ? {
          ...value,
          idTypeName: idTypeRef && optionsMapRef.current.identityType[idTypeRef],
          localDonationName: localDonationRef && optionsMapRef.current.donationAreas[localDonationRef],
          donationProofFileList,
        }
      : null;
  };
  // 获取表单数据（不校验）
  const getFormDataWithoutValidate = () => {
    const value = donationForm.getFieldsValue();
    return {
      ...value,
      idTypeName: idTypeRef && optionsMapRef.current.identityType[idTypeRef],
      localDonationName: localDonationRef && optionsMapRef.current.donationAreas[localDonationRef],
      donationProofFileList,
    };
  };
  // 设置字典数据
  const getDictData = () => {
    const distAndKeyList = [
      ["CardType", "identityType"],
      ["DonationArea", "donationAreas"],
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
    donationForm.resetFields();
    if (history) {
      donationForm.setFieldsValue(history);
      return false;
    }
    if (donationData) {
      donationForm.setFieldsValue(donationData);
    }
  };
  useEffect(() => {
    getDictData();
    handleInitData();
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
    console.log(file, file.size / 1024 / 1024, "file");
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
    donationForm.setFieldValue(key, value);
  }, []);

  // 校验献血者证件号码
  const validateIdNumber = (_: any, value: string) => {
    if (!value) {
      return Promise.reject("献血者证件号码为空");
    }
    if (idTypeRef == 'ID' && !isCaid(value)) {
      return Promise.reject("献血者证件号码格式错误");
    }
    return Promise.resolve();
  }
  return (
    <div className={styles.donation}>
      <div className={styles.donation_main}>
        <div className={styles.donation_main_title}>献血信息</div>
        <Form form={donationForm} initialValues={initialValues}>
          <Form.Item
            name="idType"
            label="献血者证件类型"
            rules={[{ required: true, message: "献血者证件类型为空" }]}
          >
            <PickerComp
              options={optionObj.identityType}
              optionMap={optionsMapRef.current.identityType}
              formValue={idTypeRef}
              keyName="idType"
              placeholder="请选择献血者证件类型"
              handlePickerSetValue={handlePickerSetValue}
            />
          </Form.Item>
          <Form.Item
            name="idNumber"
            label="献血者证件号码"
            validateTrigger={"onBlur"}
            rules={[{ required: true, message: '' }, { validator: validateIdNumber }]}
          >
            <Input
              placeholder="请输入献血者证件号码"
              style={{ "--font-size": "14px" }}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="献血者姓名"
            rules={[{ required: true, message: "献血者姓名为空" }]}
          >
            <Input
              placeholder="请输入献血者姓名"
              style={{ "--font-size": "14px" }}
            />
          </Form.Item>
          <Form.Item
            name="localDonation"
            label="献血区域"
            rules={[{ required: true, message: "献血区域为空" }]}
          >
            <PickerComp
              options={optionObj?.donationAreas}
              optionMap={optionsMapRef.current?.donationAreas}
              formValue={localDonationRef}
              keyName="localDonation"
              placeholder="请选择献血区域"
              handlePickerSetValue={handlePickerSetValue}
            />
          </Form.Item>
          <Form.Item
            name="contact"
            label="献血者联系电话"
            rules={[{ required: true, message: "献血者联系电话为空" }]}
          >
            <Input
              placeholder="请输入献血者联系电话"
              style={{ "--font-size": "14px" }}
            />
          </Form.Item>
        </Form>
      </div>
      {localDonationRef == "0" ? (
        <div className={styles.donation_main}>
          <div className={styles.donation_main_title}>
            <span>*</span> 献血凭证上传
            <br />
            <small>注: 外地献血必传</small>
          </div>
          <ImageUploader
            value={donationProofFileList}
            onChange={setDonationProofFileList}
            upload={mockUpload}
            beforeUpload={beforeUpload}
            children={
              <div className="updateComp">
                <AddOutline color="#929292FF" fontSize={24} />
              </div>
            }
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
export default memo(forwardRef(Donation));
