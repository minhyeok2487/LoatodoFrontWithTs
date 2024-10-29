import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import PostItem from "./components/PostItem";

const SNS = () => {
  return (
    <DefaultLayout>
      <Wrapper>
        <PostItem />
      </Wrapper>
    </DefaultLayout>
  );
};

export default SNS;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
`;
