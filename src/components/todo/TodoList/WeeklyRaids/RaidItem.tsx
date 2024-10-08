import { useQueryClient } from "@tanstack/react-query";
import { forwardRef, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled, { css, useTheme } from "styled-components";

import useCheckRaidTodo from "@core/hooks/mutations/todo/useCheckRaidTodo";
import useUpdateRaidTodoMemo from "@core/hooks/mutations/todo/useUpdateRaidTodoMemo";
import useIsGuest from "@core/hooks/useIsGuest";
import type { Character, TodoRaid } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Check from "@components/todo/TodoList/element/Check";
import GatewayGauge, * as GatewayGaugeStyledComponents from "@components/todo/TodoList/element/GatewayGauge";
import MultilineInput from "@components/todo/TodoList/element/MultilineInput";
import GoldText from "@components/todo/TodoList/text/GoldText";

import AddMemoIcon from "@assets/svg/AddMemoIcon";
import RollbackIcon from "@assets/svg/RollbackIcon";
import SaveIcon from "@assets/svg/SaveIcon";

import RaidNameParser from "./RaidNameParser";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  character: Character;
  todo: TodoRaid;
  friend?: Friend;
  sortMode?: boolean;
  withOpacity?: boolean;
  isDragging?: boolean;
  style?: React.CSSProperties;
}

const RaidItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      character,
      todo,
      friend,
      sortMode,
      withOpacity = false,
      isDragging = false,
      style,
      ...rest
    },
    ref
  ) => {
    const memoRef = useRef<HTMLTextAreaElement>(null);

    const queryClient = useQueryClient();
    const theme = useTheme();
    const isGuest = useIsGuest();

    const [memoEditMode, setMemoEditMode] = useState(false);

    const checkRaidTodo = useCheckRaidTodo({
      onSuccess: (character, { isFriend }) => {
        if (isFriend) {
          queryClient.invalidateQueries({
            queryKey: queryKeyGenerator.getFriends(),
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: queryKeyGenerator.getCharacters(),
          });
        }
      },
    });
    const updateRaidTodoMemo = useUpdateRaidTodoMemo({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
      },
    });

    const rightButtons = [];

    /* 메모 롤백 */
    const handleRollBackMemo = () => {
      const originalMessage = todo.message;

      if (memoRef.current) {
        memoRef.current.value = originalMessage || "";
      }
    };

    /* 주간숙제 메모 */
    const updateWeekMessage = async (todoId: number, message: string) => {
      if (memoRef.current) {
        if (friend) {
          toast.warn("기능 준비 중입니다.");
          handleRollBackMemo();
          return;
        }

        updateRaidTodoMemo.mutate({
          isFriend: !!friend,
          characterId: character.characterId,
          todoId: todo.id,
          message: memoRef.current.value,
        });
      }
    };

    const handleUpdate = (todo: TodoRaid, checkAll: boolean) => {
      if (friend && !friend.fromFriendSettings.checkRaid) {
        toast.warn("권한이 없습니다.");
        return;
      }

      checkRaidTodo.mutate({
        isFriend: !!friend,
        characterId: character.characterId,
        characterName: character.characterName,
        weekCategory: todo.weekCategory,
        currentGate: todo.currentGate,
        totalGate: todo.totalGate,
        checkAll,
      });
    };

    if (todo.message !== null) {
      rightButtons.push(
        memoEditMode
          ? {
              ariaLabel: "레이드 메모 수정 취소하기",
              icon: <RollbackIcon />, // 롤백 버튼
              onClick: () => {
                setMemoEditMode(false);

                handleRollBackMemo();
                memoRef.current?.blur();
              },
            }
          : {
              ariaLabel: "레이드 메모 입력하기",
              icon: <AddMemoIcon />, // 수정 버튼
              onClick: () => {
                if (isGuest) {
                  toast.warn("테스트 계정은 이용하실 수 없습니다.");
                } else {
                  setMemoEditMode(true);

                  memoRef.current?.focus();
                }
              },
            }
      );
    } else if (!memoEditMode) {
      rightButtons.push({
        ariaLabel: "레이드 메모 입력하기",
        icon: <AddMemoIcon />, // 메모 버튼
        onClick: () => {
          if (friend) {
            toast.warn("기능 준비 중입니다.");
          } else {
            if (isGuest) {
              toast.warn("테스트 계정은 이용하실 수 없습니다.");
            } else {
              setMemoEditMode(true);

              memoRef.current?.focus();
            }
          }
        },
      });
    }

    if (memoEditMode) {
      rightButtons.push({
        ariaLabel: "레이드 메모 저장하기",
        icon: <SaveIcon />,
        onClick: () => {
          if (memoRef.current) {
            memoRef.current?.blur();
            updateWeekMessage(todo.id, memoRef.current.value);

            setMemoEditMode(false);
          }
        },
      });
    }

    return (
      <Wrapper
        ref={ref}
        $isDragging={isDragging}
        $withOpacity={withOpacity}
        $sortMode={sortMode}
        style={style}
        {...rest}
      >
        <Check
          hideIndicatorText
          indicatorColor={theme.app.palette.red[200]}
          totalCount={todo.totalGate}
          currentCount={todo.currentGate}
          onClick={() => handleUpdate(todo, false)}
          onRightClick={() => handleUpdate(todo, true)}
          rightButtons={rightButtons}
        >
          <ContentNameWithGold>
            <RaidNameParser>{todo.name}</RaidNameParser>
            {character.goldCharacter ? <GoldText>{todo.gold}</GoldText> : ""}
            <MultilineInput
              ref={memoRef}
              inputCss={memoInputCss}
              maxLength={100}
              placeholder="메모 추가"
              defaultValue={todo.message || ""}
              isHidden={todo.message === null && !memoEditMode}
              onClick={(e) => {
                e.stopPropagation();

                setMemoEditMode(true);
              }}
              onEnterPress={() => {
                if (memoRef.current) {
                  updateWeekMessage(todo.id, memoRef.current.value);
                  setMemoEditMode(false);
                }
              }}
            />
          </ContentNameWithGold>
        </Check>

        <GatewayGauge
          totalValue={todo.totalGate}
          currentValue={todo.currentGate}
        />
      </Wrapper>
    );
  }
);

export default RaidItem;

const Wrapper = styled.div<{
  $sortMode?: boolean;
  $withOpacity: boolean;
  $isDragging: boolean;
}>`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  opacity: ${({ $withOpacity }) => ($withOpacity ? 0.5 : 1)};
  cursor: ${({ $isDragging }) => ($isDragging ? "grabbing" : "grab")};
  box-shadow: ${({ $isDragging, $sortMode }) => {
    if ($sortMode) {
      return $isDragging
        ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
        : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px";
    }

    return "none";
  }};

  ${GatewayGaugeStyledComponents.Wrapper} {
    padding-top: 0;
  }
`;

const ContentNameWithGold = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
  min-height: 70px;
`;

const memoInputCss = css`
  margin-top: 3px;
  color: ${({ theme }) => theme.app.text.red};
  font-size: 12px;
  line-height: 1.2;
  background: transparent;
`;
