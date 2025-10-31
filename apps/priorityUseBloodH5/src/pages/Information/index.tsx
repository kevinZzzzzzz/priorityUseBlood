import { multiClassName } from "@/utils";
import { Button, Dialog, ImageViewer } from "antd-mobile";
import { CheckOutline } from "antd-mobile-icons";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./index.module.scss";
import Donation from "./components/Donation";
import UseBlood from "./components/UseBlood";
import Hospitalize from "./components/Hospitalize";

const stepList = [
  {
    title: "献血者信息",
    step: 1,
  },
  {
    title: "用血者信息",
    step: 2,
  },
  {
    title: "住院信息",
    step: 3,
  },
];

function Information(props: any) {
  const [curStep, setCurStep] = useState(1);
  const navigate = useNavigate();
  const donationRef = useRef(null);
  const useBloodRef = useRef(null);
  const hospitalizeRef = useRef(null);
  const [formData, setFormData] = useState({
    donation: {
      idType: "",
      idNumber: "",
      name: "",
      localDonation: "",
      contact: "",
      donationProofFileList: [],
    },
    useBlood: {
      relationType: "",
      idType: "",
      idNumber: "",
      name: "",
      contact: "",
      relationProofFileList: [],
    },
    hospitalize: {
      relationType: "",
      patientId: "",
      hospitalArea: "",
      bedNo: "",
      medicalNote: "",
    },
  });
  // 确认弹窗显示控制
  const [confirmVisible, setConfirmVisible] = useState(false);

  const compMap = {
    1: () => (
      <Donation
        ref={donationRef}
        donationData={formData.donation}
        handleSetFormData={handleSetFormData}
      />
    ),
    2: () => (
      <UseBlood
        ref={useBloodRef}
        useBloodData={formData.useBlood}
        handleSetFormData={handleSetFormData}
      />
    ),
    3: () => (
      <Hospitalize
        ref={hospitalizeRef}
        hospitalizeData={formData.hospitalize}
        handleSetFormData={handleSetFormData}
      />
    ),
  };
  // 处理表单数据改变
  const handleSetFormData = (formKey, data) => {
    const formDataT = JSON.parse(JSON.stringify(formData));
    formDataT[formKey] = {
      ...formDataT[formKey],
      ...data,
    };
    setFormData(formDataT);
  };
  const Comp = useMemo(() => {
    return compMap[curStep];
  }, [curStep]);

  /**
   * 切换步骤
   * @param type 切换类型
   */
  const handleChangeStep = async (type: "next" | "prev") => {
    const curStepT = curStep;
    if (type === "next") {
      switch (curStepT) {
        case 1:
          const donationRes = await donationRef.current.getFormData();
          if (donationRes) {
            handleSetFormData("donation", donationRes);
            setCurStep((prev) => prev + 1);
          }
          break;
        case 2:
          const useBloodRes = await useBloodRef.current.getFormData();
          if (useBloodRes) {
            handleSetFormData("useBlood", useBloodRes);
            setCurStep((prev) => prev + 1);
          }
          break;
        case 3:
          const hospitalizeRes = await hospitalizeRef.current.getFormData();
          if (hospitalizeRes) {
            handleSetFormData("hospitalize", hospitalizeRes);
            setConfirmVisible(true);
          }
          break;
        default:
          break;
      }
    } else {
      switch (curStepT) {
        case 2:
          const useBloodRes = useBloodRef.current.getFormDataWithoutValidate();
          if (useBloodRes) {
            handleSetFormData("useBlood", useBloodRes);
          }
          break;
        case 3:
          const hospitalizeRes =
            hospitalizeRef.current.getFormDataWithoutValidate();
          if (hospitalizeRes) {
            handleSetFormData("hospitalize", hospitalizeRes);
          }
          break;
        default:
          break;
      }
      setCurStep((prev) => prev - 1);
    }
  };
  // 提交表单
  function handleSubmit() {
    setConfirmVisible(false);
  }
  return (
    <div className={styles.information}>
      <div className={styles.information_step}>
        <ul>
          {stepList.map((item) => (
            <li
              key={item.step}
              className={multiClassName([
                styles["information_step_item"],
                curStep == item.step
                  ? styles["information_step_item-active"]
                  : curStep > item.step
                    ? styles["information_step_item-finish"]
                    : null,
              ])}
            >
              <div
                className={multiClassName([
                  styles["information_step_item_dot"],
                  curStep == item.step
                    ? styles["information_step_item_dot-active"]
                    : curStep > item.step
                      ? styles["information_step_item_dot-finish"]
                      : null,
                ])}
              >
                <span>
                  {curStep > item.step ? <CheckOutline /> : item.step}
                </span>
              </div>
              <p>{item.title}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.information_content}>
        <Comp />
        <div className={styles.information_content_footer}>
          <p>
            如遇特殊情况或其他相关疑问，请拨打客服热线：858-XXXX-9956进行咨询
          </p>
        </div>
      </div>
      <div className={styles.information_footer}>
        <ul className={styles.information_footer_btn}>
          <li className={styles.information_footer_btn_left}>
            <Button
              block
              disabled={curStep <= 1}
              shape="rounded"
              style={{ "--background-color": "#fff" }}
              size="middle"
              onClick={() => {
                handleChangeStep("prev");
                // setCurStep((prev) => prev - 1);
              }}
            >
              上一步
            </Button>
          </li>
          <li className={styles.information_footer_btn_right}>
            <Button
              block
              shape="rounded"
              style={{
                "--background-color": "#4BBBA1",
                "--text-color": "#fff",
              }}
              size="middle"
              onClick={() => {
                handleChangeStep("next");
                // setCurStep((prev) => prev + 1);
              }}
            >
              下一步
            </Button>
          </li>
        </ul>
      </div>
      <Dialog
        visible={confirmVisible}
        title={"请确认以下信息是否有误?"}
        destroyOnClose={true}
        closeOnMaskClick={true}
        actions={[
          [
            {
              key: "cancel",
              text: "取消",
              style: {
                fontSize: 16,
                color: "#323233",
              },
              onClick: () => {
                setConfirmVisible(false);
              },
            },
            {
              key: "confirm",
              text: "提交",
              style: {
                fontSize: 16,
              },
              onClick: () => {
                handleSubmit()
              },
            },
          ],
        ]}
        content={
          <div className={styles.confirmDialog}>
            <div className={styles.confirmDialog_ctx}>
              <div className={styles.confirmDialog_ctx_header}>
                <h1>献血者信息</h1>
                <p
                  onClick={() => {
                    setConfirmVisible(false);
                    setCurStep(1);
                  }}
                >
                  编辑
                </p>
              </div>
              <DonationComp {...formData.donation} />
            </div>
            <div className={styles.confirmDialog_ctx}>
              <div className={styles.confirmDialog_ctx_header}>
                <h1>用血者信息</h1>
                <p
                  onClick={() => {
                    setConfirmVisible(false);
                    setCurStep(2);
                  }}
                >
                  编辑
                </p>
              </div>
              <UseBloodComp {...formData.useBlood} />
            </div>
            <div className={styles.confirmDialog_ctx}>
              <div className={styles.confirmDialog_ctx_header}>
                <h1>住院信息</h1>
                <p
                  onClick={() => {
                    setConfirmVisible(false);
                    setCurStep(3);
                  }}
                >
                  编辑
                </p>
              </div>
              <HospitalizeComp {...formData.hospitalize} />
            </div>
          </div>
        }
        onClose={() => {
          setConfirmVisible(false);
        }}
      />
    </div>
  );
}
export default Information;

const DonationComp = (props: any) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div className={styles.infoCtx}>
        <div className={styles.infoCtx_item}>
          <div className={styles.infoCtx_item_label}>姓名:</div>
          <p>{props.name || ""}</p>
        </div>
        <div className={styles.infoCtx_item}>
          <div className={styles.infoCtx_item_label}>证件类型:</div>
          <p>{props.idTypeName || ""}</p>
        </div>
        <div className={styles.infoCtx_item}>
          <div className={styles.infoCtx_item_label}>证件号码:</div>
          <p>{props.idNumber || ""}</p>
        </div>
        <div className={styles.infoCtx_item}>
          <div className={styles.infoCtx_item_label}>联系方式:</div>
          <p>{props.contact || ""}</p>
        </div>
        <div className={styles.infoCtx_item}>
          <div className={styles.infoCtx_item_label}>献血地:</div>
          <p>{props.localDonationName || ""}</p>
        </div>
        <div className={styles.infoCtx_item}>
          <div className={styles.infoCtx_item_label}>献血凭证:</div>
          <p>
            {props.donationProofFileList && props.donationProofFileList.length
              ? "已上传"
              : ""}
          </p>
          {props.donationProofFileList && props.donationProofFileList.length ? (
            <Button color="primary" fill="outline" size="mini" onClick={() => {
              setVisible(true)
            }}>
              查看
            </Button>
          ) : null}
        </div>
      </div>
      <ImageViewer.Multi
        getContainer={() => document.body}
        images={props.donationProofFileList?.map((item: any) => item.url)}
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
      />
    </>
  );
};
const UseBloodComp = (props: any) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div className={styles.infoCtx}>
        <div className={styles.infoCtx_item}>
          <div className={multiClassName([
            styles.infoCtx_item_label,
            styles["infoCtx_item_label-long"],
          ])}>与献血者关系:</div>
          <p>{props.relationTypeName || ""}</p>
        </div>
        <div className={styles.infoCtx_item}>
          <div className={styles.infoCtx_item_label}>姓名:</div>
          <p>{props.name || ""}</p>
        </div>
        <div className={styles.infoCtx_item}>
          <div className={styles.infoCtx_item_label}>证件类型:</div>
          <p>{props.idTypeName || ""}</p>
        </div>
        <div className={styles.infoCtx_item}>
          <div className={styles.infoCtx_item_label}>证件号码:</div>
          <p>{props.idNumber || ""}</p>
        </div>
        <div className={styles.infoCtx_item}>
          <div className={styles.infoCtx_item_label}>关系凭证:</div>
          <p>
            {props.relationProofFileList && props.relationProofFileList.length
              ? "已上传"
              : ""}
          </p>
          {props.relationProofFileList && props.relationProofFileList.length ? (
            <Button color="primary" fill="outline" size="mini" onClick={() => {
              setVisible(true)
            }}>
              查看
            </Button>
          ) : null}
        </div>
      </div>
      <ImageViewer.Multi
        getContainer={() => document.body}
        images={props.relationProofFileList?.map((item: any) => item.url)}
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
      />
    </>
  );
};
const HospitalizeComp = (props: any) => {
  return (
    <div className={styles.infoCtx}>
      <div className={styles.infoCtx_item}>
        <div className={styles.infoCtx_item_label}>用血医院:</div>
        <p>{props.hospitalizeName || ""}</p>
      </div>
      <div className={styles.infoCtx_item}>
        <div className={styles.infoCtx_item_label}>住院号:</div>
        <p>{props.patientId || ""}</p>
      </div>
      <div className={styles.infoCtx_item}>
        <div className={styles.infoCtx_item_label}>病区:</div>
        <p>{props.hospitalArea || ""}</p>
      </div>
      <div className={styles.infoCtx_item}>
        <div className={styles.infoCtx_item_label}>床号:</div>
        <p>{props.bedNo || ""}</p>
      </div>
      <div className={styles.infoCtx_item}>
        <div
          className={multiClassName([
            styles.infoCtx_item_label,
            styles["infoCtx_item_label-long"],
          ])}
        >
          病情简要说明:
        </div>
        <p>{props.medicalNote || ""}</p>
      </div>
    </div>
  );
};

