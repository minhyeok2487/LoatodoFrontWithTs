import styled from "styled-components";

const EmergencyNotice = () => {
  return (
    <Wrapper>
      현재 로스트아크 오픈 API와 로아투두 서버와의 충돌로 인해 &quot;캐릭터
      등록하기&quot;, &quot;캐릭터 정보 업데이트&quot;, &quot;API Key 변경&quot;
      기능이 동작하지 않고 있습니다. <br />
      최대한 빠르게 수정하도록 하겠습니다. 이용에 불편을 드려 대단히 죄송합니다.
    </Wrapper>
  );
};

export default EmergencyNotice;

const Wrapper = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  width: 100%;
  color: ${({ theme }) => theme.app.palette.red[650]};
  background: ${({ theme }) => theme.app.palette.red[50]};
  border: 1px solid ${({ theme }) => theme.app.palette.red[100]};
  border-radius: 5px;
  font-size: 16px;
  text-align: center;
`;
