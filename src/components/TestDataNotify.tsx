import styled from "@emotion/styled";

import { useMember } from "@core/apis/Member.api";

const TestDataNotify = () => {
  const { data: member } = useMember();
  if (member?.memberId !== 365 || member.username !== null) {
    return null;
  }
  return <Wrapper>비 로그인 상태, 테스트 데이터 입니다.</Wrapper>;
};

export default TestDataNotify;

const Wrapper = styled.div`
  margin-bottom: 12px;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  width: 100%;
  background: ${({ theme }) => theme.app.simiBlack2};
  color: ${({ theme }) => theme.app.white};
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
  border-radius: 8px;
`;
