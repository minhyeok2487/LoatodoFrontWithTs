import { useEffect, useState } from "react";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import useCharacters from "@core/hooks/queries/character/useCharacters";
import type { Character } from "@core/types/character";

import TestDataNotify from "@components/TestDataNotify";

import MainCharacters from "./components/MainCharacters";
import MainProfit from "./components/MainProfit";
import MainRaids from "./components/MainRaids";
import MainSchedule from "./components/MainSchedule";

const HomeIndex = () => {
  const getCharacters = useCharacters();
  const [visibleCharacters, setVisibleCharacters] = useState<Character[]>([]);

  useEffect(() => {
    if (getCharacters.data) {
      setVisibleCharacters(
        getCharacters.data.filter(
          (character) => character.settings.showCharacter === true
        )
      );
    }
  }, [getCharacters.data]);

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
          {/* 주간 레이드 일정 */}
          <MainSchedule />
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
