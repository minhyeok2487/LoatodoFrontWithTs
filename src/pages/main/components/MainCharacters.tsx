import { useQueryClient } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import useUpdateMainCharacter from "@core/hooks/mutations/member/useUpdateMainCharacter";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import useModalState from "@core/hooks/useModalState";
import type { Character } from "@core/types/character";
import { getIsDealer, getIsSpecialist } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Modal from "@components/Modal";

import BoxWrapper from "./BoxWrapper";

interface Props {
  characters: Character[];
}

const MainCharacters: FC<Props> = ({ characters }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const [targetRepresentCharacter, toggleTargetRepresentCharacter] =
    useModalState<Character>();

  const getMyInformation = useMyInformation();
  const updateMainCharacter = useUpdateMainCharacter({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getMyInformation(),
      });

      toggleTargetRepresentCharacter();
    },
  });

  const mainCharacter = getMyInformation.data?.mainCharacter;

  const isMainCharacter = (characterName: string): boolean => {
    return characterName === mainCharacter?.characterName;
  };

  if (characters.length === 0 || !getMyInformation.data) {
    return null;
  }

  const calAverageLevel = characters.reduce((acc, character) => {
    return acc + character.itemLevel;
  }, 0);

  const countDealer = characters.reduce((acc, character) => {
    return getIsDealer(character.characterClassName) ? acc + 1 : acc;
  }, 0);

  const countSupport = characters.reduce((acc, character) => {
    return !getIsDealer(character.characterClassName) ? acc + 1 : acc;
  }, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed) {
      navigate(`/character-profile?name=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <BoxWrapper $flex={2}>
      <Header>
        <Title>내 캐릭터</Title>
        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchInput
            type="text"
            placeholder="전투정보실 검색"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <SearchButton type="submit">검색</SearchButton>
        </SearchForm>
      </Header>
      <Wrapper>
        <Body>
          {mainCharacter && (
            <RepresentBox>
              {mainCharacter.characterClassName && (
                <em
                  style={{
                    backgroundImage:
                      mainCharacter.characterImage !== null
                        ? `url(${mainCharacter.characterImage})`
                        : "",
                    backgroundPosition: getIsSpecialist(
                      mainCharacter.characterClassName
                    )
                      ? "50% 32%"
                      : "50% 15%",
                  }}
                />
              )}

              <dl>
                <dt>{mainCharacter.characterName}</dt>
                <dd>Lv. {mainCharacter.itemLevel}</dd>
                <dd>
                  @{mainCharacter.serverName} {mainCharacter.characterClassName}
                </dd>
              </dl>
            </RepresentBox>
          )}

          <Characters>
            <ul>
              {characters.map((character, index) => (
                <li key={index}>
                  <span>@{character.serverName}</span>
                  <span>{character.characterClassName}</span>
                  <span>{character.characterName}</span>
                  {!isMainCharacter(character.characterName) && (
                    <Button
                      variant="outlined"
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
                updateMainCharacter.mutate({
                  mainCharacter: targetRepresentCharacter.characterName,
                }),
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

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h2`
  text-align: left;
  font-size: 20px;
  color: ${({ theme }) => theme.app.text.dark2};
  font-weight: 700;
  white-space: nowrap;
  margin: 0;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SearchInput = styled.input`
  width: 140px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.main};
  color: ${({ theme }) => theme.app.text.dark1};
  font-size: 12px;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }

  &:focus {
    border-color: ${({ theme }) => theme.app.text.dark2};
  }
`;

const SearchButton = styled.button`
  padding: 5px 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.app.bg.reverse};
  color: ${({ theme }) => theme.app.text.reverse};
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top: 16px;

  ${({ theme }) => theme.medias.max1280} {
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
  background: ${({ theme }) => theme.app.palette.gray[800]};

  em {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.app.palette.gray[1000]};
    background-size: 500%;
  }

  dl {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    margin-top: 5px;

    dt {
      font-weight: 600;
      font-size: 16px;
      color: ${({ theme }) => theme.app.palette.gray[0]};
      text-align: center;
    }

    dd {
      margin-top: 2px;
      font-size: 12px;
      color: ${({ theme }) => theme.app.palette.gray[400]};
      line-height: 1;
    }
  }
`;

const Characters = styled.div`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.app.border};
  padding: 0 12px;
  height: 200px;
  overflow-y: auto;

  ${({ theme }) => theme.medias.max1280} {
    flex: unset;
    width: 100%;
  }

  ${({ theme }) => theme.medias.max768} {
    height: 142px;
  }

  ul {
    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 9px 8px;
      border-bottom: 1px dashed ${({ theme }) => theme.app.border};
      font-size: 13px;

      ${({ theme }) => theme.medias.max768} {
        padding: 9px 0;
      }

      &:last-of-type {
        border-bottom: none;
      }

      & > span {
        &:nth-of-type(1) {
          width: 70px;
          font-weight: 400;
          color: ${({ theme }) => theme.app.palette.gray[400]};

          ${({ theme }) => theme.medias.max768} {
            display: none;
          }
        }

        &:nth-of-type(2) {
          width: 75px;
          font-weight: 400;
          color: ${({ theme }) => theme.app.palette.gray[400]};

          ${({ theme }) => theme.medias.max768} {
            display: none;
          }
        }

        &:nth-of-type(3) {
          padding-right: 10px;
          flex: 1;
          color: ${({ theme }) => theme.app.text.main};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &:nth-of-type(4) {
          width: 80px;
          font-weight: 600;
          color: ${({ theme }) => theme.app.text.main};
          text-align: right;

          ${({ theme }) => theme.medias.max500} {
            white-space: nowrap;
          }
        }
      }

      button {
        margin-left: 8px;
        margin-right: 8px;
        padding: 4px 10px;
        font-size: 12px;
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
  font-size: 13px;
  line-height: 1.2;
  color: ${({ theme }) => theme.app.text.dark2};

  ${({ theme }) => theme.medias.max768} {
    flex-direction: column;
    align-items: center;
  }

  strong {
    font-size: 18px;
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

    ${({ theme }) => theme.medias.max768} {
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
        color: ${({ theme }) => theme.app.text.dark2};
      }
    }
  }
`;
