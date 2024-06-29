import styled from "@emotion/styled";
import { Button as MuiButton } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

import * as characterApi from "@core/apis/character.api";
import * as friendApi from "@core/apis/friend.api";
import { loading } from "@core/atoms/loading.atom";
import useModalState from "@core/hooks/useModalState";
import { CharacterType, WeekContnetType } from "@core/types/character";
import { FriendType } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import BoxTitle from "@components/BoxTitle";
import Button, * as ButtonStyledComponents from "@components/Button";
import Modal from "@components/Modal";

import RaidItem from "./RaidItem";
import RaidSortWrap from "./RaidSortWrap";

interface Props {
  character: CharacterType;
  friend?: FriendType;
}

const TodoWeekRaid: FC<Props> = ({ character, friend }) => {
  const queryClient = useQueryClient();
  const setLoadingState = useSetRecoilState(loading);
  const [modalState, setModalState] = useModalState<WeekContnetType[]>();

  const [showSortRaid, setShowSortRaid] = useState(false);
  const [localCharacter, setLocalCharacter] = useState(character);

  useEffect(() => {
    setLocalCharacter(character);
  }, [character, showSortRaid]);

  const saveRaidSort = async () => {
    setLoadingState(true);
    try {
      await characterApi.saveRaidSort(localCharacter);

      toast("레이드 순서 업데이트가 완료되었습니다.");
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
      setShowSortRaid(false);
    } catch (error) {
      console.error("Error saveSort:", error);
    }
    setLoadingState(false);
  };

  const openAddTodoForm = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.setting) {
        toast.warn("권한이 없습니다.");
        setLoadingState(false);

        return;
      }
      try {
        const data = await friendApi.getTodoFormData(friend, character);
        setModalState(data);
      } catch (error) {
        console.log(`openAddTodoFrom error : ${error}`);
      }
    } else {
      try {
        const data = await characterApi.getTodoFormData(
          localCharacter.characterId,
          localCharacter.characterName
        );
        setModalState(data);
      } catch (error) {
        console.log(`openAddTodoFrom error : ${error}`);
      }
    }
    setLoadingState(false);
  };

  const updateGoldCheckVersion = async () => {
    setLoadingState(true);
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateGoldCheckVersion(localCharacter);

        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
        toast(
          `${localCharacter.characterName}의 골드 체크 방식을 변경하였습니다.`
        );
        setModalState();
      } catch (error) {
        console.error("Error updateWeekTodo All:", error);
      }
    }
    setLoadingState(false);
  };

  // 컨텐츠 골드 획득 지정
  const updateWeekGoldCheck = async (
    weekCategory: string,
    updateValue: boolean
  ) => {
    setLoadingState(true);
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateCheckGold(
          localCharacter,
          weekCategory,
          updateValue
        );

        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
        await openAddTodoForm();
      } catch (error) {
        console.log(error);
      }
    }
    setLoadingState(false);
  };

  // 캐릭터 주간 숙제 업데이트(추가/삭제)
  const updateWeekTodo = async (todo: WeekContnetType) => {
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateWeekTodo(localCharacter, todo);

        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
        await openAddTodoForm();
      } catch (error) {
        console.error("Error updateWeekTodo:", error);
      }
    }
  };

  // 캐릭터 주간 숙제 업데이트 All(추가/삭제)
  const updateWeekTodoAll = async (todos: WeekContnetType[]) => {
    setLoadingState(true);
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateWeekTodoAll(localCharacter, todos);

        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
        await openAddTodoForm();
      } catch (error) {
        console.error("Error updateWeekTodo:", error);
      }
    }
    setLoadingState(false);
  };

  // 골드획득 캐릭터 업데이트
  const updateGoldCharacter = async () => {
    setLoadingState(true);
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateGoldCharacter(localCharacter);

        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
        toast(
          `${localCharacter.characterName}의 골드 획득 설정을 변경하였습니다.`
        );
        setModalState();
      } catch (error) {
        console.error("Error updateWeekCheck:", error);
      }
    }
    setLoadingState(false);
  };

  return (
    <>
      <Wrapper>
        {localCharacter.settings.showWeekTodo && (
          <TitleBox>
            <TitleRow>
              <BoxTitle>주간 레이드</BoxTitle>

              <ButtonsBox>
                {showSortRaid ? (
                  <Button onClick={() => saveRaidSort()}>저장</Button>
                ) : (
                  <Button
                    onClick={() => {
                      if (friend) {
                        toast.warn("기능 준비 중입니다.");
                      } else {
                        setShowSortRaid(true);
                      }
                    }}
                  >
                    정렬
                  </Button>
                )}
                <Button onClick={() => openAddTodoForm()}>편집</Button>
              </ButtonsBox>
            </TitleRow>

            {showSortRaid ? (
              <SubTitle>저장 버튼 클릭시 순서가 저장됩니다</SubTitle>
            ) : (
              <SubTitle>마우스 우클릭 시 한번에 체크됩니다</SubTitle>
            )}
          </TitleBox>
        )}

        {showSortRaid ? (
          <RaidSortWrap
            character={localCharacter}
            friend={friend}
            setTodos={(newTodoList) => {
              setLocalCharacter({
                ...localCharacter,
                todoList: newTodoList,
              });
            }}
          />
        ) : (
          localCharacter.todoList.map((todo) => {
            return (
              <RaidItem
                key={todo.id}
                todo={todo}
                character={localCharacter}
                friend={friend}
              />
            );
          })
        )}
      </Wrapper>

      {modalState && (
        <Modal
          title={`${localCharacter.characterName} 주간 숙제 관리`}
          isOpen={!!modalState}
          onClose={() => setModalState()}
        >
          {(() => {
            const todosByCategory: {
              [key: string]: {
                노말: WeekContnetType[];
                하드: WeekContnetType[];
              };
            } = {};
            const todosGoldCheck: { [key: string]: boolean } = {};

            modalState.forEach((todo) => {
              if (!todosByCategory[todo.weekCategory]) {
                todosByCategory[todo.weekCategory] = {
                  노말: [],
                  하드: [],
                };
              }
              if (todo.weekContentCategory === "노말") {
                todosByCategory[todo.weekCategory]["노말"].push(todo);
              } else {
                todosByCategory[todo.weekCategory]["하드"].push(todo);
              }
              if (todosGoldCheck[todo.weekCategory] === undefined) {
                todosGoldCheck[todo.weekCategory] = todo.goldCheck;
              } else {
                todosGoldCheck[todo.weekCategory] =
                  todosGoldCheck[todo.weekCategory] || todo.goldCheck;
              }
            });

            const content = Object.entries(todosByCategory).map(
              ([weekCategory, todos], index) => {
                return (
                  <ContentWrapper key={index}>
                    <CategoryRow>
                      <p>{weekCategory}</p>

                      {localCharacter.settings.goldCheckVersion &&
                        (todosGoldCheck[weekCategory] ? (
                          <GetGoldButton
                            type="button"
                            onClick={() =>
                              updateWeekGoldCheck(
                                weekCategory,
                                !todosGoldCheck[weekCategory]
                              )
                            }
                          >
                            골드 획득 지정 해제
                          </GetGoldButton>
                        ) : (
                          <GetGoldButton
                            type="button"
                            isActive
                            onClick={() =>
                              updateWeekGoldCheck(
                                weekCategory,
                                !todosGoldCheck[weekCategory]
                              )
                            }
                          >
                            골드 획득 지정
                          </GetGoldButton>
                        ))}
                    </CategoryRow>

                    <Difficulty>
                      {Object.entries(todos).map(
                        ([weekContentCategory, todo], todoIndex) =>
                          todo.length > 0 && (
                            <GatewayButtons key={todoIndex}>
                              <GatewayHeadButotn
                                key={todoIndex}
                                type="button"
                                onClick={() => updateWeekTodoAll(todo)}
                                isActive={
                                  todo.reduce(
                                    (count, todoItem) =>
                                      count + (todoItem.checked ? 1 : 0),
                                    0
                                  ) === todo.length
                                }
                              >
                                <p>
                                  <strong>{weekContentCategory}</strong>
                                  {todo.reduce(
                                    (sum, todoItem) => sum + todoItem.gold,
                                    0
                                  )}
                                  G
                                </p>
                              </GatewayHeadButotn>
                              {todo.map((todoItem) => (
                                <GatewayButton
                                  key={todoItem.id}
                                  type="button"
                                  isActive={todoItem.checked}
                                  onClick={() => updateWeekTodo(todoItem)}
                                >
                                  <p>
                                    <strong>{todoItem.gate}관문</strong>
                                    {todoItem.gold}G
                                  </p>
                                </GatewayButton>
                              ))}
                            </GatewayButtons>
                          )
                      )}
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
                    onClick={() => updateGoldCharacter()}
                    style={{ cursor: "pointer" }}
                  >
                    골드 획득 캐릭터 지정{" "}
                    {localCharacter.goldCharacter ? "해제" : ""}
                  </MuiButton>
                  <MuiButton
                    variant="contained"
                    onClick={() => updateGoldCheckVersion()}
                    style={{ cursor: "pointer" }}
                  >
                    골드 획득 체크 방식 :{" "}
                    {localCharacter.settings.goldCheckVersion
                      ? "체크 방식"
                      : "상위 3개"}
                  </MuiButton>
                </ModalButtonsWrapper>

                {content}
              </>
            );
          })()}
        </Modal>
      )}
    </>
  );
};

export default TodoWeekRaid;

const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.app.bg.light};
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }
`;

const ButtonsBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;

  ${ButtonStyledComponents.Wrapper} {
    padding: 0 9px;
    font-size: 13px;
    line-height: 23px;
  }
`;

const SubTitle = styled.p`
  color: ${({ theme }) => theme.app.text.dark2};
  font-size: 12px;
`;

const ModalButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 10px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 20px;
`;

const CategoryRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
`;

const GetGoldButton = styled.button<{ isActive?: boolean }>`
  position: relative;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1;
  color: ${({ theme }) => theme.app.text.main};
  overflow: hidden;

  &:hover::before {
    opacity: 1;
  }

  &::before {
    z-index: -1;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ isActive, theme }) =>
      isActive ? theme.app.gold : theme.app.blue3};
    opacity: 0.5;
  }
`;

const Difficulty = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const GatewayButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  & > button {
    flex: 1;
    padding: 5px 0;
    margin-left: -1px;
  }
`;

const GatewayHeadButotn = styled.button<{ isActive?: boolean }>`
  z-index: ${({ isActive }) => (isActive ? 1 : "unset")};
  background: ${({ isActive, theme }) =>
    isActive ? theme.app.blue3 : theme.app.bar.red};
  border: 1px solid
    ${({ isActive, theme }) =>
      isActive ? theme.app.text.black : theme.app.border};
  color: ${({ theme }) => theme.app.semiBlack1};

  p {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    line-height: 1.2;

    strong {
      font-size: 14px;
      font-weight: ${({ isActive }) => (isActive ? 700 : "unset")};
    }
  }
`;

const GatewayButton = styled.button<{ isActive?: boolean }>`
  z-index: ${({ isActive }) => (isActive ? 1 : "unset")};
  border: 1px solid
    ${({ isActive, theme }) =>
      isActive ? theme.app.text.black : theme.app.border};
  color: ${({ theme }) => theme.app.text.dark2};

  p {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    line-height: 1.2;

    strong {
      font-size: 14px;
      font-weight: ${({ isActive }) => (isActive ? 700 : "unset")};
    }
  }
`;
