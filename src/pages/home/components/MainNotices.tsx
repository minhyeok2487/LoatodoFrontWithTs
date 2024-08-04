import { useState } from "react";
import styled, { css } from "styled-components";

import type { NoticeType } from "@core/types/notice";

import Button from "@components/Button";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";
import NoticeList from "./NoticeList";

interface ButtonItem {
  value: NoticeType;
  label: string;
}

const buttons: ButtonItem[] = [
  { value: "LOA_TODO", label: "로아투두" },
  { value: "OFFICIAL", label: "로스트아크" },
] as const;

const MainNotices = () => {
  const [noticeType, setNoticeType] = useState<NoticeType>("LOA_TODO");

  return (
    <BoxWrapper $flex={2}>
      <Header>
        <BoxTitle>소식</BoxTitle>
        <Buttons>
          {buttons.map((item) => (
            <Button
              key={item.value}
              css={buttonCss(noticeType === item.value)}
              variant="text"
              onClick={() => setNoticeType(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </Buttons>
      </Header>
      <Body>
        <NoticeList type={noticeType} />
      </Body>
    </BoxWrapper>
  );
};

export default MainNotices;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  ${({ theme }) => theme.medias.max300} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  align-items: center;

  button:not(:first-of-type):before {
    content: "";
    position: absolute;
    left: 0;
    top: 5px;
    width: 1px;
    height: 14px;
    background: ${({ theme }) => theme.app.border};
  }
`;

const buttonCss = (isActive: boolean) => css`
  padding: 5px 10px;
  font-size: 14px;
  line-height: 1;
  font-weight: ${isActive ? 600 : 500};
  color: ${({ theme }) => theme.app.text.main};
`;

const Body = styled.div`
  width: 100%;
  margin-top: 24px;

  ${({ theme }) => theme.medias.max900} {
    margin-top: 16px;
  }
`;
