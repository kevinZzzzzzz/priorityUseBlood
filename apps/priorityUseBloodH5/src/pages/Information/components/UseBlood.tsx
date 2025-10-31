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
import { isCaid, sleep } from "@/utils";
import { PickerComp } from "@/components/PickerComp";

let optionObjT = {
  identityType: [],
  relationType: [],
};
let optionsMapsT = {
  identityType: {},
  relationType: {},
};
function UseBlood(props: any, ref: any) {
  const { useBloodData = {}, handleSetFormData } = props;
  const [useBloodForm] = Form.useForm();
  const initialValues = {
    relationType: "",
    idType: "",
    idNumber: "",
    name: "",
    contact: "",
  };
  const relationTypeRef = Form.useWatch("relationType", useBloodForm);
  const idTypeRef = Form.useWatch("idType", useBloodForm);

  const [getDataByHistory, setGetDataByHistory] = useState(false);
  const [optionObj, setOptionObj] = useState(optionObjT);
  const optionsMapRef = useRef(optionsMapsT);
  const [relationProofFileList, setRelationProofFileList] = useState(
    [] as ImageUploadItem[],
  );
  // 历史记录弹窗
  const [historyVisible, setHistoryVisible] = useState(false);
  const [historyList, setHistoryList] = useState([
    {
      id: 1,
      donateName: "张三",
      useBloodName: "李四",
      contact: "13800000000",
      relationType: "1",
      idType: "1",
      idNumber: "44030419900101001X",
      createTime: "2023-01-01 00:00:00",
    },
  ]);
  
  // 暴露给父组件的属性
  useImperativeHandle(ref, () => ({
    getFormData,
    getFormDataWithoutValidate,
  }));
  // 获取表单数据（校验）
  const getFormData = async () => {
    let isSucc = false
    const value = await useBloodForm.validateFields();
    // (非自动填写亲属档案) 并且 关系非本人，需上传“关系凭证” 
    if ((!getDataByHistory && relationTypeRef != "0") && relationProofFileList.length == 0) {
      Toast.show("请上传关系凭证");
      return null;
    }
    if (value) {
      isSucc = true
    }
    return isSucc ? {
      ...value,
      relationTypeName: relationTypeRef && optionsMapRef.current.relationType[relationTypeRef],
      idTypeName: idTypeRef && optionsMapRef.current.identityType[idTypeRef],
      relationProofFileList,
    } : null
  }
  // 获取表单数据（不校验）
  const getFormDataWithoutValidate = () => {
    const value = useBloodForm.getFieldsValue();
    return {
      ...value,
      relationTypeName: relationTypeRef && optionsMapRef.current.relationType[relationTypeRef],
      idTypeName: idTypeRef && optionsMapRef.current.identityType[idTypeRef],
      relationProofFileList,
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
    useBloodForm.resetFields()
    if (history) {
      useBloodForm.setFieldsValue(history);
      return false
    }
    if (useBloodData) {
      useBloodForm.setFieldsValue(useBloodData);
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
    useBloodForm.setFieldValue(key, value);
  }, []);

  // 打开历史记录弹窗
  const openHistory = () => {
    setHistoryVisible(true);
  };
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
    <div className={styles.useBlood}>
      <div className={styles.useBlood_main}>
        <div className={styles.useBlood_main_title}>用血者信息</div>
        <Form form={useBloodForm} initialValues={initialValues}>
          <Form.Item
            name="relationType"
            label="用血者与献血者的关系"
            rules={[{ required: true, message: "用血者与献血者的关系为空" }]}
          >
            <div className={styles.pickerComp_2line}>
              <PickerComp
                style={{ width: "80%" }}
                options={optionObj.relationType}
                optionMap={optionsMapRef.current.relationType}
                formValue={relationTypeRef}
                keyName="relationType"
                placeholder="请选择用血者与献血者的关系"
                handlePickerSetValue={handlePickerSetValue}
              />
              <div
                className={styles.pickerComp_2line_btn}
                onClick={openHistory}
              >
                <span>历史记录</span>
              </div>
            </div>
          </Form.Item>
          <Form.Item
            name="idType"
            label="用血者证件类型"
            rules={[{ required: true, message: "用血者证件类型为空" }]}
          >
            <PickerComp
              options={optionObj.identityType}
              optionMap={optionsMapRef.current.identityType}
              formValue={idTypeRef}
              keyName="idType"
              placeholder="请选择用血者证件类型"
              handlePickerSetValue={handlePickerSetValue}
            />
          </Form.Item>
          <Form.Item
            name="idNumber"
            label="用血者证件号码"
            validateTrigger={"onBlur"}
            rules={[{ required: true, message: '' }, { validator: validateIdNumber }]}
          >
            <Input
              placeholder="请输入用血者证件号码"
              style={{ "--font-size": "14px" }}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="用血者姓名"
            rules={[{ required: true, message: "用血者姓名为空" }]}
          >
            <Input
              placeholder="请输入用血者姓名"
              style={{ "--font-size": "14px" }}
            />
          </Form.Item>
          <Form.Item
            name="contact"
            label="用血者联系电话"
            rules={[{ required: true, message: "用血者联系电话为空" }]}
          >
            <Input
              placeholder="请输入用血者联系电话"
              style={{ "--font-size": "14px" }}
            />
          </Form.Item>
        </Form>
      </div>
      {/* (选择亲属档案，自动填写) 并且 关系是本人，无需上传“关系凭证” */}
      {(!getDataByHistory && relationTypeRef != "0") ? (
        <div className={styles.donation_main}>
          <div className={styles.donation_main_title}>
            <span>*</span> 亲属关系凭证上传
            <br />
            <small>注: 首次申请时必传</small>
          </div>
          <ImageUploader
            value={relationProofFileList}
            onChange={setRelationProofFileList}
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
      <Popup
        visible={historyVisible}
        onMaskClick={() => {
          setHistoryVisible(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          minHeight: "60vh",
        }}
      >
        <div className={styles.historyPopup}>
          <div className={styles.historyPopup_header}>
            <div className={styles.historyPopup_header_empty}></div>
            <h1>历史记录</h1>
            <Button
              color="primary"
              size="small"
              fill="none"
              onClick={() => {
                setHistoryVisible(false);
              }}
            >
              关闭
            </Button>
          </div>
          <div className={styles.historyPopup_content}>
            {historyList && historyList.length ? (
              <ul className={styles.historyPopup_content_list}>
                {historyList?.map((d: any, idx) => {
                  return (
                    <li key={d.id} className={styles.historyPopup_content_list_item}>
                      <h3>用血者与献血者的关系: {optionsMapRef.current.relationType[d.relationType]}</h3>
                      <p>献血者姓名: {d.donateName}</p>
                      <p>用血者姓名: {d.useBloodName}</p>
                      <p>用血者身份证: {d.idNumber}</p>
                      <p>创建时间: {d.createTime}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <Empty description="暂无数据" />
            )}
          </div>
        </div>
      </Popup>
    </div>
  );
}
export default memo(forwardRef(UseBlood));
