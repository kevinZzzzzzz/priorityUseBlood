import { Button } from "antd-mobile";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import agreeSelectIcon from "@/assets/images/agreeSelectIcon.png";
import agreeUnselectIcon from "@/assets/images/agreeUnselectIcon.png";

function Instruction(props: any) {
  const [agree, setAgree] = useState(false);
  const iframeSrc = '/instruction.html'
  const navigate = useNavigate();
  return (
    <div className={styles.instruction}>
      <section className={styles.instruction_content}>
        <header>
          <span>申请须知</span>
        </header>
        <main>
          <iframe src={iframeSrc}></iframe>
        </main>
      </section>
      <div
        className={styles.instruction_agree}
        onClick={() => {
          setAgree((pre) => !pre);
        }}
      >
        <img src={agree ? agreeSelectIcon : agreeUnselectIcon} alt="" />
        <span>我已阅读以上条款并遵守相关规定</span>
      </div>
      <div className={styles.instruction_footer}>
        <Button
          block
          disabled={!agree}
          shape="rounded"
          style={{ "--background-color": "#4BBBA1", "--text-color": "#fff" }}
          size="large"
          onClick={() => {
            navigate("/auth/information");
          }}
        >
          下一步
        </Button>
      </div>
    </div>
  );
}
export default Instruction;
