import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import useSchedules from "@core/hooks/queries/schedule/useSchedules";
import useIsGuest from "@core/hooks/useIsGuest";
import useModalState from "@core/hooks/useModalState";
import type { ScheduleCategory, ScheduleItem } from "@core/types/schedule";
import { getWeekdayNumber } from "@core/utils";

import Button from "@components/Button";
import SortedScheduleList from "@components/SortedScheduleList";

import ArrowIcon from "@assets/images/ico_cal_arr.svg";

import Header from "../../layouts/common/Header/index";
import FormModal from "./components/FormModal";

const ScheduleIndex = () => {
  const isGuest = useIsGuest();
  const [createModal, setCreateModal] = useModalState<boolean>();
  const [targetSchedule, setTargetSchedule] = useModalState<ScheduleItem>();

  const today = useMemo(() => dayjs(), []);
  const [filter, setFilter] = useState<ScheduleCategory | "ALL">("ALL");
  const [startDate, setStartDate] = useState(today.startOf("month"));

  const getSchedules = useSchedules(startDate);

  return (
    <WideDefaultLayout pageTitle="일정">
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
            <Button size="large" onClick={() => setCreateModal(true)}>
              일정 추가
            </Button>
          </Buttons>
        </HeaderGroup>

        <MonthGrid>
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <WeekdayHeader key={index}>{day}</WeekdayHeader>
          ))}
          {[...Array(startDate.daysInMonth())].map((_, index) => {
            const date = startDate.add(index, "day");
            const weekday = date.get("day");
            const isToday = date.isSame(dayjs(), "date");

            return (
              <DateItem key={index} $weekday={weekday} $isToday={isToday}>
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
`;

const Filters = styled.div`
  display: flex;
  gap: 6px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const filterButtonCss = (isActive: boolean) => css`
  padding: 3px 16px;
  border-radius: 18px;
  color: ${({ theme }) =>
    isActive ? theme.app.palette.gray[0] : theme.app.text.light1};
  background: ${({ theme }) =>
    isActive ? theme.app.palette.gray[800] : theme.app.bg.gray1};
`;

const MonthGrid = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 24px;
  width: 100%;
  text-align: center;
  grid-template-columns: repeat(7, 1fr);
`;

const WeekdayHeader = styled.div`
  position: sticky;
  top: 70px;
  z-index: 10;
  font-weight: bold;
  padding: 5px;
  background: ${({ theme }) => theme.app.bg.reverse};
  color: ${({ theme }) => theme.app.text.reverse};
`;

const DateItem = styled.li<{ $weekday: number; $isToday: boolean }>`
  align-self: stretch;
  z-index: ${({ $isToday }) => ($isToday ? 1 : 0)};
  margin-left: -1px;
  flex: 1;
  display: flex;
  aspect-ratio: 4 / 7;
  width: 100%;
  flex-direction: column;
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
