import styled from "@emotion/styled";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { Character } from "@core/types/character";
import { FriendType } from "@core/types/friend";
import { calculateRaidStatus } from "@core/utils/todo.util";

import Button from "@components/Button";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";

interface Props {
  characters: Character[];
  friend?: FriendType;
}

const MainRaids: FC<Props> = ({ characters, friend }) => {
  const navigate = useNavigate();

  if (characters.length === 0 && !friend) {
    return null;
  }

  const raidStatus = calculateRaidStatus(characters);

  return (
    <BoxWrapper flex={1}>
      <Header>
        <BoxTitle>{friend ? "깐부 현황" : "내 레이드 별 현황"}</BoxTitle>

        <HeaderButtonWrapper>
          {friend ? (
            <>
              <Button
                onClick={() => {
                  // 구현 예정
                }}
              >
                깐부 설정 수정
              </Button>
              <Button onClick={() => navigate(`/friends/${friend.nickName}`)}>
                숙제 바로가기
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                navigate("/todo");
              }}
            >
              숙제 바로가기
            </Button>
          )}
        </HeaderButtonWrapper>
      </Header>

      <Body>
        {raidStatus.map((raid, index) => {
          const backgroundImageUrl = `/raid-images/${raid.name}.jpg`;
          return (
            <RaidItem key={index} backgroundImageUrl={backgroundImageUrl}>
              <Boss>{raid.name}</Boss>
              <Count>
                {raid.count} / {raid.totalCount}
              </Count>
              <CharacterTypes>
                딜 {raid.dealerCount} 폿 {raid.supportCount}
              </CharacterTypes>
            </RaidItem>
          );
        })}
      </Body>
    </BoxWrapper>
  );
};

export default MainRaids;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
`;

const HeaderButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const Body = styled.ul`
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-top: 16px;

  ${({ theme }) => theme.medias.max1280} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  ${({ theme }) => theme.medias.max900} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.medias.max500} {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const RaidItem = styled.li<{ backgroundImageUrl: string }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  color: ${({ theme }) => theme.app.white};
  line-height: 1.2;
  background:
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url(${({ backgroundImageUrl }) => backgroundImageUrl}) no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const Boss = styled.strong`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const Count = styled.span`
  font-size: 20px;
  margin-bottom: 6px;
`;

const CharacterTypes = styled.span`
  font-size: 13px;
`;
