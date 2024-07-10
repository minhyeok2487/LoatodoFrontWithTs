import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import FaqItem from "./components/FaqItem";

const FaqIndex = () => {
  return (
    <DefaultLayout pageTitle="자주 묻는 질문">
      <Wrapper>
        <FaqItem title="부계정도 등록할 수 있나요?">
          부계정을 이메일로(본계정과 다른 방식) 가입한 뒤{" "}
          <strong>부계정을 깐부로 등록</strong> 하고 <strong>체크 권한</strong>
          을 주면 우측 사이드 바로가기로 편하게 사용하실 수 있어요.
          <br />
          현재 별도로 해당 기능을 추가하진 않았지만,(개발 설계가 복잡해요.🤔)
          요청주시는 분들이 많아 추후 기능을 추가해 볼게요!
        </FaqItem>
      </Wrapper>
    </DefaultLayout>
  );
};

export default FaqIndex;

const Wrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
