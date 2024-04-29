import { useHome } from "../../apis/Home.api";
import DefaultLayout from "../../layouts/DefaultLayout";
import MainCharacters from "./components/MainCharacters";
import MainProfit from "./components/MainProfit";

const HomeIndex = () => {
  const { data } = useHome();

  return (
    <DefaultLayout>
      <div className="home-wrap">
        <div className="home-content">
          {data?.characterName}
          {/*숙제 수익 요약*/}
          <MainProfit />

          {/*대표 캐릭터*/}
          <MainCharacters />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HomeIndex;
