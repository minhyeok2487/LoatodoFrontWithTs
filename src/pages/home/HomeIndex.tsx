import styled from "@emotion/styled";
import { useEffect, useState } from "react";

import DefaultLayout from "@layouts/DefaultLayout";

import { useCharacters } from "@core/apis/Character.api";
import { CharacterType } from "@core/types/Character.type";

import TestDataNotify from "@components/TestDataNotify";

import "@styles/pages/HomeIndex.css";

import MainCharacters from "./components/MainCharacters";
import MainFriends from "./components/MainFriends";
import MainNotices from "./components/MainNotices";
import MainProfit from "./components/MainProfit";
import MainRaids from "./components/MainRaids";
import MainWeekly from "./components/MainWeekly";

const HomeIndex = () => {
  const { data: characters } = useCharacters();
  const [visibleCharacters, setVisibleCharacters] = useState<CharacterType[]>();
  useEffect(() => {
    if (characters && characters.length > 0) {
      setVisibleCharacters(
        characters.filter(
          (character) => character.settings.showCharacter === true
        )
      );
    }
  }, [characters]);

  return (
    <DefaultLayout>
      <Wrapper>
        <TestDataNotify />

        <Row>
          {/* 내 숙제 */}
          <MainProfit characters={visibleCharacters} />

          {/* 내 캐릭터 */}
          <MainCharacters characters={visibleCharacters} />
        </Row>
        <Row>
          {/* 내 레이드 별 현황 */}
          <MainRaids characters={visibleCharacters} />
        </Row>
        <Row>
          {/* 로스트아크, LoaTodo 공지사항 */}
          <MainNotices />

          {/* 주간 레이드 일정 */}
          <MainWeekly />
        </Row>

        <Row>
          <MainFriends title="깐부 오늘 일일숙제 랭킹" type="day" />
          <MainFriends title="깐부 주간 레이드 랭킹" type="raid" />
          <MainFriends title="깐부 일일 + 주간 랭킹" type="total" />
        </Row>
      </Wrapper>
    </DefaultLayout>
  );
};

export default HomeIndex;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 16px;

  ${({ theme }) => theme.medias.max1280} {
    flex-direction: column;
    gap: 16px;
  }
`;
