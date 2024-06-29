import styled from "@emotion/styled";

import DefaultLayout from "@layouts/DefaultLayout";

const GuideIndex = () => {
  return (
    <DefaultLayout pageTitle="로아투두 가이드">
      <Wrapper>
        <img src="/images/guide.png" alt="로아투두 사용법" />
      </Wrapper>
    </DefaultLayout>
  );
};

export default GuideIndex;

const Wrapper = styled.div`
  width: 100%;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  overflow: hidden;

  img {
    width: 100%;
  }
`;
