import { Button as MuiButton } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
<<<<<<< HEAD
import { useEffect } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> origin/main
import { toast } from "react-toastify";
import styled from "styled-components";

import {
  useToggleGoldCharacter,
  useToggleGoldRaid,
  useToggleGoldVersion,
  useUpdateRaidBusGold,
  useUpdateRaidTodo,
} from "@core/hooks/mutations/todo";
import { useAvailableRaids } from "@core/hooks/queries/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character, WeeklyRaid } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import type { WeekContentCategory } from "@core/types/lostark";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Modal from "@components/Modal";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  character: Character;
  friend?: Friend;
}

const EditModal = ({ onClose, isOpen, character, friend }: Props) => {
<<<<<<< HEAD
  const queryClient = useQueryClient();
=======
  const [todoUpdateGold, setTodoUpdateGold] = useState<{
    [key: string]: boolean;
  }>({});

  const [busGold, setBusGold] = useState<{
    [key: string]: number;
  }>({});
>>>>>>> origin/main

  // 모달 내부 데이터
  const getAvailableRaids = useAvailableRaids(
    {
      friendUsername: friend?.friendUsername,
      characterId: character.characterId,
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

  // 버스비 업데이트
  const queryClient = useQueryClient();
  const updateRaidBusGold = useUpdateRaidBusGold({
    onSuccess: (character, { friendUsername, weekCategory }) => {
      if (friendUsername) {
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getFriends(),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
      }

      toast.success(
        `${character.characterName}의 ${weekCategory} 버스비가 업데이트되었습니다.`
      );
      setTodoUpdateGold((prev) => ({
        ...prev,
        [weekCategory]: false,
      }));
    },
  });

  getAvailableRaids.data?.forEach((todo) => {
    if (todoUpdateGold[todo.weekCategory] === undefined) {
      // 초기 상태 설정
      setTodoUpdateGold((prev) => ({
        ...prev,
        [todo.weekCategory]: false,
      }));

      // busGold 상태를 올바르게 설정
      setBusGold((prev) => ({
        ...prev,
        [todo.weekCategory]: todo.busGold,
      }));
    }
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
                  <div>
                    <Container>
                      <CategoryTitle>{weekCategory}</CategoryTitle>
                      <BusGoldContainer>
                        <BusFeeTitle>버스비</BusFeeTitle>
                        {todoUpdateGold[weekCategory] ? (
                          <InputContainer>
                            <StyledInput
                              type="text"
                              placeholder="버스비 입력"
                              value={`${busGold[weekCategory].toLocaleString()}`}
                              onChange={(e) => {
                                const value = e.target.value.replace(/,/g, "");
                                if (!Number.isNaN(Number(value))) {
                                  setBusGold((prev) => ({
                                    ...prev,
                                    [weekCategory]: Number(value),
                                  }));
                                }
                              }}
                              onWheel={(e) => e.preventDefault()}
                            />
                            <StyledButton
                              type="button"
                              variant="contained"
                              size="large"
                              onClick={() => {
                                updateRaidBusGold.mutate({
                                  friendUsername: friend?.friendUsername,
                                  characterId: character.characterId,
                                  weekCategory,
                                  busGold: busGold[weekCategory],
                                });
                              }}
                            >
                              저장
                            </StyledButton>
                          </InputContainer>
                        ) : (
                          <ButtonContainer>
                            <GoldText>{busGold[weekCategory]} 골드</GoldText>
                            <StyledButton
                              onClick={() => {
                                setTodoUpdateGold((prev) => ({
                                  ...prev,
                                  [weekCategory]: true,
                                }));
                              }}
                            >
                              수정
                            </StyledButton>
                          </ButtonContainer>
                        )}
                      </BusGoldContainer>
                      {todoUpdateGold[weekCategory] && (
                        <div>
                          <ul>
                            <li>입력한 숫자만큼 골드에 합산됩니다.</li>
                            <li>음수를 입력하고 싶으신경우(버스를 탔을때),</li>
                            <li>숫자를 입력 후 앞에 - 를 입력하시면 됩니다.</li>
                          </ul>
                        </div>
                      )}
                    </Container>
                  </div>

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const CategoryTitle = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-left: 3px;
`;

const BusGoldContainer = styled.p`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BusFeeTitle = styled.p`
  font-size: 14px;
  display: inline-block;
  background: ${({ theme }) => theme.app.palette.yellow[300]};
  padding: 2px 4px;
  border-radius: 4px;
  align-item: center;
  margin-right: 3px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledInput = styled.input`
  padding: 1px 4px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;
  font-size: 15px;
  width: 100px;
  color: ${({ theme }) => theme.app.text.black};
  background: ${({ theme }) => theme.app.bg.gray1};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.app.border};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledButton = styled(Button)`
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 4px;
`;

const GoldText = styled.p`
  font-size: 16px;
  margin: 0;
`;
