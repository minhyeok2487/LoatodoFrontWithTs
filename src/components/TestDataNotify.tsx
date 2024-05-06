import { toast } from "react-toastify";
import { useMember } from "../core/apis/Member.api";
import { useEffect } from "react";

const TestDataNotify = () => {
  const { data: member } = useMember();

  const notify = () => toast("비로그인 상태, 테스트 데이터 입니다.");
  useEffect(() => {
    if (member?.memberId === 365 || member?.username === null) {
      notify();
    }
  }, [member]);
  if (member?.memberId !== 365 || member.username !== null) {
    return null;
  }
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          background: "#666",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          maxWidth: "1280px",
          borderRadius: "3px",
          marginBottom: "5px",
        }}
      >
        비 로그인 상태, 테스트 데이터 입니다.
      </div>
    </>
  );
};

export default TestDataNotify;
