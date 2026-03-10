import { Button as MuiButton } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  useToggleGoldCharacter,
  useToggleGoldRaid,
  useToggleGoldVersion,
  useUpdateRaidBusGold,
  useUpdateRaidTodo,
} from "@core/hooks/mutations/todo";
import { useAvailableRaids } from "@core/hooks/queries/todo";
import useWeekContentCategories from "@core/hooks/queries/content/useWeekContentCategories";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character, WeeklyRaid } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Modal from "@components/Modal";

import {
  BusFeeTitle,
  BusGoldContainer,
  ButtonContainer,
  CategoryRow,
  CategoryTitle,
  CharacterGoldBadge,
  CheckboxContainer,
  Container,
  ContentWrapper,
  Difficulty,
  GatewayButton,
  GatewayButtons,
  GatewayHeadButton,
  GetGoldButton,
  GoldDisplay,
  GoldText,
  InputContainer,
  ModalButtonsWrapper,
  StyledButton,
  StyledInput,
} from "./EditModal.styles";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  character: Character;
  friend?: Friend;
}

const EditModal = ({ onClose, isOpen, character, friend }: Props) => {
  const [todoUpdateGold, setTodoUpdateGold] = useState<{
    [key: string]: boolean;
  }>({});

  const [busGold, setBusGold] = useState<{
    [key: string]: number;
  }>({});

  const [busGoldFixed, setBusGoldFixed] = useState<{
    [key: string]: boolean;
  }>({});

  // 카테고리 메타데이터
  const weekContentCategories = useWeekContentCategories();

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

      setBusGoldFixed((prev) => ({
        ...prev,
        [todo.weekCategory]: todo.busGoldFixed,
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
            [key: string]: WeeklyRaid[];
          };
        } = {};
        const todosGoldCheck: { [key: string]: boolean } = {};

        // 카테고리 메타데이터로 색상/표시이름 lookup 맵 생성
        const categoryColorMap: { [key: string]: string } = {};
        const categoryDisplayMap: { [key: string]: string } = {};
        weekContentCategories.data?.forEach((cat) => {
          categoryColorMap[cat.name] = cat.color;
          categoryDisplayMap[cat.name] = cat.displayName;
        });

        getAvailableRaids.data?.forEach((todo) => {
          if (!todosByCategory[todo.weekCategory]) {
            // API에서 받은 카테고리로 동적 초기화
            const emptyCategories: { [key: string]: WeeklyRaid[] } = {};
            weekContentCategories.data?.forEach((cat) => {
              emptyCategories[cat.name] = [];
            });
            todosByCategory[todo.weekCategory] = emptyCategories;
          }
          // 해당 카테고리에 직접 push (if/else 분기 제거)
          if (Array.isArray(todosByCategory[todo.weekCategory][todo.weekContentCategory])) {
            todosByCategory[todo.weekCategory][todo.weekContentCategory].push(todo);
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
                              value={
                                busGold[weekCategory] === 0
                                  ? ""
                                  : `${busGold[weekCategory].toLocaleString()}`
                              }
                              onChange={(e) => {
                                const value = e.target.value.replace(/,/g, "");
                                if (value === "") {
                                  setBusGold((prev) => ({
                                    ...prev,
                                    [weekCategory]: 0,
                                  }));
                                } else if (!Number.isNaN(Number(value))) {
                                  setBusGold((prev) => ({
                                    ...prev,
                                    [weekCategory]: Number(value),
                                  }));
                                }
                              }}
                              onWheel={(e) => e.preventDefault()}
                            />
                            <CheckboxContainer>
                              <label htmlFor={`fixed-${weekCategory}`}>
                                <input
                                  id={`fixed-${weekCategory}`}
                                  type="checkbox"
                                  checked={busGoldFixed[weekCategory] || false}
                                  onChange={(e) => {
                                    setBusGoldFixed((prev) => ({
                                      ...prev,
                                      [weekCategory]: e.target.checked,
                                    }));
                                  }}
                                />
                                <span>고정</span>
                              </label>
                            </CheckboxContainer>
                            <StyledButton
                              type="button"
                              variant="contained"
                              size="medium"
                              onClick={() => {
                                updateRaidBusGold.mutate({
                                  friendUsername: friend?.friendUsername,
                                  characterId: character.characterId,
                                  weekCategory,
                                  busGold: busGold[weekCategory],
                                  fixed: busGoldFixed[weekCategory] || false,
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

                      // 헤더에 표시할 총 골드 계산 (일반 골드 + 캐릭터 귀속 골드)
                      const totalGold = todo.reduce(
                        (sum, todoItem) => sum + todoItem.gold,
                        0
                      );
                      const totalCharacterGold = todo.reduce(
                        (sum, todoItem) => sum + (todoItem.characterGold || 0),
                        0
                      );

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
                            $color={categoryColorMap[weekContentCategory] || "main"}
                            $isActive={isAllChecked}
                          >
                            <p>
                              <strong>{categoryDisplayMap[weekContentCategory] || weekContentCategory}</strong>
                              <GoldDisplay>
                                {totalGold}G
                                {totalCharacterGold > 0 && (
                                  <CharacterGoldBadge>
                                    +{totalCharacterGold}G
                                  </CharacterGoldBadge>
                                )}
                              </GoldDisplay>
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
                                <GoldDisplay>
                                  {todoItem.gold}G
                                  {todoItem.characterGold > 0 && (
                                    <CharacterGoldBadge>
                                      +{todoItem.characterGold}G
                                    </CharacterGoldBadge>
                                  )}
                                </GoldDisplay>
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
