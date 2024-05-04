import { useCharacterData } from "../../apis/Member.api";
import DefaultLayout from "../../layouts/DefaultLayout";
import MainCharacters from "./components/MainCharacters";
import MainProfit from "./components/MainProfit";
import MainRaids from "./components/MainRaids";
import MainWeekly from "./components/MainWeekly";
import MainNotices from "./components/MainNotices";
import "../../styles/pages/HomeIndex.css";
import { CharacterDto } from "../../types/MemberResponse";

const HomeIndex = () => {
  const { data } = useCharacterData();
  if (data == undefined) {
    return null;
  }
  const characterList: CharacterDto[] = Object.values(
    data.characterDtoMap
  ).flat();

  return (
    <DefaultLayout>
      <div className="home-wrap">
        <div className="home-content">
          {/*숙제 수익 요약*/}
          <MainProfit />

          {/*대표 캐릭터*/}
          <MainCharacters />
        </div>
        <div className="home-content">
          {/*레이드 별 현황*/}
          <MainRaids data={characterList} />
        </div>
        <div className="home-content">
          {/*로스트아크, LoaTodo 공지사항*/}
          <MainNotices />

          {/*이번주 레이드 현황*/}
          <MainWeekly />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HomeIndex;
