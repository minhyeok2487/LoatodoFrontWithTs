import { MdKeyboardArrowLeft } from "@react-icons/all-files/md/MdKeyboardArrowLeft";
import { MdKeyboardArrowRight } from "@react-icons/all-files/md/MdKeyboardArrowRight";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import useSchedules from "@core/hooks/queries/schedule/useSchedules";
import { getWeekdayNumber } from "@core/utils";

import Button from "@components/Button";

import WaitingImage from "@assets/images/waiting.png";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";

const MainWeekly = () => {
  const navigate = useNavigate();

  const today = useMemo(() => dayjs(), []);
  const [currentWeekday, setCurrentWeekday] = useState(today.get("day")); // 모바일모드일 때 현재 선택된 요일
  const [startDate, setStartDate] = useState(
    today.get("day") === 0
      ? today.subtract(1, "week").set("day", 1)
      : today.set("day", 1)
  );

  const getSchedules = useSchedules(startDate);

  return (
    <BoxWrapper $flex={3}>
      <Wrapper>
        <Header>
          <TitleWrapper>
            <BoxTitle>주간 레이드 일정</BoxTitle>

            <Controller>
              <button
                type="button"
                onClick={() => setStartDate(startDate.subtract(1, "week"))}
              >
                <MdKeyboardArrowLeft />
              </button>
              <span>{startDate.format("YYYY년 MM월")}</span>
              <button
                type="button"
                onClick={() => {
                  setStartDate(startDate.add(1, "week"));
                }}
              >
                <MdKeyboardArrowRight />
              </button>
            </Controller>
          </TitleWrapper>

          <Button onClick={() => navigate("/schedule")}>일정 바로가기</Button>
        </Header>

        <Body>
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

          <ScheduleWrapper>
            <Today>
              {dayjs(startDate)
                .set("day", currentWeekday)
                .format("YYYY년 MM월 DD일(dd)")}
            </Today>
            {!getSchedules.data ||
            getSchedules.data?.filter((item) => {
              return getWeekdayNumber(item.dayOfWeek) === currentWeekday;
            }).length === 0 ? (
              <NoSchedule>
                <img alt="우는 모코코" src={WaitingImage} />
                <span>오늘의 일정이 없습니다.</span>
              </NoSchedule>
            ) : (
              <ScheduleList>
                {getSchedules.data
                  ?.filter((item) => {
                    return getWeekdayNumber(item.dayOfWeek) === currentWeekday;
                  })
                  .map((item) => {
                    return (
                      <ScheduleItem
                        key={item.scheduleId}
                        $isAlone={item.scheduleCategory === "ALONE"}
                        $isRaid={item.scheduleRaidCategory === "RAID"}
                        $raidName={item.raidName}
                      >
                        <div>
                          <div className="inner-wrapper">
                            <span className="schedule-category">
                              {item.scheduleCategory === "ALONE"
                                ? "나"
                                : "깐부"}
                            </span>

                            <div className="description-box">
                              <span className="time">
                                {dayjs(
                                  startDate.format(`YYYY-MM-DD ${item.time}`)
                                ).format("A hh:mm")}
                              </span>

                              <span className="raid-name">{item.raidName}</span>

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
                        </div>
                      </ScheduleItem>
                    );
                  })}
              </ScheduleList>
            )}
          </ScheduleWrapper>
        </Body>
      </Wrapper>
    </BoxWrapper>
  );
};

export default MainWeekly;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const Controller = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.app.text.dark2};
  font-size: 15px;
  line-height: 24px;

  ${({ theme }) => theme.medias.max600} {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
  }

  ${({ theme }) => theme.medias.max400} {
    top: 55px;
  }

  button {
    font-size: 24px;
  }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 12px;

  ${({ theme }) => theme.medias.max900} {
    margin-top: 52px;
  }

  ${({ theme }) => theme.medias.max400} {
    margin-top: 62px;
  }
`;

const Weekdays = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
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

const ScheduleWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  padding: 12px 12px 4px 12px;
  max-height: 179px;
  color: ${({ theme }) => theme.app.text.dark2};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const Today = styled.span`
  padding-bottom: 8px;
  display: block;
  width: 100%;
  font-size: 16px;
  text-align: left;
  line-height: 1;
  border-bottom: 1px dashed ${({ theme }) => theme.app.border};
`;

const NoSchedule = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  img {
    width: 85px;
    height: 85px;
  }
  span {
    font-size: 16px;
    line-height: 1;
  }
`;

const ScheduleList = styled.ul`
  flex: 1;
  width: 100%;
  overflow-y: auto;
`;

const ScheduleItem = styled.li<{
  $isAlone: boolean;
  $isRaid: boolean;
  $raidName: string;
}>`
  width: 100%;

  & > div {
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
