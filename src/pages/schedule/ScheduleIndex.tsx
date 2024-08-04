import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { authAtom } from "@core/atoms/auth.atom";
import useSchedules from "@core/hooks/queries/schedule/useSchedules";
import useIsBelowWidth from "@core/hooks/useIsBelowWidth";
import useModalState from "@core/hooks/useModalState";
import type { ScheduleCategory, ScheduleItem } from "@core/types/schedule";
import { getWeekdayNumber } from "@core/utils";

import Button from "@components/Button";
import SortedScheduleList from "@components/SortedScheduleList";

import ArrowIcon from "@assets/images/ico_cal_arr.svg";

import FormModal from "./components/FormModal";

const ScheduleIndex = () => {
  const auth = useAtomValue(authAtom);
  const [createModal, setCreateModal] = useModalState<boolean>();
  const [targetSchedule, setTargetSchedule] = useModalState<ScheduleItem>();
  const useIsBelowWidth900 = useIsBelowWidth(900);

  const today = useMemo(() => dayjs(), []);
  const [filter, setFilter] = useState<ScheduleCategory | "ALL">("ALL");
  const [currentWeekday, setCurrentWeekday] = useState(today.get("day")); // 모바일모드일 때 현재 선택된 요일
  const [startDate, setStartDate] = useState(
    today.get("day") === 0
      ? today.subtract(1, "week").set("day", 1)
      : today.set("day", 1)
  );

  const getSchedules = useSchedules(startDate);

  return (
    <DefaultLayout pageTitle="일정">
      <Wrapper>
        <Controller>
          <button
            type="button"
            onClick={() => setStartDate(startDate.subtract(1, "week"))}
          >
            <span className="text-hidden">이전</span>
          </button>
          <strong>{startDate.format("YYYY년 MM월")}</strong>
          <button
            type="button"
            className="next"
            onClick={() => setStartDate(startDate.add(1, "week"))}
          >
            <span className="text-hidden">다음</span>
          </button>
        </Controller>

        <Filters>
          <Button
            css={filterButtonCss(filter === "ALL")}
            onClick={() => {
              setFilter("ALL");
            }}
          >
            모든 일정
          </Button>
          <Button
            css={filterButtonCss(filter === "ALONE")}
            onClick={() => {
              setFilter("ALONE");
            }}
          >
            내 일정
          </Button>
          <Button
            css={filterButtonCss(filter === "PARTY")}
            onClick={() => {
              setFilter("PARTY");
            }}
          >
            깐부 일정
          </Button>
        </Filters>

        {useIsBelowWidth900 && (
          <Weekdays>
            {[0, 1, 2, 3, 4, 5, 6].map((addDay) => {
              const date = dayjs(startDate).add(addDay, "days");

              return (
                <Button
                  key={addDay}
                  variant="text"
                  css={weekItemCss(
                    (addDay + 1 === 7 ? 0 : addDay + 1) === currentWeekday
                  )}
                  onClick={() => setCurrentWeekday(date.get("day"))}
                >
                  <dl>
                    <dt>{date.get("date")}</dt>
                    <dd>{date.format("dd")}</dd>
                  </dl>
                </Button>
              );
            })}
          </Weekdays>
        )}

        <DateWrapper>
          {[0, 1, 2, 3, 4, 5, 6]
            .filter((addDay) => {
              // addDay = 월요일이 0임
              // weekday = 일요일이 0임, addDay보다 1 높음
              return useIsBelowWidth900
                ? (addDay + 1 === 7 ? 0 : addDay + 1) === currentWeekday
                : true;
            })
            .map((addDay) => {
              const date = dayjs(startDate).add(addDay, "day");
              const weekday = date.get("day");
              const isToday = date.isSame(dayjs(), "date");

              return (
                <DateItem
                  key={addDay}
                  $weekday={date.get("day")}
                  $isToday={isToday}
                >
                  <strong>
                    {date.get("date")}일({dayjs.weekdaysShort()[weekday]})
                  </strong>
                  <ul>
                    {getSchedules.data && (
                      <SortedScheduleList
                        onClickScheduleItem={(schedule) => {
                          if (!auth.username) {
                            toast.warn("테스트 계정은 이용하실 수 없습니다.");
                          } else {
                            setTargetSchedule(schedule);
                          }
                        }}
                        data={getSchedules.data.filter((item) => {
                          return (
                            getWeekdayNumber(item.dayOfWeek) === weekday &&
                            (filter !== "ALL"
                              ? item.scheduleCategory === filter
                              : true)
                          );
                        })}
                      />
                    )}
                  </ul>
                </DateItem>
              );
            })}
        </DateWrapper>

        <Buttons>
          <Button size="large" onClick={() => setCreateModal(true)}>
            일정 추가
          </Button>
        </Buttons>
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
      />
    </DefaultLayout>
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
  overflow: hidden;
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

    &.next {
      transform: rotate(180deg);
    }
  }
`;

const Filters = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: row;
  gap: 6px;

  ${({ theme }) => theme.medias.max900} {
    position: relative;
    top: unset;
    right: unset;
    margin-top: 15px;
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
    font-size: 14px;
    line-height: 30px;
  }
`;

const Weekdays = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 24px;
  width: 100%;
`;

const weekItemCss = (isActive: boolean) => css`
  flex: 1;
  padding: 10px 0;
  border-radius: 16px;
  background: ${({ theme }) =>
    isActive ? theme.app.palette.gray[800] : "transparent"};
  color: ${({ theme }) =>
    isActive ? theme.app.palette.gray[0] : theme.app.text.dark2};

  dl {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;

    dt {
      font-size: 14px;
      font-weight: 400;
    }
    dd {
      font-size: 16px;
    }
  }
`;

const DateWrapper = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 32px;
  width: 100%;
`;

const DateItem = styled.li<{ $weekday: number; $isToday: boolean }>`
  align-self: stretch;
  z-index: ${({ $isToday }) => ($isToday ? 1 : 0)};
  margin-left: -1px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 500px;
  border: 1px solid
    ${({ $isToday, theme }) =>
      $isToday ? theme.app.bg.reverse : theme.app.border};
  box-shadow: ${({ $isToday }) =>
    $isToday ? "0 0 10px rgba(0, 0, 0, 0.1)" : "unset"};
  overflow: hidden;

  strong {
    padding: 4px 0;
    width: 100%;
    font-size: 16px;
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.app.border};
    background: ${({ theme }) => theme.app.bg.main};
    color: ${({ $weekday, theme }) => {
      switch ($weekday) {
        case 6:
          return theme.app.palette.blue[350];
        case 0:
        case 7:
          return theme.app.palette.red[250];
        default:
          return theme.app.text.black;
      }
    }};
  }

  ul {
    display: flex;
    flex-direction: column;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 16px;
  width: 100%;
`;
