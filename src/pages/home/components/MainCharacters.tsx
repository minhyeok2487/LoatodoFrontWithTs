import styled from "@emotion/styled";
import type { FC } from "react";

import { useCharacters } from "@core/apis/Character.api";
import { editMainCharacter, useMember } from "@core/apis/Member.api";
import useModalState from "@core/hooks/useModalState";
import { CharacterType } from "@core/types/Character.type";
import { EditMainCharacterType } from "@core/types/Member.type";

import Button from "@components/Button";
import Modal from "@components/Modal";

import BoxWrapper from "./BoxWrapper";

interface Props {
  characters: CharacterType[] | undefined;
}

const MainCharacters: FC<Props> = ({ characters }) => {
  const { data: member, refetch: refetchMember } = useMember();
  const { refetch: refetchCharacters } = useCharacters();
  const [targetRepresentCharacter, toggleTargetRepresentCharacter] =
    useModalState<CharacterType>();

  const mainCharacter = member?.mainCharacter;
  if (characters === undefined || member === undefined) {
    return null;
  }

  const calAverageLevel = characters.reduce((acc, character) => {
    return acc + character.itemLevel;
  }, 0);

  const supportList = ["바드", "도화가", "홀리나이트"];
  const countDealer = characters.reduce((acc, character) => {
    return !supportList.includes(character.characterClassName) ? acc + 1 : acc;
  }, 0);

  const countSupport = characters.reduce((acc, character) => {
    return supportList.includes(character.characterClassName) ? acc + 1 : acc;
  }, 0);

  const isMainCharacter = (characterName: string): boolean => {
    return characterName === mainCharacter?.characterName;
  };

  const handleUpdateMainCharacter = async (characterName: string) => {
    const data: EditMainCharacterType = {
      mainCharacter: characterName,
    };
    try {
      await editMainCharacter(data);
      refetchMember();
      refetchCharacters();
    } catch (error) {
      console.error("Error editing main character:", error);
    } finally {
      toggleTargetRepresentCharacter();
    }
  };

  return (
    <BoxWrapper flex={3}>
      <div className="characters-info-header">
        <h1>내 캐릭터</h1>
      </div>

      <div className="characters-info">
        <div className="represent">
          <span
            className="img"
            style={{
              backgroundImage:
                mainCharacter?.characterImage !== null
                  ? `url(${mainCharacter?.characterImage})`
                  : "",
              backgroundPosition:
                mainCharacter?.characterClassName === "도화가" ||
                mainCharacter?.characterClassName === "기상술사"
                  ? "50% 32%"
                  : "50% 15%",
              backgroundColor: "black", // 캐릭터가 이미지가 없으면 배경색을 검정으로 설정
            }}
          />
          <span className="name">{mainCharacter?.characterName}</span>
          <span className="level">Lv. {mainCharacter?.itemLevel}</span>
          <span className="info">
            @{mainCharacter?.serverName} {mainCharacter?.characterClassName}
          </span>
        </div>
        <div className="character-list">
          {characters.map((character, index) => (
            <div key={index} className="character-info-box">
              <span className="character-server">@{character.serverName}</span>
              <span className="character-className">
                {character.characterClassName}
              </span>
              <span className="character-name">{character.characterName}</span>
              {!isMainCharacter(character.characterName) && (
                <Button
                  onClick={() => toggleTargetRepresentCharacter(character)}
                >
                  대표
                </Button>
              )}
              <span className="character-itemLevel">
                Lv. {character.itemLevel}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="characters-info total">
        <div className="characters-average">
          <span className="characters-average-text">평균 아이템 레벨</span>
          <span className="characters-average-level">
            Lv.{(calAverageLevel / characters.length).toFixed(2)}
          </span>
        </div>
        <div className="characters-info-summary">
          <div className="summary">
            <span>총</span>
            <span className="val">{characters.length}</span>
            <span>캐릭</span>
          </div>
          <div className="summary">
            <span>딜러</span>
            <span className="val">{countDealer}</span>
          </div>
          <div className="summary">
            <span>서폿</span>
            <span className="val">{countSupport}</span>
          </div>
        </div>
      </div>

      {targetRepresentCharacter && (
        <Modal
          title="대표 캐릭터 변경"
          buttons={[
            {
              label: "확인",
              onClick: () =>
                handleUpdateMainCharacter(
                  targetRepresentCharacter.characterName
                ),
            },
            {
              label: "취소",
              onClick: () => toggleTargetRepresentCharacter(),
            },
          ]}
          isOpen={!!targetRepresentCharacter}
          onClose={() => toggleTargetRepresentCharacter(undefined)}
        >
          <div className="update-main-character-form">
            <p>
              <strong>{targetRepresentCharacter?.characterName}</strong>으로
              대표 캐릭터를 변경하시겠어요?
            </p>
          </div>
        </Modal>
      )}
    </BoxWrapper>
  );
};

export default MainCharacters;
