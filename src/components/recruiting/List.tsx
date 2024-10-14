import styled, { css } from "styled-components";

import { RECRUITING_CATEGORY } from "@core/constants/recruiting";
import { useRecruitingIndex } from "@core/hooks/queries/recruiting";
import type { RecruitingCategory } from "@core/types/recruiting";

import IconFriend from "@assets/images/recruiting_friend.svg";
import IconGuild from "@assets/images/recruiting_guild.svg";
import IconParty from "@assets/images/recruiting_party.svg";
import IconTeach from "@assets/images/recruiting_teach.svg";

interface Props {
  category: RecruitingCategory;
}

const List = ({ category }: Props) => {
  const getRecruitings = useRecruitingIndex();

  return (
    <Wrapper>
      <Header $category={category}>{RECRUITING_CATEGORY[category]}</Header>
    </Wrapper>
  );
};

export default List;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
`;

const Header = styled.a<{ $category: RecruitingCategory }>`
  display: block;
  position: relative;
  padding: 16px 24px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 8px;
  color: ${({ theme }) => theme.app.palette.gray[800]};
  background: ${({ theme, $category }) => {
    if ($category === "FRIENDS") {
      return theme.app.palette.smokeGreen[0];
    }

    if ($category.includes("PARTY")) {
      return theme.app.palette.red[0];
    }

    if ($category.includes("GUILD")) {
      return theme.app.palette.blue[0];
    }

    return theme.app.palette.orange[0];
  }};

  &:after {
    content: "";
    position: absolute;
    right: 0;
    width: 100px;
    height: 100px;

    ${({ $category }) => {
      if ($category === "FRIENDS") {
        return css`
          top: -38px;
          background: url(${IconFriend}) center / 100%;
        `;
      }

      if ($category.includes("PARTY")) {
        return css`
          top: -27px;
          background: url(${IconGuild}) center / 100%;
        `;
      }

      if ($category.includes("GUILD")) {
        return css`
          top: -45px;
          background: url(${IconParty}) center / 100%;
        `;
      }

      return css`
        top: -33px;
        right: 8px;
        width: 90px;
        height: 90px;
        background: url(${IconTeach}) center / 100%;
      `;
    }}
  }
`;
