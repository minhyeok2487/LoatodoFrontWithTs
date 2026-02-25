import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import { showLoaCalendar } from "@core/atoms/todo.atom";
import useGetLogsProfit from "@core/hooks/queries/logs/useGetLogsProfit";
import { useSchedulesMonth } from "@core/hooks/queries/schedule";
import useIsGuest from "@core/hooks/useIsGuest";
import useModalState from "@core/hooks/useModalState";
import type { ScheduleCategory, ScheduleItem } from "@core/types/schedule";
import { getWeekdayNumber } from "@core/utils";

import { MdSearch } from "@react-icons/all-files/md/MdSearch";

import Button from "@components/Button";
import SortedScheduleList from "@components/SortedScheduleList";

import ArrowIcon from "@assets/images/ico_cal_arr.svg";

import FormModal from "./components/FormModal";
import SearchResultsList from "./components/SearchResultsList";

const MAX_VISIBLE_SCHEDULES = 2;

const ScheduleIndex = () => {
  const isGuest = useIsGuest();
  const [createModal, setCreateModal] = useModalState<boolean>();
  const [targetSchedule, setTargetSchedule] = useModalState<ScheduleItem>();
  const [showWen, setShowWen] = useAtom(showLoaCalendar);
  const today = useMemo(() => dayjs(), []);
  const [filter, setFilter] = useState<ScheduleCategory | "ALL">("ALL");
  const [startDate, setStartDate] = useState(today.startOf("month"));
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const getSchedules = useSchedulesMonth({
    year: startDate.year(),
    month: startDate.month() + 1,
    query: searchQuery || undefined,
  });

  const { data: profitData = [] } = useGetLogsProfit({
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: startDate.endOf("month").format("YYYY-MM-DD"),
  });

  const monthlyProfit = useMemo(() => {
    return profitData.reduce((acc, curr) => acc + curr.totalProfit, 0);
  }, [profitData]);

  const dailyProfitMap = useMemo(() => {
    const map = new Map<string, number>();
    profitData.forEach((item) => {
      map.set(item.localDate, item.totalProfit);
    });
    return map;
  }, [profitData]);

  const handleChangeWen = useCallback((): void => {
    setShowWen(!showWen);
  }, [setShowWen, showWen]);

  const handleClickScheduleItem = useCallback(
    (schedule: ScheduleItem) => {
      if (isGuest) {
        toast.warn("테스트 계정은 이용하실 수 없습니다.");
      } else {
        setTargetSchedule(schedule);
      }
    },
    [isGuest, setTargetSchedule]
  );

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
      month: prevMonth.format("M"),
    }));
  }, [startOffset, startDate]);

  // 다음 달 날짜 추가
  const totalDays = startOffset + startDate.daysInMonth();
  const nextMonthDays = useMemo(() => {
    const remaining = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
    const nextMonth = startDate.add(1, "month");
    return Array.from({ length: remaining }, (_, i) => ({
      day: i + 1,
      month: nextMonth.format("M"),
    }));
  }, [totalDays, startDate]);

  const isSearching = !!searchQuery;

  const schedulesGroupedByDate = useMemo(() => {
    const schedules = getSchedules.data ?? [];
    const filtered =
      filter === "ALL"
        ? schedules
        : schedules.filter((item) => item.scheduleCategory === filter);

    const map = new Map<string, ScheduleItem[]>();

    for (let i = 0; i < startDate.daysInMonth(); i++) {
      const date = startDate.add(i, "day");
      const dateKey = date.format("YYYY-MM-DD");
      const weekday = showWen ? (date.day() + 4) % 7 : date.day();
      const daySchedules: ScheduleItem[] = [];

      for (const item of filtered) {
        const scheduleWeekday = getWeekdayNumber(item.dayOfWeek);
        const adjustedWeekday = showWen
          ? (scheduleWeekday + 4) % 7
          : scheduleWeekday;

        if (item.repeatWeek) {
          if (adjustedWeekday === weekday) daySchedules.push(item);
        } else if (item.date) {
          if (dayjs(item.date).isSame(date, "date")) daySchedules.push(item);
        }
      }

      map.set(dateKey, daySchedules);
    }

    return map;
  }, [getSchedules.data, filter, startDate, showWen]);

  return (
    <WideDefaultLayout pageTitle="일정">
      <Wrapper>
        {/* 검색 바 - 최상단 */}
        <TopSearchBar>
          <SearchIcon>
            <MdSearch size="18" />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="레이드명 또는 메모 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <ClearButton onClick={() => { setSearchInput(""); setSearchQuery(""); }}>
              ✕
            </ClearButton>
          )}
        </TopSearchBar>

        <Controller>
          <button
            type="button"
            onClick={() => setStartDate(startDate.subtract(1, "month"))}
          >
            <span className="text-hidden">이전</span>
          </button>
          <div>
            <strong>{startDate.format("YYYY년 MM월")}</strong>
            <p style={{ textAlign: "center", fontSize: "14px" }}>
              (월간 수익: {monthlyProfit.toLocaleString()} G)
            </p>
          </div>
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

        {/* 검색 중이면 리스트 뷰, 아니면 달력 */}
        {isSearching ? (
          <SearchResultsList
            data={getSchedules.data ?? []}
            filter={filter}
            onClickItem={handleClickScheduleItem}
          />
        ) : (
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
              const weekday = showWen ? (date.day() + 4) % 7 : date.day();
              const isToday = date.isSame(dayjs(), "date");

              const daySchedules =
                schedulesGroupedByDate.get(date.format("YYYY-MM-DD")) ?? [];
              const visibleSchedules = daySchedules.slice(0, MAX_VISIBLE_SCHEDULES);
              const hiddenCount = daySchedules.length - MAX_VISIBLE_SCHEDULES;

              return (
                <DateItem
                  key={index}
                  $weekday={weekday}
                  $isToday={isToday}
                  $showWen={showWen}
                >
                  <DateNumber $isToday={isToday}>
                    {date.format("D")}
                  </DateNumber>
                  {dailyProfitMap.has(date.format("YYYY-MM-DD")) && (
                    <Profit>
                      {dailyProfitMap
                        .get(date.format("YYYY-MM-DD"))
                        ?.toLocaleString()}{" "}
                      G
                    </Profit>
                  )}
                  <ul>
                    <SortedScheduleList
                      onClickScheduleItem={handleClickScheduleItem}
                      data={visibleSchedules}
                    />
                    {hiddenCount > 0 && (
                      <MoreCount>+{hiddenCount}건</MoreCount>
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
        )}
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

const TopSearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.app.text.light2};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 36px 10px 36px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.app.bg.main};
  color: ${({ theme }) => theme.app.text.black};
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light2};
  }

  &:focus {
    border-color: ${({ theme }) => theme.app.text.light1};
  }

  ${({ theme }) => theme.medias.max900} {
    font-size: 14px;
    padding: 8px 32px 8px 32px;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.app.text.light2};
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  line-height: 1;
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
  align-items: center;

  ${({ theme }) => theme.medias.max900} {
    margin-top: 5px;
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

const DateNumber = styled.strong<{ $isToday: boolean }>`
  position: relative;

  ${({ $isToday, theme }) =>
    $isToday &&
    css`
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: ${theme.app.bg.reverse};
        opacity: 0.15;
        pointer-events: none;

        ${theme.medias.max900} {
          width: 18px;
          height: 18px;
        }
      }
    `}
`;

const MoreCount = styled.li`
  padding: 4px 0;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light2};
  text-align: center;

  ${({ theme }) => theme.medias.max900} {
    font-size: 9px;
    padding: 2px 0;
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

const Profit = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.app.palette.blue[350]};
  font-weight: bold;
  text-align: right;
  padding-right: 5px;
`;
