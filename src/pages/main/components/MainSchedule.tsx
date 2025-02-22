import { MdKeyboardArrowLeft } from "@react-icons/all-files/md/MdKeyboardArrowLeft";
import { MdKeyboardArrowRight } from "@react-icons/all-files/md/MdKeyboardArrowRight";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";

import useSchedules from "@core/hooks/queries/schedule/useSchedules";
import { getWeekdayNumber } from "@core/utils";

import Button from "@components/Button";
import SortedScheduleList from "@components/SortedScheduleList";

import WaitingImage from "@assets/images/waiting.png";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";

const MainSchedule = () => {
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
    <BoxWrapper $flex={2}>
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

          <Button variant="outlined" onClick={() => navigate("/schedule")}>
            일정 바로가기
          </Button>
        </Header>

        <Body>
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
                <span>오늘 일정이 없어요.</span>
              </NoSchedule>
            ) : (
              <ScheduleList>
                <SortedScheduleList
                  data={getSchedules.data.filter((item) => {
                    return getWeekdayNumber(item.dayOfWeek) === currentWeekday;
                  })}
                />
              </ScheduleList>
            )}
          </ScheduleWrapper>
        </Body>
      </Wrapper>
    </BoxWrapper>
  );
};

export default MainSchedule;

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

const ScheduleWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  padding: 16px 16px 4px 16px;
  max-height: 179px;
  color: ${({ theme }) => theme.app.text.dark2};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const Today = styled.span`
  padding-bottom: 14px;
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
  padding: 12px;

  img {
    width: 75px;
    height: 75px;
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
