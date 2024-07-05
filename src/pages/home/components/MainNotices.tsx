import styled from "@emotion/styled";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

import type { NoticeType } from "@core/types/notice";

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
    <BoxWrapper flex={2}>
      <Header>
        <BoxTitle>소식</BoxTitle>
        <Buttons
          value={noticeType}
          exclusive
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: NoticeType
          ) => {
            if (newValue !== null) {
              setNoticeType(newValue);
            }
          }}
        >
          {buttons.map((item) => (
            <Button key={item.value} value={item.value}>
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

const Buttons = styled(ToggleButtonGroup)``;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  ${({ theme }) => theme.medias.max300} {
    flex-direction: column;
    align-items: flex-start;

    ${Buttons} {
      align-self: center;
    }
  }
`;

const Button = styled(ToggleButton)`
  && {
    margin: 0;
    position: relative;
    border: none;
    padding: 5px 10px;
    color: ${({ theme }) => theme.app.text.main};
    font-size: 15px;
    line-height: 1;

    &:hover {
      background: transparent;
    }

    &.Mui-selected {
      background: transparent;
      font-weight: 600;
    }

    & + &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 5px;
      width: 1px;
      height: 14px;
      background: ${({ theme }) => theme.app.border};
    }
  }
`;

const Body = styled.div`
  width: 100%;
  margin-top: 24px;

  ${({ theme }) => theme.medias.max900} {
    margin-top: 16px;
  }
`;
