import { Button as MuiButton } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import styled from "styled-components";

import useToggleCharacterGoldCheckVersion from "@core/hooks/mutations/character/useToggleCharacterGoldCheckVersion";
import useToggleOptainableGoldCharacter from "@core/hooks/mutations/character/useToggleOptainableGoldCharacter";
import useToggleOptainableGoldRaid from "@core/hooks/mutations/character/useToggleOptainableGoldRaid";
import useUpdateTodoRaid from "@core/hooks/mutations/character/useUpdateTodoRaid";
import useUpdateTodoRaidList from "@core/hooks/mutations/character/useUpdateTodoRaidList";
import useAvailableWeeklyRaids from "@core/hooks/queries/character/useAvailableWeeklyRaids";
import useAvailableFriendWeeklyRaids from "@core/hooks/queries/friend/useAvailableFriendWeeklyRaids";
import type { Character, WeeklyRaid } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import type { WeekContentCategory } from "@core/types/lostark";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Modal from "@components/Modal";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  character: Character;
  friend?: Friend;
}

const EditModal = ({ onClose, isOpen, character, friend }: Props) => {
  const queryClient = useQueryClient();

  // 모달 내부 데이터
  const getAvailableWeeklyRaids = useAvailableWeeklyRaids(
    {
      characterId: character.characterId,
      characterName: character.characterName,
    },
    { enabled: isOpen && !friend }
  );
  const getAvailableFriendWeeklyRaids = useAvailableFriendWeeklyRaids(
    {
      characterId: character.characterId,
      friendUsername: friend?.friendUsername as string,
    },
    { enabled: isOpen && !!friend }
  );
  const targetData = friend
    ? getAvailableFriendWeeklyRaids
    : getAvailableWeeklyRaids;

  // 내 캐릭터 골드 획득 설정
  const toggleOptainableGoldCharacter = useToggleOptainableGoldCharacter({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
      toast.success(
        `${character.characterName}의 골드 획득 설정을 변경하였습니다.`
      );
      onClose();
    },
  });
  // 내 캐릭터 골드 획득 방식 설정
  const toggleCharacterGoldCheckVersion = useToggleCharacterGoldCheckVersion({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
      toast.success(
        `${character.characterName}의 골드 체크 방식을 변경하였습니다.`
      );
      onClose();
    },
  });
  // 내 캐릭터 골드 획득 가능 레이드 지정
  const toggleOptaiableGoldRaid = useToggleOptainableGoldRaid({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });

      invalidateData();
    },
  });
  // 내 캐릭터 레이드 관문 단위 추가
  const updateTodoRaid = useUpdateTodoRaid({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });

      invalidateData();
    },
  });
  // 내 캐릭터 레이드 관문 목록 추가
  const updateTodoRaidList = useUpdateTodoRaidList({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });

      invalidateData();
    },
  });
  // ------------ hooks end

  // 골드 획득 캐릭터 지정
  const handleToggleOptainableGoldCharacter = () => {
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      toggleOptainableGoldCharacter.mutate({
        characterId: character.characterId,
        characterName: character.characterName,
      });
    }
  };
  // 골드 체크 방식
  const handleToggleGoldCheckVersion = () => {
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      toggleCharacterGoldCheckVersion.mutate({
        characterId: character.characterId,
        characterName: character.characterName,
      });
    }
  };
  // 레이드 골드 획득 지정
  const handleToggleOptainableGoldRaid = (
    weekCategory: string,
    updateValue: boolean
  ) => {
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      toggleOptaiableGoldRaid.mutate({
        characterId: character.characterId,
        characterName: character.characterName,
        weekCategory,
        updateValue,
      });
    }
  };
  // 캐릭터 주간 숙제 업데이트(추가/삭제)
  const updateWeekTodo = (todo: WeeklyRaid) => {
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      updateTodoRaid.mutate({
        characterId: character.characterId,
        characterName: character.characterName,
        raid: todo,
      });
    }
  };
  // 캐릭터 주간 숙제 업데이트 All(추가/삭제)
  const updateWeekTodoAll = (todos: WeeklyRaid[]) => {
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      updateTodoRaidList.mutate({
        characterId: character.characterId,
        characterName: character.characterName,
        raids: todos,
      });
    }
  };
  // 모달이 닫히는 콜백이 아닌 경우 이 함수를 통해서 모달 데이터를 갱신해야 함
  const invalidateData = () => {
    if (friend) {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getAvailableFriendWeeklyRaids({
          characterId: character.characterId,
          friendUsername: friend.friendUsername,
        }),
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getAvailableWeeklyRaids({
          characterId: character.characterId,
          characterName: character.characterName,
        }),
      });
    }
  };

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

        targetData.data?.forEach((todo) => {
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

                  {character.settings.goldCheckVersion &&
                    (todosGoldCheck[weekCategory] ? (
                      <GetGoldButton
                        type="button"
                        onClick={() =>
                          handleToggleOptainableGoldRaid(
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
                        $isActive
                        onClick={() =>
                          handleToggleOptainableGoldRaid(
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
                            onClick={() => updateWeekTodoAll(todo)}
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
                              onClick={() => updateWeekTodo(todoItem)}
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
                onClick={handleToggleOptainableGoldCharacter}
              >
                💰 골드 획득 캐릭터 지정 {character.goldCharacter ? "해제" : ""}
              </MuiButton>
              <MuiButton
                variant="contained"
                size="small"
                onClick={handleToggleGoldCheckVersion}
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
    background: ${({ theme }) => theme.app.bg.light};
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
  color: #444;
  overflow: hidden;
  padding: 5px 6px;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.app.gold : theme.app.gray3};
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
    $isActive ? theme.app.bg.light : theme.app.bg.gray1};
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
    $isActive ? theme.app.bg.light : theme.app.bg.gray1};
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
