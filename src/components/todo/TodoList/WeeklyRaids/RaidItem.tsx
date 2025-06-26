import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import { forwardRef, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled, { css, useTheme } from "styled-components";

import FormModal from "@pages/schedule/components/FormModal";

import {
  useCheckRaidTodo,
  useUpdateRaidTodoMemo,
} from "@core/hooks/mutations/todo";
import useIsGuest from "@core/hooks/useIsGuest";
import useModalState from "@core/hooks/useModalState";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character, TodoRaid } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import type { ScheduleItem, Weekday } from "@core/types/schedule";

import Check from "@components/todo/TodoList/element/Check";
import GatewayGauge, * as GatewayGaugeStyledComponents from "@components/todo/TodoList/element/GatewayGauge";
import MultilineInput from "@components/todo/TodoList/element/MultilineInput";
import GoldText from "@components/todo/TodoList/text/GoldText";

import AddMemoIcon from "@assets/svg/AddMemoIcon";
import CalendarIcon from "@assets/svg/CalendarIcon";
import RollbackIcon from "@assets/svg/RollbackIcon";
import SaveIcon from "@assets/svg/SaveIcon";

import RaidNameParser from "./RaidNameParser";

const weekdayMap: Record<Weekday, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  character: Character;
  todo: TodoRaid;
  friend?: Friend;
  sortMode?: boolean;
  withOpacity?: boolean;
  isDragging?: boolean;
  style?: React.CSSProperties;
  schedule?: ScheduleItem;
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
      schedule,
      ...rest
    },
    ref
  ) => {
    const memoRef = useRef<HTMLTextAreaElement>(null);

    const theme = useTheme();
    const isGuest = useIsGuest();

    const [memoEditMode, setMemoEditMode] = useState(false);

    const [createModal, setCreateModal] = useModalState<boolean>();
    const [targetSchedule, setTargetSchedule] = useModalState<ScheduleItem>();

    const today = useMemo(() => dayjs(), []);
    const startDate = useMemo(() => today.startOf("month"), [today]);

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
          <Tooltip
            title={
              todo.totalGate !== todo.currentGate &&
              !sortMode && <>마우스 우클릭 시 한번에 체크됩니다</>
            }
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -100],
                  },
                },
              ],
            }}
          >
            <ContentNameWithGold>
              <RaidNameParser>{todo.name}</RaidNameParser>
              <GoldContainer>
                <GoldText>{todo.realGold}</GoldText>
                {todo.characterGold !== 0 && (
                  <CharacterGoldBadge>
                    {todo.characterGold} G
                  </CharacterGoldBadge>
                )}
              </GoldContainer>
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
          </Tooltip>
        </Check>
        <GatewayGauge
          totalValue={todo.totalGate}
          currentValue={todo.currentGate}
          moreRewardCheckList={todo.moreRewardCheckList}
          weekCategory={todo.weekCategory}
          character={character}
          friend={friend}
        />

        {schedule !== undefined && (
          <Tooltip
            title={
              schedule.repeatWeek
                ? `${weekdayMap[schedule.dayOfWeek]}요일 ${dayjs(schedule.time, "HH:mm:ss").format("A hh:mm")} 자동체크`
                : `${dayjs(schedule.date).format("ddd")}요일 ${dayjs(schedule.time, "HH:mm:ss").format("A hh:mm")} 자동체크`
            }
            placement="top"
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -10], // [x, y] 값으로 글씨 위치 미세 조정
                  },
                },
              ],
            }}
          >
            <ScheduleButton onClick={() => setTargetSchedule(schedule)}>
              <CalendarIcon />
            </ScheduleButton>
          </Tooltip>
        )}
        <FormModal
          isOpen={!!createModal || targetSchedule !== undefined}
          targetSchedule={targetSchedule}
          onClose={() => {
            if (createModal) {
              setCreateModal();
            } else {
              setTargetSchedule();
            }
          }}
          year={startDate.year()}
          month={startDate.month() + 1}
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
  cursor: ${({ $isDragging }) => ($isDragging ? "grabbing" : "grab")};
  position: relative;
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

const ScheduleButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 25px;
  left: 8px;
  width: 25px;
  height: 25px;
  background: ${({ theme }) => theme.app.text.yellow};
  border-radius: 6px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.app.palette.red[100]};
    svg {
      color: ${({ theme }) => theme.app.palette.red[200]};
    }
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.app.text.reverse};
    transition: color 0.2s;
  }
`;

const ContentNameWithGold = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
  min-height: 60px;
`;

const GoldContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const memoInputCss = css`
  margin-top: 3px;
  color: ${({ theme }) => theme.app.text.red};
  font-size: 12px;
  line-height: 1.2;
  background: transparent;
`;

const CharacterGoldBadge = styled.span`
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  color: ${({ theme }) => theme.app.text.black};
  font-size: 10px;
  font-weight: 700;
  padding: 2px 4px;
  border-radius: 6px;
  min-width: 20px;
  line-height: 1;
  border: 1px solid ${({ theme }) => theme.app.palette.yellow[450]};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-top: 2.5px;
`;
