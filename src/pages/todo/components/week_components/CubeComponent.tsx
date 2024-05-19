import { FC } from "react";
import { CharacterType } from "../../../../core/types/Character.type";
import SearchIcon from "@mui/icons-material/Search";
import * as characterApi from "../../../../core/apis/Character.api";
import { useRecoilState, useSetRecoilState } from "recoil";
import { modalState } from "../../../../core/atoms/Modal.atom";

interface Props {
  character: CharacterType;
}
const CubeComponent: FC<Props> = ({ character }) => {
  const { refetch: refetchCharacters } = characterApi.useCharacters();
  const [modal, setModal] = useRecoilState(modalState);

  /*큐브 티켓 추가*/
  const addCubeTicket = async () => {
    try {
      await characterApi.addCubeTicket(character);
      refetchCharacters();
    } catch (error) {
      console.error("Error weekEponaCheck:", error);
    }
  };

  /*큐브 티켓 감소*/
  const substractCubeTicket = async () => {
    try {
      await characterApi.substractCubeTicket(character);
      refetchCharacters();
    } catch (error) {
      console.error("Error weekEponaCheck:", error);
    }
  };

  /*큐브 티켓 데이터 호출*/
  const getCubeContent = async () => {
    var name;
    if (character.itemLevel < 1490.0) {
      name = "1금제";
    } else if (character.itemLevel >= 1490.0 && character.itemLevel < 1540.0) {
      name = "2금제";
    } else if (character.itemLevel >= 1540.0 && character.itemLevel < 1580.0) {
      name = "3금제";
    } else if (character.itemLevel >= 1580.0 && character.itemLevel < 1610.0) {
      name = "4금제";
    } else {
      name = "5금제";
    }
    try {
      return await characterApi.getCubeContent(name);
    } catch (error) {
      console.error("Error getCubeContent:", error);
    }
  };

  const modalTitle = "에브니 큐브 평균 데이터";

  /*큐브 티켓 통계 모달 열기*/
  const openCubeAverage = async () => {
    const cubeContent = await getCubeContent();
    var modalContent = (
      <div className="chaosVisual">
        <p>
          <button
            className="prev"
            style={{ cursor: "pointer", marginRight: 5 }}
            onClick={() => previousCubeContent(cubeContent.name)}
          >
            ←
          </button>
          에브니 큐브 <strong>{cubeContent.name}</strong>
          <button
            className="next"
            style={{ cursor: "pointer", marginLeft: 5 }}
            onClick={() => nextCubeContent(cubeContent.name)}
          >
            →
          </button>
        </p>
        <div className="flex" style={{ alignItems: "flex-start" }}>
          <ul>
            <strong>거래 가능 재화</strong>
            <li>
              1레벨보석 <em>{cubeContent.jewelry}개</em>
            </li>
            <li>
              가격 <em>개당 {cubeContent.jewelryPrice} G</em>
            </li>
            <li>
              총 가격{" "}
              <em>{cubeContent.jewelry * cubeContent.jewelryPrice} G</em>
            </li>
          </ul>
          <ul>
            <strong>거래 불가 재화</strong>
            <li>
              돌파석 <em>{cubeContent.leapStone}개</em>
            </li>
            <li>
              실링 <em>{cubeContent.shilling}</em>
            </li>
            <li>
              은총 <em>{cubeContent.solarGrace}개</em>
            </li>
            <li>
              축복 <em>{cubeContent.solarBlessing}개</em>
            </li>
            <li>
              가호 <em>{cubeContent.solarProtection}개</em>
            </li>
            <li>
              카경 <em>{cubeContent.cardExp}</em>
            </li>
          </ul>
        </div>
      </div>
    );
    setModal({
      openModal: true,
      modalTitle: modalTitle,
      modalContent: modalContent,
    });
  };

  /*큐브 티켓 통계 이전*/
  const previousCubeContent = async (name: string) => {
    const cubeContentList = ["1금제", "2금제", "3금제", "4금제", "5금제"];
    const currentIndex = cubeContentList.indexOf(name);
    const previousIndex =
      currentIndex === 0 ? cubeContentList.length - 1 : currentIndex - 1;
    const preName = cubeContentList[previousIndex];

    try {
      const cubeContent = await characterApi.getCubeContent(preName);
      var modalContent = (
        <div className="chaosVisual">
          <p>
            <button
              className="prev"
              style={{ cursor: "pointer", marginRight: 5 }}
              onClick={() => previousCubeContent(cubeContent.name)}
            >
              ←
            </button>
            에브니 큐브 <strong>{cubeContent.name}</strong>
            <button
              className="next"
              style={{ cursor: "pointer", marginLeft: 5 }}
              onClick={() => nextCubeContent(cubeContent.name)}
            >
              →
            </button>
          </p>
          <div className="flex" style={{ alignItems: "flex-start" }}>
            <ul>
              <strong>거래 가능 재화</strong>
              <li>
                1레벨보석 <em>{cubeContent.jewelry}개</em>
              </li>
              <li>
                가격 <em>개당 {cubeContent.jewelryPrice} G</em>
              </li>
              <li>
                총 가격{" "}
                <em>{cubeContent.jewelry * cubeContent.jewelryPrice} G</em>
              </li>
            </ul>
            <ul>
              <strong>거래 불가 재화</strong>
              <li>
                돌파석 <em>{cubeContent.leapStone}개</em>
              </li>
              <li>
                실링 <em>{cubeContent.shilling}</em>
              </li>
              <li>
                은총 <em>{cubeContent.solarGrace}개</em>
              </li>
              <li>
                축복 <em>{cubeContent.solarBlessing}개</em>
              </li>
              <li>
                가호 <em>{cubeContent.solarProtection}개</em>
              </li>
              <li>
                카경 <em>{cubeContent.cardExp}</em>
              </li>
            </ul>
          </div>
        </div>
      );
      setModal({
        ...modal,
        modalContent: modalContent,
        openModal: true,
        modalTitle: modalTitle,
      });
    } catch (error) {
      console.log(error);
    }
  };

  /*큐브 티켓 통계 다음*/
  const nextCubeContent = async (name: string) => {
    const cubeContentList = ["1금제", "2금제", "3금제", "4금제", "5금제"];

    const currentIndex = cubeContentList.indexOf(name);
    const nextIndex =
      currentIndex === cubeContentList.length - 1 ? 0 : currentIndex + 1;
    const nextName = cubeContentList[nextIndex];

    try {
      const cubeContent = await characterApi.getCubeContent(nextName);
      var modalContent = (
        <div className="chaosVisual">
          <p>
            <button
              className="prev"
              style={{ cursor: "pointer", marginRight: 5 }}
              onClick={() => previousCubeContent(cubeContent.name)}
            >
              ←
            </button>
            에브니 큐브 <strong>{cubeContent.name}</strong>
            <button
              className="next"
              style={{ cursor: "pointer", marginLeft: 5 }}
              onClick={() => nextCubeContent(cubeContent.name)}
            >
              →
            </button>
          </p>
          <div className="flex" style={{ alignItems: "flex-start"}}>
            <ul>
              <strong>거래 가능 재화</strong>
              <li>
                1레벨보석 <em>{cubeContent.jewelry}개</em>
              </li>
              <li>
                가격 <em>개당 {cubeContent.jewelryPrice} G</em>
              </li>
              <li>
                총 가격{" "}
                <em>{cubeContent.jewelry * cubeContent.jewelryPrice} G</em>
              </li>
            </ul>
            <ul>
              <strong>거래 불가 재화</strong>
              <li>
                돌파석 <em>{cubeContent.leapStone}개</em>
              </li>
              <li>
                실링 <em>{cubeContent.shilling}</em>
              </li>
              <li>
                은총 <em>{cubeContent.solarGrace}개</em>
              </li>
              <li>
                축복 <em>{cubeContent.solarBlessing}개</em>
              </li>
              <li>
                가호 <em>{cubeContent.solarProtection}개</em>
              </li>
              <li>
                카경 <em>{cubeContent.cardExp}</em>
              </li>
            </ul>
          </div>
        </div>
      );
      setModal({
        ...modal,
        modalContent: modalContent,
        openModal: true,
        modalTitle: modalTitle,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="content-wrap">
      <div
        className="content"
        style={{
          height: 35,
          position: "relative",
          justifyContent: "space-between",
          fontSize: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <button
            className="minus"
            style={{ cursor: "pointer" }}
            onClick={() => substractCubeTicket()}
          >
            -
          </button>
          <div
            style={{
              width: "90px",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            {character.cubeTicket} 장
          </div>
          <button
            className="plus"
            style={{ cursor: "pointer" }}
            onClick={() => addCubeTicket()}
          >
            +
          </button>
          <div style={{ width: "100%", marginLeft: 5 }}>큐브 티켓</div>
          <SearchIcon
            onClick={() => openCubeAverage()}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
};

export default CubeComponent;
