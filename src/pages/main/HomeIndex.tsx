import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [visibleCharacters, setVisibleCharacters] = useState<Character[]>([]);
  const [searchValue, setSearchValue] = useState("");

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed) {
      navigate(`/character-profile?name=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <DefaultLayout>
      <Wrapper>
        <TestDataNotify />

        <SearchSection>
          <SearchTitle>전투정보실</SearchTitle>
          <SearchForm onSubmit={handleSearchSubmit}>
            <SearchInput
              type="text"
              placeholder="캐릭터명을 입력하세요"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <SearchButton type="submit">검색</SearchButton>
          </SearchForm>
        </SearchSection>

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

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 24px;
  border-radius: 16px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const SearchTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.black};
  margin: 0;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.main};
  color: ${({ theme }) => theme.app.text.dark1};
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }

  &:focus {
    border-color: ${({ theme }) => theme.app.text.dark2};
  }
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.reverse};
  color: ${({ theme }) => theme.app.text.reverse};
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }
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
