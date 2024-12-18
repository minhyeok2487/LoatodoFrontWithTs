import { Button as MuiButton } from "@mui/material";
import { useEffect } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import {
  useToggleGoldCharacter,
  useToggleGoldRaid,
  useToggleGoldVersion,
  useUpdateRaidTodo,
} from "@core/hooks/mutations/todo";
import { useAvailableRaids } from "@core/hooks/queries/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character, WeeklyRaid } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import type { WeekContentCategory } from "@core/types/lostark";

import Modal from "@components/Modal";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  character: Character;
  friend?: Friend;
}

const EditModal = ({ onClose, isOpen, character, friend }: Props) => {
  // 모달 내부 데이터
  const getAvailableRaids = useAvailableRaids(
    {
      friendUsername: friend?.friendUsername,
      characterId: character.characterId,
      characterName: character.characterName,
    },
    {
      enabled: isOpen,
    }
  );

  // 캐릭터 골드 획득 설정
  const toggleGoldCharacter = useToggleGoldCharacter({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });

      toast.success(
        `${character.characterName}의 골드 획득 설정을 변경하였습니다.`
      );
    },
  });
  // 캐릭터 골드 획득 방식 설정
  const toggleGoldVersion = useToggleGoldVersion({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });

      toast.success(
        `${character.characterName}의 골드 체크 방식을 변경하였습니다.`
      );
    },
  });
  // 캐릭터 골드 획득 가능 레이드 지정
  const toggleGoldRaid = useToggleGoldRaid({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });

      getAvailableRaids.refetch();
    },
  });
  // 레이드 업데이트
  const updateRaidTodo = useUpdateRaidTodo({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });

      getAvailableRaids.refetch();
    },
  });

  useEffect(() => {
    if (getAvailableRaids.isError) {
      onClose();
    }
  }, [getAvailableRaids.isError]);

  if (getAvailableRaids.isLoading) {
    return null;
  }
  return (
    <Modal
      title={`${character.characterName} 주간 숙제 관리`}
      isOpen={isOpen}
      onClose={onClose}
    >
      {(() => {
        const todosByCategory: {
          [key: string]: {
            [key in WeekContentCategory]: WeeklyRaid[];
          };
        } = {};
        const todosGoldCheck: { [key: string]: boolean } = {};

        getAvailableRaids.data?.forEach((todo) => {
          if (!todosByCategory[todo.weekCategory]) {
            todosByCategory[todo.weekCategory] = {
              싱글: [],
              노말: [],
              하드: [],
            };
          }
          if (todo.weekContentCategory === "노말") {
            todosByCategory[todo.weekCategory]["노말"].push(todo);
          } else if (todo.weekContentCategory === "하드") {
            todosByCategory[todo.weekCategory]["하드"].push(todo);
          } else {
            todosByCategory[todo.weekCategory]["싱글"].push(todo);
          }
          if (todosGoldCheck[todo.weekCategory] === undefined) {
            todosGoldCheck[todo.weekCategory] = todo.goldCheck;
          } else {
            todosGoldCheck[todo.weekCategory] =
              todosGoldCheck[todo.weekCategory] || todo.goldCheck;
          }
        });

        const content = Object.entries(todosByCategory).map(
          ([weekCategory, todos]) => {
            return (
              <ContentWrapper key={weekCategory}>
                <CategoryRow>
                  <p>{weekCategory}</p>

                  {character.settings.goldCheckVersion && (
                    <GetGoldButton
                      type="button"
                      $isActive={todosGoldCheck[weekCategory]}
                      onClick={() => {
                        toggleGoldRaid.mutate({
                          friendUsername: friend?.friendUsername,
                          characterId: character.characterId,
                          weekCategory,
                          updateValue: !todosGoldCheck[weekCategory],
                        });
                      }}
                    >
                      골드 획득 지정
                      {todosGoldCheck[weekCategory] ? " 해제" : ""}
                    </GetGoldButton>
                  )}
                </CategoryRow>

                <Difficulty>
                  {Object.entries(todos)
                    .filter(([_, todo]) => todo.length > 0)
                    .map(([weekContentCategory, todo], todoIndex) => {
                      const isAllChecked =
                        todo.reduce(
                          (count, todoItem) =>
                            count + (todoItem.checked ? 1 : 0),
                          0
                        ) === todo.length;
                      const sortedTodo = [...todo];
                      sortedTodo.sort((a, b) => a.gate - b.gate);

                      return (
                        <GatewayButtons key={todoIndex}>
                          <GatewayHeadButton
                            key={todoIndex}
                            type="button"
                            onClick={() => {
                              updateRaidTodo.mutate({
                                friendUsername: friend?.friendUsername,
                                characterId: character.characterId,
                                weekContentIdList: todo.map((todo) => todo.id),
                              });
                            }}
                            $difficulty={
                              weekContentCategory as WeekContentCategory
                            }
                            $isActive={isAllChecked}
                          >
                            <p>
                              <strong>{weekContentCategory}</strong>
                              {todo.reduce(
                                (sum, todoItem) => sum + todoItem.gold,
                                0
                              )}
                              G
                            </p>
                          </GatewayHeadButton>
                          {sortedTodo.map((todoItem) => (
                            <GatewayButton
                              key={todoItem.id}
                              type="button"
                              $isActive={todoItem.checked && !isAllChecked}
                              onClick={() => {
                                updateRaidTodo.mutate({
                                  friendUsername: friend?.friendUsername,
                                  characterId: character.characterId,
                                  weekContentIdList: [todoItem.id],
                                });
                              }}
                            >
                              <p>
                                <strong>{todoItem.gate}관문</strong>
                                {todoItem.gold}G
                              </p>
                            </GatewayButton>
                          ))}
                        </GatewayButtons>
                      );
                    })}
                </Difficulty>
              </ContentWrapper>
            );
          }
        );

        return (
          <>
            <ModalButtonsWrapper>
              <MuiButton
                variant="contained"
                size="small"
                onClick={() => {
                  toggleGoldCharacter.mutate({
                    friendUsername: friend?.friendUsername,
                    characterId: character.characterId,
                    characterName: character.characterName,
                  });
                }}
              >
                💰 골드 획득 캐릭터 지정 {character.goldCharacter ? "해제" : ""}
              </MuiButton>
              <MuiButton
                variant="contained"
                size="small"
                onClick={() => {
                  toggleGoldVersion.mutate({
                    friendUsername: friend?.friendUsername,
                    characterId: character.characterId,
                  });
                }}
              >
                ⚖ 골드 획득 우선 방식 :{" "}
                {character.settings.goldCheckVersion
                  ? "각각 지정"
                  : "상위 3개 우선"}
              </MuiButton>
            </ModalButtonsWrapper>

            {content}
          </>
        );
      })()}
    </Modal>
  );
};

export default EditModal;

const ModalButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 6px;
  padding: 0 16px;

  button {
    box-shadow: none;
    background: ${({ theme }) => theme.app.bg.white};
    border: 1px solid ${({ theme }) => theme.app.border};
    color: ${({ theme }) => theme.app.text.main};
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;

    &:hover {
      box-shadow: none;
      background: ${({ theme }) => theme.app.bg.main};
    }
  }

  ${({ theme }) => theme.medias.max500} {
    flex-direction: column;
    padding: 0;
  }
`;

const ContentWrapper = styled.div`
  border-top: 1px dashed ${({ theme }) => theme.app.border};
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 14px;
  padding-top: 14px;
  font-size: 16px;
  p {
    font-weight: 600;
  }
`;

const CategoryRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
`;

const GetGoldButton = styled.button<{ $isActive?: boolean }>`
  position: relative;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  color: ${({ theme }) => theme.app.palette.gray[700]};
  overflow: hidden;
  padding: 5px 6px;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.app.palette.yellow[350] : theme.app.palette.gray[150]};
`;

const Difficulty = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const GatewayButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 10px;

  & > button {
    flex: 1;
    padding: 8px 0;
  }
`;

const GatewayHeadButton = styled.button<{
  $isActive?: boolean;
  $difficulty: WeekContentCategory;
}>`
  z-index: ${({ $isActive }) => ($isActive ? 1 : "unset")};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.app.bg.white : theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.light2};
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.app.text.main : theme.app.bg.gray1};
  border-radius: 10px;

  p {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;

    strong {
      font-size: 14px;
      font-weight: ${({ $isActive }) => ($isActive ? 600 : "unset")};
      color: ${({ $difficulty, theme }) =>
        (() => {
          switch ($difficulty) {
            case "하드":
              return theme.app.text.red;
            case "노말":
              return theme.app.text.blue;
            default:
              return theme.app.text.main;
          }
        })()};
    }
  }
`;

const GatewayButton = styled.button<{ $isActive?: boolean }>`
  z-index: ${({ $isActive }) => ($isActive ? 1 : "unset")};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.app.bg.white : theme.app.bg.gray1};
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.app.text.main : theme.app.bg.gray1};
  box-shadow: ${({ $isActive }) =>
    $isActive ? "0 0 10px rgba(0, 0, 0, 0.1)" : "unset"};

  color: ${({ theme }) => theme.app.text.light2};
  border-radius: 10px;

  p {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;

    strong {
      font-size: 14px;
      font-weight: ${({ $isActive }) => ($isActive ? 600 : "unset")};
      color: ${({ $isActive, theme }) =>
        $isActive ? theme.app.text.dark1 : theme.app.text.dark2};
    }
  }
`;
