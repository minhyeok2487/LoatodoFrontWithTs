import { useAtomValue } from "jotai";
import styled from "styled-components";

import { authAtom } from "@core/atoms/auth.atom";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";

const TestDataNotify = () => {
  const auth = useAtomValue(authAtom);
  const getMyInformation = useMyInformation();

  if (getMyInformation.data?.memberId !== 365 || auth.username) {
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
  background: ${({ theme }) => theme.app.palette.gray[550]};
  color: ${({ theme }) => theme.app.palette.gray[0]};
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
  border-radius: 8px;
`;
