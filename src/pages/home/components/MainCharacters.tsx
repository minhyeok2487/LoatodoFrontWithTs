import styled from "@emotion/styled";
import type { FC } from "react";

import { useCharacters } from "@core/apis/Character.api";
import { editMainCharacter, useMember } from "@core/apis/Member.api";
import useModalState from "@core/hooks/useModalState";
import { CharacterType } from "@core/types/Character.type";
import { EditMainCharacterType } from "@core/types/Member.type";

import Button from "@components/Button";
import Modal from "@components/Modal";

import BoxTitle from "./BoxTitle";
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
    <BoxWrapper flex={3} pb={1}>
      <BoxTitle>내 캐릭터</BoxTitle>

      <Wrapper>
        <Body>
          <RepresentBox>
            <em
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
              }}
            />

            <dl>
              <dt>{mainCharacter?.characterName}</dt>
              <dd>Lv. {mainCharacter?.itemLevel}</dd>
              <dd>
                @{mainCharacter?.serverName} {mainCharacter?.characterClassName}
              </dd>
            </dl>
          </RepresentBox>

          <Characters>
            <ul>
              {characters.map((character, index) => (
                <li key={index}>
                  <span>@{character.serverName}</span>
                  <span>{character.characterClassName}</span>
                  <span>{character.characterName}</span>
                  {!isMainCharacter(character.characterName) && (
                    <Button
                      onClick={() => toggleTargetRepresentCharacter(character)}
                    >
                      대표
                    </Button>
                  )}
                  <span>Lv. {character.itemLevel}</span>
                </li>
              ))}
            </ul>
          </Characters>
        </Body>
        <TotalRow>
          <dt>
            평균 아이템 레벨
            <strong>
              Lv.{(calAverageLevel / characters.length).toFixed(2)}
            </strong>
          </dt>
          <dd>
            <span>
              총<strong>{characters.length}</strong>캐릭
            </span>
            <span>
              딜러<strong>{countDealer}</strong>
            </span>
            <span>
              서폿<strong>{countSupport}</strong>
            </span>
          </dd>
        </TotalRow>
      </Wrapper>

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
          {targetRepresentCharacter?.characterName}으로 대표 캐릭터를
          변경하시겠어요?
        </Modal>
      )}
    </BoxWrapper>
  );
};

export default MainCharacters;

const Wrapper = styled.div`
  display: column;
  width: 100%;
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top: 16px;

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    align-items: center;
  }
`;

const RepresentBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 16px 8px;
  width: 150px;
  border-radius: 10px;
  background: ${({ theme }) => theme.app.semiBlack1};

  em {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.app.black};
    background-size: 500%;
  }

  dl {
    display: flex;
    flex-direction: column;
    align-items: center;

    dt {
      font-weight: 600;
      font-size: 18px;
      color: ${({ theme }) => theme.app.white};
      text-align: center;
    }

    dd {
      margin-top: 2px;
      font-size: 14px;
      color: ${({ theme }) => theme.app.semiBlack3};
      line-height: 1;
    }
  }
`;

const Characters = styled.div`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.app.border};
  padding: 0 12px;
  height: 180px;
  overflow-y: auto;

  ${({ theme }) => theme.medias.max900} {
    flex: unset;
    width: 100%;
    height: 142px;
  }

  ul {
    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 9px 8px;
      border-bottom: 1px dashed ${({ theme }) => theme.app.border};

      ${({ theme }) => theme.medias.max900} {
        padding: 9px 0;
      }

      button {
        ${({ theme }) => theme.medias.max900} {
          display: none;
        }
      }

      &:last-of-type {
        border-bottom: none;
      }

      span {
        &:nth-of-type(1) {
          width: 70px;
          font-size: 13px;
          font-weight: 400;
          color: ${({ theme }) => theme.app.semiBlack3};

          ${({ theme }) => theme.medias.max900} {
            display: none;
          }
        }

        &:nth-of-type(2) {
          width: 75px;
          font-size: 13px;
          font-weight: 400;
          color: ${({ theme }) => theme.app.semiBlack3};
        }

        &:nth-of-type(3) {
          padding-right: 10px;
          width: 160px;
          font-size: 16px;
          color: ${({ theme }) => theme.app.text.main};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &:nth-of-type(4) {
          flex: 1;
          font-size: 18px;
          font-weight: 600;
          color: ${({ theme }) => theme.app.text.main};
          text-align: right;
        }
      }
    }
  }
`;

const TotalRow = styled.dl`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 16px;
  padding: 0 12px;
  font-size: 15px;
  line-height: 1.2;
  color: ${({ theme }) => theme.app.text.dark2};

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    align-items: center;
  }

  strong {
    font-size: 20px;
    font-weight: 700;
  }

  dt {
    display: flex;
    flex-direction: row;
    align-items: center;

    strong {
      margin-left: 8px;
    }
  }

  dd {
    display: flex;
    flex-direction: row;
    color: ${({ theme }) => theme.app.text.light1};

    ${({ theme }) => theme.medias.max900} {
      margin-top: 6px;
      padding-top: 8px;
      border-top: 1px dashed ${({ theme }) => theme.app.border};
    }

    span {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 12px;

      strong {
        margin-left: 6px;
        margin-right: 2px;
      }
    }
  }
`;
