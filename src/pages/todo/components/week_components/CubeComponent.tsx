import SearchIcon from "@mui/icons-material/Search";
import { FC } from "react";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";

import * as characterApi from "@core/apis/Character.api";
import * as friendApi from "@core/apis/Friend.api";
import { loading } from "@core/atoms/Loading.atom";
import { modalState } from "@core/atoms/Modal.atom";
import { CharacterType } from "@core/types/Character.type";
import { FriendType } from "@core/types/Friend.type";

interface Props {
  character: CharacterType;
  friend?: FriendType;
}
const CubeComponent: FC<Props> = ({ character, friend }) => {
  const { refetch: refetchCharacters } = characterApi.useCharacters();
  const { refetch: refetchFriends } = friendApi.useFriends();
  const [modal, setModal] = useRecoilState(modalState);
  const setLoadingState = useSetRecoilState(loading);

  /* 큐브 티켓 추가 */
  const addCubeTicket = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
      }
      try {
        await friendApi.addCubeTicket(character);
        refetchFriends();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    } else {
      try {
        await characterApi.addCubeTicket(character);
        refetchCharacters();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    }
    setLoadingState(false);
  };

  /* 큐브 티켓 감소 */
  const substractCubeTicket = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
      }
      try {
        await friendApi.substractCubeTicket(character);
        refetchFriends();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    } else {
      try {
        await characterApi.substractCubeTicket(character);
        refetchCharacters();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    }
    setLoadingState(false);
  };

  /* 큐브 티켓 데이터 호출 */
  const getCubeContentName = () => {
    if (character.itemLevel < 1490.0) {
      return "1금제";
    }

    if (character.itemLevel >= 1490.0 && character.itemLevel < 1540.0) {
      return "2금제";
    }

    if (character.itemLevel >= 1540.0 && character.itemLevel < 1580.0) {
      return "3금제";
    }

    if (character.itemLevel >= 1580.0 && character.itemLevel < 1610.0) {
      return "4금제";
    }

    return "5금제";
  };

  const modalTitle = "에브니 큐브 평균 데이터";

  /* 큐브 티켓 통계 모달 열기 */
  const openCubeAverage = async () => {
    setLoadingState(true);
    try {
      const cubeContent =
        await characterApi.getCubeContent(getCubeContentName());

      const modalContent = (
        <div className="chaosVisual">
          <p>
            <button
              className="prev"
              type="button"
              style={{ cursor: "pointer", marginRight: 5 }}
              onClick={() => previousCubeContent(cubeContent.name)}
            >
              ←
            </button>
            에브니 큐브 <strong>{cubeContent.name}</strong>
            <button
              className="next"
              type="button"
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
        modalTitle,
        modalContent,
      });
    } catch (err) {
      console.error("Error getCubeContent:", err);
    } finally {
      setLoadingState(false);
    }
  };

  /* 큐브 티켓 통계 이전 */
  const previousCubeContent = async (name: string) => {
    const cubeContentList = ["1금제", "2금제", "3금제", "4금제", "5금제"];
    const currentIndex = cubeContentList.indexOf(name);
    const previousIndex =
      currentIndex === 0 ? cubeContentList.length - 1 : currentIndex - 1;
    const preName = cubeContentList[previousIndex];

    try {
      const cubeContent = await characterApi.getCubeContent(preName);
      const modalContent = (
        <div className="chaosVisual">
          <p>
            <button
              className="prev"
              type="button"
              style={{ cursor: "pointer", marginRight: 5 }}
              onClick={() => previousCubeContent(cubeContent.name)}
            >
              ←
            </button>
            에브니 큐브 <strong>{cubeContent.name}</strong>
            <button
              className="next"
              type="button"
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
        openModal: true,
        modalContent,
        modalTitle,
      });
    } catch (error) {
      console.log(error);
    }
    setLoadingState(false);
  };

  /* 큐브 티켓 통계 다음 */
  const nextCubeContent = async (name: string) => {
    const cubeContentList = ["1금제", "2금제", "3금제", "4금제", "5금제"];

    const currentIndex = cubeContentList.indexOf(name);
    const nextIndex =
      currentIndex === cubeContentList.length - 1 ? 0 : currentIndex + 1;
    const nextName = cubeContentList[nextIndex];

    try {
      const cubeContent = await characterApi.getCubeContent(nextName);
      const modalContent = (
        <div className="chaosVisual">
          <p>
            <button
              className="prev"
              type="button"
              style={{ cursor: "pointer", marginRight: 5 }}
              onClick={() => previousCubeContent(cubeContent.name)}
            >
              ←
            </button>
            에브니 큐브 <strong>{cubeContent.name}</strong>
            <button
              className="next"
              type="button"
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
        openModal: true,
        modalContent,
        modalTitle,
      });
    } catch (error) {
      console.log(error);
    }
    setLoadingState(false);
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
            type="button"
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
            type="button"
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
