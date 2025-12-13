import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import { calculateRaidStatus } from "@core/utils";

import Button from "@components/Button";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";

interface Props {
  characters: Character[];
  friend?: Friend;
}

const MainRaids: FC<Props> = ({ characters, friend }) => {
  const navigate = useNavigate();

  if (characters.length === 0 && !friend) {
    return null;
  }

  const raidStatus = calculateRaidStatus(characters);

  return (
    <BoxWrapper $flex={1}>
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
              variant="outlined"
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
          const backgroundImageUrl = `/raid-images/${raid.name.replace(/\s/g, "")}.jpg`;
          return (
            <RaidItem key={index} $backgroundImageUrl={backgroundImageUrl}>
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

  ${({ theme }) => theme.medias.max768} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  ${({ theme }) => theme.medias.max768} {
    width: 100%;
  }
`;

const Body = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  height: 240px;
  overflow-y: auto;

  ${({ theme }) => theme.medias.max1280} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: auto;
    max-height: 400px;
  }

  ${({ theme }) => theme.medias.max900} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.medias.max768} {
    grid-template-columns: repeat(1, 1fr);
    max-height: none;
  }
`;

const RaidItem = styled.li<{ $backgroundImageUrl: string }>`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  color: ${({ theme }) => theme.app.palette.gray[0]};
  line-height: 1.2;
  position: relative;
  background: #000;
  z-index: 1;
  border: 1px solid ${({ theme }) => theme.app.border};

  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: url(${({ $backgroundImageUrl }) => $backgroundImageUrl})
      no-repeat right top 20% / cover;
    z-index: -1;
    border-radius: 6px;
    opacity: 0.3;
  }
`;

const Boss = styled.strong`
  font-size: 15px;
  font-weight: 700;

  ${({ theme }) => theme.medias.max1280} {
    font-size: 14px;
  }
`;

const Count = styled.span`
  margin-left: 8px;
  font-size: 15px;
  font-weight: 500;
  ${({ theme }) => theme.medias.max1280} {
    font-size: 14px;
  }
`;

const CharacterTypes = styled.span`
  margin-left: auto;
  font-size: 13px;
`;
