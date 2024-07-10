import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import useSchedules from "@core/hooks/queries/schedule/useSchedules";
import useModalState from "@core/hooks/useModalState";
import useWindowSize from "@core/hooks/useWindowSize";
import type { ScheduleCategory } from "@core/types/schedule";
import { getWeekdayNumber } from "@core/utils";

import ArrowIcon from "@assets/images/ico_cal_arr.svg";

import FormModal from "./components/FormModal";

const ScheduleIndex = () => {
  const [createModal, setCreateModal] = useModalState<boolean>();
  const { width } = useWindowSize();
  const isMobile = width < 900;

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
          <FilterButton
            $isActive={filter === "ALL"}
            onClick={() => {
              setFilter("ALL");
            }}
          >
            모든 일정
          </FilterButton>
          <FilterButton
            $isActive={filter === "ALONE"}
            onClick={() => {
              setFilter("ALONE");
            }}
          >
            내 일정
          </FilterButton>
          <FilterButton
            $isActive={filter === "PARTY"}
            onClick={() => {
              setFilter("PARTY");
            }}
          >
            깐부 일정
          </FilterButton>
        </Filters>

        {isMobile && (
          <Weekdays>
            {[0, 1, 2, 3, 4, 5, 6].map((addDay) => {
              const date = dayjs(startDate).add(addDay, "days");

              return (
                <WeekItem
                  key={addDay}
                  type="button"
                  $isActive={
                    (addDay + 1 === 7 ? 0 : addDay + 1) === currentWeekday
                  }
                  onClick={() => setCurrentWeekday(date.get("day"))}
                >
                  <dl>
                    <dt>{date.get("date")}</dt>
                    <dd>{date.format("dd")}</dd>
                  </dl>
                </WeekItem>
              );
            })}
          </Weekdays>
        )}

        <DateWrapper>
          {[0, 1, 2, 3, 4, 5, 6]
            .filter((addDay) => {
              // addDay = 월요일이 0임
              // weekday = 일요일이 0임, addDay보다 1 높음
              return isMobile
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
                    {getSchedules.data
                      ?.filter((item) => {
                        return (
                          getWeekdayNumber(item.dayOfWeek) === weekday &&
                          (filter !== "ALL"
                            ? item.scheduleCategory === filter
                            : true)
                        );
                      })
                      .map((item) => {
                        return (
                          <ScheduleItem
                            key={item.scheduleId}
                            $isAlone={item.scheduleCategory === "ALONE"}
                            $isRaid={item.scheduleRaidCategory === "RAID"}
                            $raidName={item.raidName}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                toast.warn("기능 준비 중입니다.");
                              }}
                            >
                              <div className="inner-wrapper">
                                <span className="schedule-category">
                                  {item.scheduleCategory === "ALONE"
                                    ? "나"
                                    : "깐부"}
                                </span>

                                <div className="description-box">
                                  <span className="time">
                                    {dayjs(
                                      date.format(`YYYY-MM-DD ${item.time}`)
                                    ).format("A hh:mm")}
                                  </span>

                                  <span className="raid-name">
                                    {item.raidName}
                                  </span>

                                  <ul>
                                    <li>{item.leaderCharacterName}</li>
                                    {item.friendCharacterNames.map((name) => (
                                      <li key={name}>{name}</li>
                                    ))}
                                    {item.memo && (
                                      <li className="memo">{item.memo}</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </button>
                          </ScheduleItem>
                        );
                      })}
                  </ul>
                </DateItem>
              );
            })}
        </DateWrapper>

        <Buttons>
          <CreateButton onClick={() => setCreateModal(true)}>
            일정 추가
          </CreateButton>
        </Buttons>
      </Wrapper>

      <FormModal isOpen={!!createModal} onClose={() => setCreateModal()} />
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
  background: ${({ theme }) => theme.app.bg.light};
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

const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: 0 16px;
  font-size: 16px;
  line-height: 36px;
  border-radius: 18px;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.app.text.reverse : theme.app.text.light1};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.app.bg.reverse : theme.app.bg.gray1};

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

const WeekItem = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 10px 0;
  border-radius: 16px;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.app.bg.reverse : "transparent"};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.app.text.reverse : theme.app.text.dark2};

  &:hover {
    background: ${({ theme }) => theme.app.bg.reverse};
    color: ${({ theme }) => theme.app.text.reverse};
  }

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
          return theme.app.blue1;
        case 0:
        case 7:
          return theme.app.red;
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

const ScheduleItem = styled.li<{
  $isAlone: boolean;
  $isRaid: boolean;
  $raidName: string;
}>`
  width: 100%;

  button {
    width: 100%;
    padding: 10px 10px 0 10px;

    .inner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-bottom: 10px;
      width: 100%;
      border-bottom: 1px dashed ${({ theme }) => theme.app.border};

      .schedule-category {
        margin-bottom: 6px;
        width: 100%;
        background: ${({ $isAlone, theme }) =>
          $isAlone ? theme.app.pink2 : theme.app.sky1};
        line-height: 27px;
        color: ${({ theme }) => theme.app.black};
        text-align: center;
        font-size: 14px;
        border-radius: 6px;
      }

      .description-box {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0 4px;
        width: 100%;
        text-align: left;

        .time {
          font-size: 14px;
          font-weight: 600;
          color: ${({ theme }) => theme.app.text.black};
        }

        .raid-name {
          font-size: 16px;
          color: ${({ $raidName, $isRaid, theme }) => {
            if ($isRaid) {
              return $raidName.endsWith("하드")
                ? theme.app.text.red
                : theme.app.text.blue;
            }

            return theme.app.text.black;
          }};
        }

        ul {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;

          li {
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            padding-left: 5px;
            width: 100%;
            color: ${({ theme }) => theme.app.text.light1};
            font-size: 13px;
            line-height: 20px;

            &:before {
              content: "";
              position: absolute;
              left: 0;
              top: 9px;
              background: currentcolor;
              width: 2px;
              height: 2px;
              border-radius: 3px;
            }

            &.memo {
              display: block;
              color: ${({ theme }) => theme.app.text.light2};
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 16px;
  width: 100%;
`;

const CreateButton = styled.button`
  padding: 0 32px;
  line-height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => theme.app.semiBlack1};
  color: ${({ theme }) => theme.app.white};
  font-weight: 600;
`;
