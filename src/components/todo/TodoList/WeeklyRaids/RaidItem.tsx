import { forwardRef, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled, { css, useTheme } from "styled-components";

import {
  useCheckRaidTodo,
  useUpdateRaidTodoMemo,
} from "@core/hooks/mutations/todo";
import useIsGuest from "@core/hooks/useIsGuest";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character, TodoRaid } from "@core/types/character";
import type { Friend } from "@core/types/friend";

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

    const theme = useTheme();
    const isGuest = useIsGuest();

    const [memoEditMode, setMemoEditMode] = useState(false);

    const checkRaidTodo = useCheckRaidTodo({
      onSuccess: (character, { friendUsername }) => {
        updateCharacterQueryData({
          character,
          friendUsername,
        });
      },
    });
    const updateRaidTodoMemo = useUpdateRaidTodoMemo({
      onSuccess: (character, { friendUsername }) => {
        memoRef.current?.blur();
        setMemoEditMode(false);

        updateCharacterQueryData({
          character,
          friendUsername,
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
        updateRaidTodoMemo.mutate({
          friendUsername: friend?.friendUsername,
          characterId: character.characterId,
          todoId: todo.id,
          message: memoRef.current.value,
        });
      }
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
          if (isGuest) {
            toast.warn("테스트 계정은 이용하실 수 없습니다.");
          } else {
            setMemoEditMode(true);

            memoRef.current?.focus();
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
            updateWeekMessage(todo.id, memoRef.current.value);
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
        $totalCount={todo.totalGate}
        $currentCount={todo.currentGate}
        style={style}
        {...rest}
      >
        <Check
          hideIndicatorText
          indicatorColor={theme.app.palette.red[200]}
          totalCount={todo.totalGate}
          currentCount={todo.currentGate}
          onClick={() => {
            checkRaidTodo.mutate({
              friendUsername: friend?.friendUsername,
              characterId: character.characterId,
              weekCategory: todo.weekCategory,
              allCheck: false,
            });
          }}
          onRightClick={() => {
            checkRaidTodo.mutate({
              friendUsername: friend?.friendUsername,
              characterId: character.characterId,
              weekCategory: todo.weekCategory,
              allCheck: true,
            });
          }}
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
                }
              }}
            />
          </ContentNameWithGold>
        </Check>

        <GatewayGauge
          totalValue={todo.totalGate}
          currentValue={todo.currentGate}
          moreRewardCheckList={todo.moreRewardCheckList}
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
  $totalCount: number;
  $currentCount: number;
}>`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  opacity: ${(props) => (props.$currentCount === props.$totalCount ? 0.3 : 1)};
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
