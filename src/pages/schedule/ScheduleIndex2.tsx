import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import { showLoaCalendar } from "@core/atoms/todo.atom";
import { useSchedulesMonth } from "@core/hooks/queries/schedule";
import useIsGuest from "@core/hooks/useIsGuest";
import useModalState from "@core/hooks/useModalState";
import type { ScheduleCategory, ScheduleItem } from "@core/types/schedule";
import { getWeekdayNumber } from "@core/utils";

import Button from "@components/Button";
import SortedScheduleList from "@components/SortedScheduleList";

import ArrowIcon from "@assets/images/ico_cal_arr.svg";

import FormModal from "./components/FormModal";

const ScheduleIndex = () => {
  const isGuest = useIsGuest();
  const [createModal, setCreateModal] = useModalState<boolean>();
  const [targetSchedule, setTargetSchedule] = useModalState<ScheduleItem>();
  const [showWen, setShowWen] = useAtom(showLoaCalendar);
  const today = useMemo(() => dayjs(), []);
  const [filter, setFilter] = useState<ScheduleCategory | "ALL">("ALL");
  const [startDate, setStartDate] = useState(today.startOf("month"));

  const getSchedules = useSchedulesMonth({
    year: startDate.year(),
    month: startDate.month() + 1,
  });

  const handleChangeWen = useCallback((): void => {
    setShowWen(!showWen);
  }, [setShowWen, showWen]);

  const weekdays = useMemo(
    () =>
      showWen
        ? ["수", "목", "금", "토", "일", "월", "화"]
        : ["일", "월", "화", "수", "목", "금", "토"],
    [showWen]
  );

  const startOffset = useMemo(
    () =>
      showWen
        ? (startDate.startOf("month").day() + 4) % 7
        : startDate.startOf("month").day(),
    [showWen, startDate]
  );

  // 이전 달 날짜 추가
  const prevMonthDays = useMemo(() => {
    if (startOffset === 0) return [];
    const prevMonth = startDate.subtract(1, "month");
    const lastDate = prevMonth.daysInMonth();
    return Array.from({ length: startOffset }, (_, i) => ({
      day: lastDate - startOffset + i + 1,
      month: prevMonth.format("M"), // 이전 달 월 표시
    }));
  }, [startOffset, startDate]);

  // 다음 달 날짜 추가
  const totalDays = startOffset + startDate.daysInMonth();
  const nextMonthDays = useMemo(() => {
    const remaining = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
    const nextMonth = startDate.add(1, "month");
    return Array.from({ length: remaining }, (_, i) => ({
      day: i + 1,
      month: nextMonth.format("M"), // 다음 달 월 표시
    }));
  }, [totalDays, startDate]);

  return (
    <WideDefaultLayout pageTitle="일정 (개선중)">
      <Wrapper>
        <Controller>
          <button
            type="button"
            onClick={() => setStartDate(startDate.subtract(1, "month"))}
          >
            <span className="text-hidden">이전</span>
          </button>
          <strong>{startDate.format("YYYY년 MM월")}</strong>
          <button
            type="button"
            className="next"
            onClick={() => setStartDate(startDate.add(1, "month"))}
          >
            <span className="text-hidden">다음</span>
          </button>
        </Controller>

        <HeaderGroup>
          <Filters>
            <Button
              css={filterButtonCss(filter === "ALL")}
              onClick={() => setFilter("ALL")}
            >
              모든 일정
            </Button>
            <Button
              css={filterButtonCss(filter === "ALONE")}
              onClick={() => setFilter("ALONE")}
            >
              내 일정
            </Button>
            <Button
              css={filterButtonCss(filter === "PARTY")}
              onClick={() => setFilter("PARTY")}
            >
              깐부 일정
            </Button>
          </Filters>
          <Buttons>
            <CalendarSwitchContainer>
              <span>{showWen ? `로아달력` : `일반달력`}</span>
              <SwitchWrapper $isOn={showWen} onClick={handleChangeWen}>
                <SwitchSlider $isOn={showWen} />
              </SwitchWrapper>
            </CalendarSwitchContainer>
            <Button size="large" onClick={() => setCreateModal(true)}>
              일정 추가
            </Button>
          </Buttons>
        </HeaderGroup>

        <MonthGrid>
          {weekdays.map((day, index) => (
            <WeekdayHeader key={index} $index={index} $showWen={showWen}>
              {day}
            </WeekdayHeader>
          ))}

          {/* 이전 달 날짜 */}
          {prevMonthDays.map(({ day, month }, index) => (
            <DateItem key={`prev-${index}`} $isPrevOrNext>
              <strong>
                {month} / {day}
              </strong>
            </DateItem>
          ))}

          {/* 현재 달 날짜 */}
          {[...Array(startDate.daysInMonth())].map((_, index) => {
            const date = startDate.add(index, "day");
            const weekday = showWen ? (date.day() + 4) % 7 : date.day(); // 요일 조정
            const isToday = date.isSame(dayjs(), "date");

            return (
              <DateItem
                key={index}
                $weekday={weekday}
                $isToday={isToday}
                $showWen={showWen}
              >
                <strong>{date.format("D")}</strong>
                <ul>
                  {getSchedules.data && (
                    <SortedScheduleList
                      onClickScheduleItem={(schedule) => {
                        if (isGuest) {
                          toast.warn("테스트 계정은 이용하실 수 없습니다.");
                        } else {
                          setTargetSchedule(schedule);
                        }
                      }}
                      data={getSchedules.data.filter((item) => {
                        const scheduleWeekday = getWeekdayNumber(
                          item.dayOfWeek
                        );
                        const adjustedWeekday = showWen
                          ? (scheduleWeekday + 4) % 7
                          : scheduleWeekday;

                        if (item.repeatWeek) {
                          // 반복 일정인 경우, 요일이 맞는지 확인
                          return adjustedWeekday === weekday;
                        }
                        if (item.date) {
                          // 단일 일정인 경우, 날짜가 정확히 맞는지 확인
                          return dayjs(item.date).isSame(date, "date");
                        }
                        return false;
                      })}
                    />
                  )}
                </ul>
              </DateItem>
            );
          })}

          {/* 다음 달 날짜 */}
          {nextMonthDays.map(({ day, month }, index) => (
            <DateItem key={`next-${index}`} $isPrevOrNext>
              <strong>
                {month} / {day}
              </strong>
            </DateItem>
          ))}
        </MonthGrid>
      </Wrapper>

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
    </WideDefaultLayout>
  );
};

export default ScheduleIndex;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  overflow: visible;
`;

const Controller = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;

  strong {
    font-size: 22px;
    font-weight: 700;
    color: ${({ theme }) => theme.app.text.black};

    ${({ theme }) => theme.medias.max900} {
      font-size: 18px;
    }
  }

  button {
    width: 40px;
    height: 40px;
    background: url(${ArrowIcon}) no-repeat center / 100%;

    ${({ theme }) => theme.medias.max900} {
      width: 30px;
      height: 30px;
    }

    ${({ theme }) => theme.medias.max600} {
      width: 25px;
      height: 25px;
    }

    &.next {
      transform: rotate(180deg);
    }
  }
`;

const HeaderGroup = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    align-items: center;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 6px;

  ${({ theme }) => theme.medias.max900} {
    margin-top: 5px;
    align-items: center;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;

  ${({ theme }) => theme.medias.max900} {
    justify-content: center;
    margin-top: 10px;
  }

  button {
    ${({ theme }) => theme.medias.max900} {
      zoom: 0.5;
    }
  }

  span {
    ${({ theme }) => theme.medias.max900} {
      font-size: 10px;
    }
  }
`;

const filterButtonCss = (isActive: boolean) => css`
  padding: 3px 16px;
  border-radius: 18px;
  color: ${({ theme }) =>
    isActive ? theme.app.palette.gray[0] : theme.app.text.light1};
  background: ${({ theme }) =>
    isActive ? theme.app.palette.gray[800] : theme.app.bg.gray1};

  ${({ theme }) => theme.medias.max900} {
    padding: 2px 12px;
  }

  ${({ theme }) => theme.medias.max600} {
    padding: 1px 8px;
  }
`;

const MonthGrid = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 24px;
  width: 100%;
  text-align: center;
  grid-template-columns: repeat(7, 1fr);

  ${({ theme }) => theme.medias.max900} {
    margin-top: 6px;
  }
`;

const WeekdayHeader = styled.div<{ $index: number; $showWen: boolean }>`
  position: sticky;
  top: 70px;
  z-index: 10;
  font-weight: bold;
  padding: 5px;
  background: ${({ theme }) => theme.app.bg.reverse};
  color: ${({ $index, $showWen, theme }) => {
    if ($showWen) {
      if ($index === 4) {
        return theme.app.palette.red[250];
      }
      if ($index === 3) {
        return theme.app.palette.blue[350];
      }
    } else {
      if ($index === 0) {
        return theme.app.palette.red[250];
      }
      if ($index === 6) {
        return theme.app.palette.blue[350];
      }
    }
    return theme.app.text.reverse;
  }};

  ${({ theme }) => theme.medias.max900} {
    font-size: 10px;
  }
`;

const DateItem = styled.li<{
  $weekday?: number;
  $isToday?: boolean;
  $isPrevOrNext?: boolean;
  $showWen?: boolean;
}>`
  align-self: stretch;
  z-index: ${({ $isToday }) => ($isToday ? 1 : 0)};
  margin-left: -1px;
  flex: 1;
  display: flex;
  aspect-ratio: 4 / 7.3;
  width: 100%;
  flex-direction: column;
  border: 1px solid
    ${({ $isToday, theme }) =>
      $isToday ? theme.app.bg.reverse : theme.app.border};
  box-shadow: ${({ $isToday }) =>
    $isToday ? "0 0 10px rgba(0, 0, 0, 0.1)" : "unset"};
  opacity: ${({ $isPrevOrNext }) => ($isPrevOrNext ? 0.5 : 1)};
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  strong {
    padding: 4px 0;
    width: 100%;
    font-size: 16px;
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.app.border};
    background: ${({ theme }) => theme.app.bg.main};
    color: ${({ $isPrevOrNext, $weekday, $showWen, theme }) => {
      if ($isPrevOrNext) return theme.app.text.light1;
      if ($showWen) {
        if ($weekday === 4) {
          return theme.app.palette.red[250];
        }
        if ($weekday === 3) {
          return theme.app.palette.blue[350];
        }
      } else {
        if ($weekday === 0) {
          return theme.app.palette.red[250];
        }
        if ($weekday === 6) {
          return theme.app.palette.blue[350];
        }
      }
      return theme.app.text.black;
    }};

    ${({ theme }) => theme.medias.max900} {
      font-size: 10px;
    }
  }

  ul {
    display: flex;
    flex-direction: column;
  }
`;

const SwitchWrapper = styled.button<{ $isOn: boolean }>`
  width: 50px;
  height: 25px;
  background: ${({ $isOn }) => ($isOn ? "#4CAF50" : "#F44336")};
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  padding: 2px;
  transition: background 0.3s ease-in-out;
`;

const SwitchSlider = styled.div<{ $isOn: boolean }>`
  width: 20px;
  height: 20px;
  background: ${({ theme }) => theme.app.bg.reverse};
  border-radius: 50%;
  position: absolute;
  left: ${({ $isOn }) => ($isOn ? "calc(100% - 22px)" : "3px")};
  transition: left 0.3s ease-in-out;
`;

const CalendarSwitchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
`;
