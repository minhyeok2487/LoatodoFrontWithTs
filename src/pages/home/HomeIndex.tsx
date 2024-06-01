import DefaultLayout from "../../layouts/DefaultLayout";
import MainCharacters from "./components/MainCharacters";
import MainProfit from "./components/MainProfit";
import MainRaids from "./components/MainRaids";
import MainWeekly from "./components/MainWeekly";
import MainNotices from "./components/MainNotices";
import "../../styles/pages/HomeIndex.css";
import MainFriends from "./components/MainFriends";
import TestDataNotify from "../../components/TestDataNotify";
import { useCharacters } from "../../core/apis/Character.api";
import { useEffect, useState } from "react";
import { CharacterType } from "../../core/types/Character.type";

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
      <div className="home-wrap">
        <TestDataNotify />

        <div className="home-content">
          {/*숙제 수익 요약*/}
          <MainProfit characters={visibleCharacters} />

          {/*대표 캐릭터*/}
          <MainCharacters characters={visibleCharacters} />
        </div>
        <div className="home-content">
          {/*레이드 별 현황*/}
          <MainRaids characters={visibleCharacters} />
        </div>
        <div className="home-content">
          {/*로스트아크, LoaTodo 공지사항*/}
          <MainNotices />

          {/*이번주 레이드 현황*/}
          <MainWeekly />
        </div>
        <div className="home-content">
          <MainFriends title={"깐부 오늘 일일숙제 랭킹"} type={"day"} />
          <MainFriends title={"깐부 주간 레이드 랭킹"} type={"raid"} />
          <MainFriends title={"깐부 일일 + 주간 랭킹"} type={"total"} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HomeIndex;
