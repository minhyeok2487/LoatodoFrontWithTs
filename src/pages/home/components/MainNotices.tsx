import styled from "@emotion/styled";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

import type { NoticeType } from "@core/types/notice";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";
import NoticeList from "./NoticeList";

const MainNotices = () => {
  const [noticeType, setNoticeType] = useState<NoticeType>("LoaTodo");

  return (
    <BoxWrapper flex={2} pb={2}>
      <Header>
        <BoxTitle>소식</BoxTitle>
        <ToggleButtonGroup
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
          <Button value="LoaTodo">로아투두</Button>
          <Button value="Lostark">로스트아크</Button>
        </ToggleButtonGroup>
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
  margin-top: 16px;
`;
