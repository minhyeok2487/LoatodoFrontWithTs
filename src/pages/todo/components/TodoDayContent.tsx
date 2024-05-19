import { useSetRecoilState } from "recoil";
import * as characterApi from "../../../core/apis/Character.api";
import * as friendApi from "../../../core/apis/Friend.api";
import { useCharacters } from "../../../core/apis/Character.api";
import { CharacterType } from "../../../core/types/Character.type";
import { modalState } from "../../../core/atoms/Modal.atom";
import { FC, useEffect, useState } from "react";
import { FriendType } from "../../../core/types/Friend.type";
import { toast } from "react-toastify";
import { useFriends } from "../../../core/apis/Friend.api";
import { loading } from "../../../core/atoms/Loading.atom";

interface Props {
  character: CharacterType;
  friend?: FriendType;
}

const TodoDayContent: FC<Props> = ({ character, friend }) => {
  const { refetch: refetchCharacters } = useCharacters();
  const { refetch: refetchFriends } = useFriends();
  const setModal = useSetRecoilState(modalState);
  const [localCharacter, setLocalCharacter] =
    useState<CharacterType>(character);
  const setLoadingState = useSetRecoilState(loading);

  useEffect(() => {
    setLocalCharacter(character);
  }, [character]);

  // 일일 숙제 체크/해제
  const updateDayContent = async (
    character: CharacterType,
    category: string
  ) => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkDayTodo) {
        toast.warn("권한이 없습니다.");
        return null;
      }
      try {
        await friendApi.updateDayContent(
          character.characterId,
          character.characterName,
          category
        );
        refetchFriends();
        setLocalCharacter(character);
      } catch (error) {
        console.error("Error updating day content:", error);
      }
    } else {
      try {
        await characterApi.updateDayContent(
          character.characterId,
          character.characterName,
          category
        );
        refetchCharacters();
        setLocalCharacter(character);
      } catch (error) {
        console.error("Error updating day content:", error);
      }
    }
    setLoadingState(false);
  };

  // 일일 숙제 전체 체크/해제
  const updateDayContentAll = async (
    e: React.MouseEvent,
    character: CharacterType,
    category: string
  ) => {
    e.preventDefault();
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkDayTodo) {
        toast.warn("권한이 없습니다.");
        return null;
      }
      try {
        await friendApi.updateDayContentAll(
          character.characterId,
          character.characterName,
          category
        );
        refetchFriends();
        setLocalCharacter(character);
      } catch (error) {
        console.error("Error updating day content:", error);
      }
    } else {
      try {
        await characterApi.updateDayContentAll(
          character.characterId,
          character.characterName,
          category
        );
        refetchCharacters();
        setLocalCharacter(character);
      } catch (error) {
        console.error("Error updating day content All:", error);
      }
    }
    setLoadingState(false);
  };

  // 캐릭터 휴식게이지 업데이트
  const updateDayContentGuage = async (
    e: React.MouseEvent,
    updatedCharacter: CharacterType,
    gaugeType: string
  ) => {
    setLoadingState(true);
    e.preventDefault();
    if (friend) {
      if (!friend.fromFriendSettings.checkDayTodo) {
        toast.warn("권한이 없습니다.");
        return null;
      }
      const newGaugeValue = window.prompt(`휴식게이지 수정`);
      if (newGaugeValue !== null) {
        const parsedValue = parseInt(newGaugeValue);
        if (!isNaN(parsedValue)) {
          try {
            // Update the localCharacter object immutably
            const updatedGaugeCharacter = { ...updatedCharacter };
            if (gaugeType === "chaos") {
              updatedGaugeCharacter.chaosGauge = parsedValue;
            } else if (gaugeType === "guardian") {
              updatedGaugeCharacter.guardianGauge = parsedValue;
            } else if (gaugeType === "epona") {
              updatedGaugeCharacter.eponaGauge = parsedValue;
            } else {
              return null;
            }
            await friendApi.updateDayContentGuage(
              updatedGaugeCharacter.characterId,
              updatedGaugeCharacter.characterName,
              updatedGaugeCharacter.chaosGauge,
              updatedGaugeCharacter.guardianGauge,
              updatedGaugeCharacter.eponaGauge
            );
            refetchCharacters();
            setLocalCharacter((prevCharacter) => ({
              ...prevCharacter,
              ...updatedGaugeCharacter,
            }));
          } catch (error) {
            console.error("Error updating day content gauge:", error);
          }
        }
      }
    } else {
      const newGaugeValue = window.prompt(`휴식게이지 수정`);
      if (newGaugeValue !== null) {
        const parsedValue = parseInt(newGaugeValue);
        if (!isNaN(parsedValue)) {
          try {
            // Update the localCharacter object immutably
            const updatedGaugeCharacter = { ...updatedCharacter };
            if (gaugeType === "chaos") {
              updatedGaugeCharacter.chaosGauge = parsedValue;
            } else if (gaugeType === "guardian") {
              updatedGaugeCharacter.guardianGauge = parsedValue;
            } else if (gaugeType === "epona") {
              updatedGaugeCharacter.eponaGauge = parsedValue;
            } else {
              return null;
            }
            await characterApi.updateDayContentGuage(
              updatedGaugeCharacter.characterId,
              updatedGaugeCharacter.characterName,
              updatedGaugeCharacter.chaosGauge,
              updatedGaugeCharacter.guardianGauge,
              updatedGaugeCharacter.eponaGauge
            );
            refetchCharacters();
            setLocalCharacter((prevCharacter) => ({
              ...prevCharacter,
              ...updatedGaugeCharacter,
            }));
          } catch (error) {
            console.error("Error updating day content gauge:", error);
          }
        }
      }
    }
    setLoadingState(false);
  };

  // 일일 컨텐츠 통계 모달 열기
  const openDayContentAvg = (character: CharacterType, category: string) => {
    const modlaTitle =
      "" + character.characterName + " " + category + " 평균 데이터";
    if (category === "카오스던전") {
      var modalContent = (
        <div className="chaosVisual">
          <span className="tip">
            API 최근 경매장 가격으로 평균 값을 가져옵니다.
          </span>
          <p>
            컨텐츠 <strong>{character.chaos.name}</strong>
          </p>
          <div className="flex">
            <ul>
              <strong>거래 가능 재화</strong>
              <li>
                파괴석 <em>{character.chaos.destructionStone}개</em>
              </li>
              <li>
                수호석 <em>{character.chaos.guardianStone}개</em>
              </li>
              <li>
                1레벨보석 <em>{character.chaos.jewelry}개</em>
              </li>
            </ul>
            <ul>
              <strong>거래 불가 재화</strong>
              <li>
                돌파석 <em>{character.chaos.leapStone}개</em>
              </li>
              <li>
                실링 <em>{character.chaos.shilling}개</em>
              </li>
              <li>
                파편 <em>{character.chaos.honorShard}개</em>
              </li>
            </ul>
          </div>
        </div>
      );
    } else {
      modalContent = (
        <div className="chaosVisual">
          <span className="tip">
            API 최근 경매장 가격으로 평균 값을 가져옵니다.
          </span>
          <p>
            컨텐츠 <strong>{character.guardian.name}</strong>
          </p>
          <div className="flex one">
            <ul>
              <strong>거래 가능 재화</strong>
              <li>
                파괴석 <em>{character.guardian.destructionStone}개</em>
              </li>
              <li>
                수호석 <em>{character.guardian.guardianStone}개</em>
              </li>
              <li>
                돌파석 <em>{character.guardian.leapStone}개</em>
              </li>
            </ul>
          </div>
        </div>
      );
    }
    setModal({
      openModal: true,
      modalTitle: modlaTitle,
      modalContent: modalContent,
    });
  };

  return (
    <div className="character-wrap">
      <div
        className="character-info"
        style={{
          backgroundImage:
            localCharacter.characterImage !== null
              ? `url(${localCharacter.characterImage})`
              : "",
          backgroundPosition:
            localCharacter.characterClassName === "도화가" ||
            localCharacter.characterClassName === "기상술사"
              ? "left 10px top -80px"
              : "left 10px top -30px",
          backgroundColor: "gray", // 배경색을 회색으로 설정
        }}
      >
        <div className={localCharacter.goldCharacter ? "gold-border" : ""}>
          {localCharacter.goldCharacter ? "골드 획득 지정" : ""}
        </div>
        <span>
          @{localCharacter.serverName} {localCharacter.characterClassName}
        </span>
        <h3 style={{ margin: 0 }}>{localCharacter.characterName}</h3>
        <h2 style={{ margin: 0 }}>Lv. {localCharacter.itemLevel}</h2>
      </div>
      <p className="title">일일 숙제</p>
      <div
        className="content-wrap"
        style={{
          display:
            (friend === undefined || friend.fromFriendSettings?.showDayTodo) &&
            localCharacter.settings.showEpona
              ? "block"
              : "none",
        }}
      >
        <div
          className="content"
          style={{ cursor: "pointer" }}
          onClick={() => updateDayContent(localCharacter, "epona")}
          onContextMenu={(e) => updateDayContentAll(e, localCharacter, "epona")}
        >
          <button
            className={`content-button ${
              localCharacter.eponaCheck === 3
                ? "done"
                : localCharacter.eponaCheck === 1
                ? "ing"
                : localCharacter.eponaCheck === 2
                ? "ing2"
                : ""
            }`}
          ></button>
          <div
            className={`${localCharacter.eponaCheck === 3 ? "text-done" : ""}`}
          >
            <span>에포나의뢰</span>
          </div>
        </div>
        <div
          className="content gauge-box"
          style={{
            height: 24,
            padding: 0,
            position: "relative",
            cursor: "pointer",
          }}
          onContextMenu={(e) =>
            updateDayContentGuage(e, localCharacter, "epona")
          }
          onClick={(e) => updateDayContentGuage(e, localCharacter, "epona")}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="gauge-wrap">
              <div
                className="gauge"
                style={{
                  backgroundColor:
                    index * 2 < localCharacter.eponaGauge / 10
                      ? "#cfecff"
                      : undefined,
                }}
              ></div>
              <div
                className="gauge"
                style={{
                  backgroundColor:
                    index * 2 + 1 < localCharacter.eponaGauge / 10
                      ? "#cfecff"
                      : undefined,
                }}
              ></div>
            </div>
          ))}
          <span className="gauge-text">
            휴식게이지 {localCharacter.eponaGauge}
          </span>
        </div>
      </div>
      <div
        className="content-wrap"
        style={{
          display:
            (friend === undefined || friend.fromFriendSettings?.showDayTodo) &&
            localCharacter.settings.showChaos
              ? "block"
              : "none",
        }}
      >
        <div className="content">
          {/* pub 순서변경 */}
          <button
            className={`content-button ${
              localCharacter.chaosCheck === 0
                ? ""
                : localCharacter.chaosCheck === 1
                ? "ing"
                : "done"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => updateDayContent(localCharacter, "chaos")}
            onContextMenu={(e) =>
              updateDayContentAll(e, localCharacter, "chaos")
            }
          ></button>
          <div
            className={`${localCharacter.chaosCheck === 2 ? "text-done" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => updateDayContent(localCharacter, "chaos")}
            onContextMenu={(e) =>
              updateDayContentAll(e, localCharacter, "chaos")
            }
          >
            <p>카오스던전</p>
            <p className="gold">{localCharacter.chaosGold} G</p>
          </div>
          <input
            type="button"
            className="icon-btn-search"
            onClick={() => openDayContentAvg(character, "카오스던전")}
          />
        </div>
        <div
          className="content gauge-box"
          style={{
            height: 24,
            padding: 0,
            position: "relative",
            cursor: "pointer",
          }}
          onContextMenu={(e) =>
            updateDayContentGuage(e, localCharacter, "chaos")
          }
          onClick={(e) => updateDayContentGuage(e, localCharacter, "chaos")}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="gauge-wrap">
              <div
                className="gauge"
                style={{
                  backgroundColor:
                    index * 2 < localCharacter.chaosGauge / 10
                      ? "#cfecff"
                      : undefined,
                }}
              ></div>
              <div
                className="gauge"
                style={{
                  backgroundColor:
                    index * 2 + 1 < localCharacter.chaosGauge / 10
                      ? "#cfecff"
                      : undefined,
                }}
              ></div>
            </div>
          ))}
          <span className="gauge-text">
            휴식게이지 {localCharacter.chaosGauge}
          </span>
        </div>
      </div>
      <div
        className="content-wrap"
        style={{
          display:
            (friend === undefined || friend.fromFriendSettings?.showDayTodo) &&
            localCharacter.settings.showGuardian
              ? "block"
              : "none",
        }}
      >
        <div className="content">
          <button
            className={`content-button ${
              localCharacter.guardianCheck === 1 ? "done" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => updateDayContent(localCharacter, "guardian")}
            onContextMenu={(e) =>
              updateDayContentAll(e, localCharacter, "guardian")
            }
          ></button>
          <div
            className={`${
              localCharacter.guardianCheck === 1 ? "text-done" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => updateDayContent(localCharacter, "guardian")}
            onContextMenu={(e) =>
              updateDayContentAll(e, localCharacter, "guardian")
            }
          >
            <p>가디언토벌</p>
            <p className="gold">{localCharacter.guardianGold} G</p>
          </div>
          <input
            type="button"
            className="icon-btn-search"
            onClick={() => openDayContentAvg(character, "가디언토벌")}
          />
        </div>
        <div
          className="content gauge-box"
          style={{
            height: 24,
            padding: 0,
            position: "relative",
            cursor: "pointer",
          }}
          onContextMenu={(e) =>
            updateDayContentGuage(e, localCharacter, "guardian")
          }
          onClick={(e) => updateDayContentGuage(e, localCharacter, "guardian")}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="gauge-wrap">
              <div
                className="gauge"
                style={{
                  backgroundColor:
                    index * 2 < localCharacter.guardianGauge / 10
                      ? "#cfecff"
                      : undefined,
                }}
              ></div>
              <div
                className="gauge"
                style={{
                  backgroundColor:
                    index * 2 + 1 < localCharacter.guardianGauge / 10
                      ? "#cfecff"
                      : undefined,
                }}
              ></div>
            </div>
          ))}
          <span className="gauge-text">
            휴식게이지 {localCharacter.guardianGauge}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TodoDayContent;
