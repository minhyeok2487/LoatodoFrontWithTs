import { useMember } from "@core/apis/Member.api";

const TestDataNotify = () => {
  const { data: member } = useMember();
  if (member?.memberId !== 365 || member.username !== null) {
    return null;
  }
  return (
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
        borderRadius: "8px",
        marginBottom: "12px",
        padding: "10px 0",
      }}
    >
      비 로그인 상태, 테스트 데이터 입니다.
    </div>
  );
};

export default TestDataNotify;
