import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { HiPencilAlt } from "@react-icons/all-files/hi/HiPencilAlt";
import { IoArrowUndoSharp } from "@react-icons/all-files/io5/IoArrowUndoSharp";
import { MdSave } from "@react-icons/all-files/md/MdSave";
import { useQueryClient } from "@tanstack/react-query";
import { forwardRef, useRef, useState } from "react";
import { toast } from "react-toastify";

import * as characterApi from "@core/apis/character.api";
import * as friendApi from "@core/apis/friend.api";
import type { Character, TodoRaid } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Check from "@components/todo/TodolList/button/Check";
import GatewayGauge, * as GatewayGaugeStyledComponents from "@components/todo/TodolList/element/GatewayGauge";
import GoldText from "@components/todo/TodolList/text/GoldText";

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
    const memoRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();
    const theme = useTheme();

    const [memoEditMode, setMemoEditMode] = useState(false);

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
      if (friend) {
        toast.warn("기능 준비 중입니다.");
        handleRollBackMemo();
      } else {
        try {
          await characterApi.updateWeekMessage(character, todoId, message);

          queryClient.invalidateQueries({
            queryKey: queryKeyGenerator.getCharacters(),
          });
        } catch (error) {
          console.error("Error updateWeekMessage:", error);
        }
      }
    };

    /* 3-1.주간숙제 체크 */
    const updateWeekCheck = async (todo: TodoRaid) => {
      if (friend) {
        if (!friend.fromFriendSettings.checkRaid) {
          toast("권한이 없습니다.");
        }
        try {
          await friendApi.updateWeekCheck(character, todo);

          queryClient.invalidateQueries({
            queryKey: queryKeyGenerator.getFriends(),
          });
        } catch (error) {
          console.error("Error updateWeekCheck:", error);
        }
      } else {
        try {
          await characterApi.updateWeekCheck(character, todo);

          queryClient.invalidateQueries({
            queryKey: queryKeyGenerator.getCharacters(),
          });
        } catch (error) {
          console.error("Error updateWeekCheck:", error);
        }
      }
    };

    /* 3-2. 캐릭터 주간숙제 체크 All */
    const updateWeekCheckAll = async (todo: TodoRaid) => {
      if (friend) {
        if (!friend.fromFriendSettings.checkRaid) {
          toast("권한이 없습니다.");
        }
        try {
          await friendApi.updateWeekCheckAll(character, todo);

          queryClient.invalidateQueries({
            queryKey: queryKeyGenerator.getFriends(),
          });
        } catch (error) {
          console.error("Error updateWeekCheck:", error);
        }
      } else {
        try {
          await characterApi.updateWeekCheckAll(character, todo);

          queryClient.invalidateQueries({
            queryKey: queryKeyGenerator.getCharacters(),
          });
        } catch (error) {
          console.error("Error updateWeekCheck:", error);
        }
      }
    };

    if (todo.message !== null) {
      rightButtons.push(
        memoEditMode
          ? {
              icon: <IoArrowUndoSharp />, // 롤백 버튼
              onClick: () => {
                setMemoEditMode(false);

                handleRollBackMemo();
                memoRef.current?.blur();
              },
            }
          : {
              icon: <HiPencilAlt />, // 수정 버튼
              onClick: () => {
                setMemoEditMode(true);

                memoRef.current?.focus();
              },
            }
      );
    } else if (!memoEditMode) {
      rightButtons.push({
        icon: <HiPencilAlt />, // 메모 버튼
        onClick: () => {
          if (friend) {
            toast.warn("기능 준비 중입니다.");
          } else {
            setMemoEditMode(true);

            memoRef.current?.focus();
          }
        },
      });
    }

    if (memoEditMode) {
      rightButtons.push({
        icon: <MdSave />,
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
        isDragging={isDragging}
        withOpacity={withOpacity}
        style={style}
        sortMode={sortMode}
        {...rest}
      >
        <Check
          hideIndicatorText
          indicatorColor={theme.app.pink1}
          totalCount={todo.totalGate}
          currentCount={todo.currentGate}
          onClick={() => updateWeekCheck(todo)}
          onRightClick={() => updateWeekCheckAll(todo)}
          rightButtons={rightButtons}
        >
          <ContentNameWithGold>
            <RaidNameParser>{todo.name}</RaidNameParser>
            {character.goldCharacter ? <GoldText>{todo.gold}</GoldText> : ""}
            <MemoInput
              ref={memoRef}
              type="text"
              spellCheck="false"
              defaultValue={todo.message || ""}
              isHidden={todo.message === null && !memoEditMode}
              onClick={(e) => {
                e.stopPropagation();

                setMemoEditMode(true);
                memoRef.current?.focus();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                const target = e.target as HTMLInputElement;

                if (e.key === "Enter") {
                  updateWeekMessage(todo.id, target.value);
                  setMemoEditMode(false);

                  target.blur();
                }
              }}
              placeholder="메모 추가"
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
  sortMode?: boolean;
  withOpacity: boolean;
  isDragging: boolean;
}>`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  opacity: ${({ withOpacity }) => (withOpacity ? 0.5 : 1)};
  cursor: ${({ isDragging }) => (isDragging ? "grabbing" : "grab")};
  box-shadow: ${({ isDragging, sortMode }) => {
    if (sortMode) {
      return isDragging
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

const MemoInput = styled.input<{ isHidden?: boolean }>`
  position: ${({ isHidden }) => (isHidden ? "absolute" : "relative")};
  left: ${({ isHidden }) => (isHidden ? "-9999px" : "unset")};
  width: 100%;
  margin-top: 3px;
  color: ${({ theme }) => theme.app.text.red};
  font-size: 12px;
  line-height: 1.2;
  background: transparent;
`;
