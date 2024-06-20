import styled from "@emotion/styled";

const Notice = styled.div`
  background-color: #f8d7da; /* 배경색 */
  color: #721c24; /* 글자색 */
  border: 1px solid #f5c6cb; /* 테두리 색 */
  padding: 20px; /* 패딩 */
  border-radius: 5px; /* 모서리 둥글게 */
  font-family: "Arial", sans-serif; /* 글꼴 */
  font-size: 16px; /* 글자 크기 */
  text-align: center; /* 텍스트 가운데 정렬 */
  width: 50%;
`;

const MaintenanceNotice = () => {
  return (
    <Notice>6월22일(토) 새벽3시 ~ 6시 서버 점검이 있을 예정입니다.</Notice>
  );
};

export default MaintenanceNotice;
