import { useState } from "react";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import faqList from "@core/constants/faq";

import FaqItem from "./components/FaqItem";

const FaqIndex = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <DefaultLayout pageTitle="자주 묻는 질문">
      <Wrapper>
        {faqList.map((item, index) => {
          return (
            <FaqItem
              key={index}
              id={index}
              title={item.title}
              label={item.label}
              description={item.description}
              setOpenId={setOpenIndex}
              isOpen={openIndex === index}
            />
          );
        })}
      </Wrapper>
    </DefaultLayout>
  );
};

export default FaqIndex;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;
