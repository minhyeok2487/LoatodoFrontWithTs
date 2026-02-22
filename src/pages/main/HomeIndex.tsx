import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import Ad from "src/module/Ad";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { authAtom } from "@core/atoms/auth.atom";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import type { Character } from "@core/types/character";

import TestDataNotify from "@components/TestDataNotify";

import LifeEnergy from "./components/LifeEnergy";
import LogsProfitGraph from "./components/LogsProfitGraph";
import MainCharacters from "./components/MainCharacters";
import MainRaids from "./components/MainRaids";

const HomeIndex = () => {
  const getCharacters = useCharacters();
  const auth = useAtomValue(authAtom);
  const [visibleCharacters, setVisibleCharacters] = useState<Character[]>([]);

  const shouldShowAd = !auth.adsDate || new Date(auth.adsDate) <= new Date();

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
          {/* 내 레이드 별 현황 */}
          <MainRaids characters={visibleCharacters} />

          {/* 내 캐릭터 */}
          <MainCharacters characters={visibleCharacters} />
        </Row>
        <Row>
          {shouldShowAd && <Ad placementName="video" />}
          <LifeEnergy />
        </Row>
        <Row>
          <LogsProfitGraph />
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
  align-items: flex-start;
  width: 100%;
  gap: 16px;

  ${({ theme }) => theme.medias.max1280} {
    flex-direction: column;
    gap: 16px;
  }
`;

const AdWrapper = styled.div`
  flex: 1;
  padding: 20px 24px 24px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  & > div {
    width: 410px;
    height: 230px;

    ${({ theme }) => theme.medias.max768} {
      width: 100%;
      height: auto;
      aspect-ratio: 410 / 230;
    }
  }

  ${({ theme }) => theme.medias.max1280} {
    flex: unset;
    width: 100%;
    padding: 20px;
  }
`;
