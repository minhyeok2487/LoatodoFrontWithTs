import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { IoTrashOutline } from "@react-icons/all-files/io5/IoTrashOutline";
import { MdSave } from "@react-icons/all-files/md/MdSave";
import { RiMoreFill } from "@react-icons/all-files/ri/RiMoreFill";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled, { css, useTheme } from "styled-components";

import useUpdateWeeklyTodo from "@core/hooks/mutations/character/useUpdateWeeklyTodo";
import useAddCustomTodo from "@core/hooks/mutations/customTodo/useAddCustomTodo";
import useCheckCustomTodo from "@core/hooks/mutations/customTodo/useCheckCustomTodo";
import useRemoveCustomTodo from "@core/hooks/mutations/customTodo/useRemoveCustomTodo";
import useUpdateFriendWeeklyTodo from "@core/hooks/mutations/friend/useUpdateFriendWeeklyTodo";
import useCustomTodos from "@core/hooks/queries/customTodo/useCustomTodos";
import useModalState from "@core/hooks/useModalState";
import type { UpdateWeeklyTodoAction } from "@core/types/api";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import BoxTitle from "@components/BoxTitle";
import Button from "@components/Button";
import CubeRewardsModal from "@components/CubeRewardsModal";

import Check, * as CheckStyledComponents from "./button/Check";
import MultilineInput from "./element/MultilineInput";

interface Props {
  character: Character;
  friend?: Friend;
}

const WeeklyContents = ({ character, friend }: Props) => {
  const addCustomTodoInputRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [modalState, setModalState] = useModalState();
  const [addCustomTodoMode, setAddCustomTodoMode] = useState(false);

  const customTodos = useCustomTodos({
    enabled: !friend, // 깐부의 커스텀 숙제는 아직 지원하지 않음
  });

  const updateWeeklyTodo = useUpdateWeeklyTodo({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
    },
  });
  const checkCustomTodo = useCheckCustomTodo({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCustomTodos(),
      });
    },
  });
  const removeCustomTodo = useRemoveCustomTodo({
    onSuccess: () => {
      toast.success("커스텀 주간 숙제가 삭제되었습니다.");

      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCustomTodos(),
      });
    },
  });
  const addCustomTodo = useAddCustomTodo({
    onSuccess: () => {
      toast.success("커스텀 주간 숙제가 추가되었습니다.");

      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCustomTodos(),
      });

      setAddCustomTodoMode(false);
    },
  });
  const updateFriendWeeklyTodo = useUpdateFriendWeeklyTodo({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
    },
  });

  useEffect(() => {
    if (addCustomTodoMode && addCustomTodoInputRef.current) {
      addCustomTodoInputRef.current.focus();
    }
  }, [addCustomTodoMode]);

  const handleUpdate = useCallback(
    (action: UpdateWeeklyTodoAction) => {
      if (updateWeeklyTodo.isPending || updateFriendWeeklyTodo.isPending) {
        return;
      }

      if (friend) {
        if (!friend.fromFriendSettings.checkWeekTodo) {
          toast.warn("권한이 없습니다.");
          return;
        }

        updateFriendWeeklyTodo.mutate({
          params: {
            id: character.characterId,
            characterName: character.characterName,
          },
          action,
        });
      } else {
        updateWeeklyTodo.mutate({
          params: {
            id: character.characterId,
            characterName: character.characterName,
          },
          action,
        });
      }
    },
    [
      updateWeeklyTodo.isPending,
      updateFriendWeeklyTodo.isPending,
      friend,
      character,
    ]
  );

  // 깐부의 캐릭터라면 나에게 설정한 값도 체크해야 함
  const accessible = friend ? friend.fromFriendSettings.showWeekTodo : true;

  return (
    <>
      <Wrapper>
        <TitleRow>
          <BoxTitle>주간 숙제</BoxTitle>

          <Button
            css={addCustomTodoButtonCss}
            variant="text"
            size="medium"
            onClick={() => setAddCustomTodoMode(true)}
          >
            📝
          </Button>
        </TitleRow>

        {accessible && character.settings.showWeekEpona && (
          <Check
            indicatorColor={theme.app.palette.yellow[300]}
            totalCount={3}
            currentCount={character.weekEpona}
            onClick={() => handleUpdate("UPDATE_WEEKLY_EPONA")}
            onRightClick={() => handleUpdate("UPDATE_WEEKLY_EPONA_ALL")}
          >
            주간에포나
          </Check>
        )}

        {accessible && character.settings.showSilmaelChange && (
          <Check
            indicatorColor={theme.app.palette.yellow[300]}
            totalCount={1}
            currentCount={character.silmaelChange ? 1 : 0}
            onClick={() => {
              handleUpdate("TOGGLE_SILMAEL_EXCHANGE");
            }}
            onRightClick={() => {
              handleUpdate("TOGGLE_SILMAEL_EXCHANGE");
            }}
          >
            실마엘 혈석 교환
          </Check>
        )}

        {accessible && character.settings.showCubeTicket && (
          <CubeCounterWrapper>
            <CubeCounter>
              <CubeActionButton
                disabled={character.cubeTicket <= 0}
                onClick={() => {
                  handleUpdate("SUBSCTRACT_CUBE_TICKET");
                }}
              >
                <FiMinus />
              </CubeActionButton>
              {character.cubeTicket} 장
              <CubeActionButton
                onClick={() => {
                  handleUpdate("ADD_CUBE_TICKET");
                }}
              >
                <FiPlus />
              </CubeActionButton>
              큐브 티켓
            </CubeCounter>

            <button type="button" onClick={() => setModalState(character)}>
              <RiMoreFill size="18" />
            </button>
          </CubeCounterWrapper>
        )}

        {accessible &&
          customTodos.data
            ?.filter(
              (item) =>
                item.frequency === "WEEKLY" &&
                item.characterId === character.characterId
            )
            .map((item) => {
              const handleCheck = () => {
                checkCustomTodo.mutate({
                  characterId: item.characterId,
                  customTodoId: item.customTodoId,
                });
              };

              return (
                <Check
                  key={item.customTodoId}
                  indicatorColor={theme.app.palette.yellow[300]}
                  currentCount={item.checked ? 1 : 0}
                  totalCount={1}
                  onClick={handleCheck}
                  onRightClick={handleCheck}
                  rightButtons={[
                    {
                      icon: <IoTrashOutline />,
                      onClick: () => {
                        if (
                          window.confirm("주간 커스텀 숙제를 삭제하시겠어요?")
                        ) {
                          removeCustomTodo.mutate(item.customTodoId);
                        }
                      },
                    },
                  ]}
                >
                  {item.contentName}
                </Check>
              );
            })}

        {addCustomTodoMode && (
          <AddCustomTodoWrapper>
            <MultilineInput
              ref={addCustomTodoInputRef}
              wrapperCss={addCustomTodoInputWrapperCss}
              placeholder="주간 숙제 이름을 입력해주세요."
              maxLength={20}
              onSubmit={() => {
                if (addCustomTodoInputRef.current) {
                  addCustomTodo.mutate({
                    characterId: character.characterId,
                    contentName: addCustomTodoInputRef.current.value,
                    frequency: "WEEKLY",
                  });
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (addCustomTodoInputRef.current) {
                  addCustomTodo.mutate({
                    characterId: character.characterId,
                    contentName: addCustomTodoInputRef.current.value,
                    frequency: "WEEKLY",
                  });
                }
              }}
            >
              <MdSave size="18" />
            </button>
          </AddCustomTodoWrapper>
        )}
      </Wrapper>

      <CubeRewardsModal
        character={character}
        isOpen={!!modalState}
        onClose={() => setModalState()}
      />
    </>
  );
};

export default WeeklyContents;

const AddCustomTodoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 5px;
`;

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};

  ${CheckStyledComponents.Wrapper}, ${AddCustomTodoWrapper} {
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 10px;
`;

const addCustomTodoButtonCss = css`
  padding: 8px;
  border-radius: 0;
`;

const addCustomTodoInputWrapperCss = css`
  flex: 1;
`;

const CubeCounterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  font-size: 14px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const CubeCounter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const CubeActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: ${({ theme }) => theme.app.palette.yellow[300]};
  font-size: 16px;
  color: ${({ theme }) => theme.app.palette.gray[0]};

  &:disabled {
    background: ${({ theme }) => theme.app.palette.gray[250]};
  }
`;
