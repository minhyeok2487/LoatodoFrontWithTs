import styled from "@emotion/styled";

import DefaultLayout from "@layouts/DefaultLayout";

const GuideIndex = () => {
  return (
    <DefaultLayout>
      <Wrapper>
        <img src="/images/guide.jpg" alt="" />
      </Wrapper>
    </DefaultLayout>
  );
};

export default GuideIndex;

const Wrapper = styled.div`
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  overflow: hidden;

  img {
    width: 100%;
  }
`;
