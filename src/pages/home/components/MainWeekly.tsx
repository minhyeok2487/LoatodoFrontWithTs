import { MdKeyboardArrowLeft } from "@react-icons/all-files/md/MdKeyboardArrowLeft";
import { MdKeyboardArrowRight } from "@react-icons/all-files/md/MdKeyboardArrowRight";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import Button from "@components/Button";

import WaitingImage from "@assets/images/waiting.png";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";

const MainWeekly = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(dayjs().format("YYYY-MM-DD"));

  const handlePrevWeek = () => {
    setCurrentDate(dayjs(currentDate).add(-7, "days").format("YYYY-MM-DD"));
  };

  const handleNextWeek = () => {
    setCurrentDate(dayjs(currentDate).add(7, "days").format("YYYY-MM-DD"));
  };

  const dayOfWeek = dayjs(currentDate).weekday();
  const offset = dayOfWeek >= 3 ? dayOfWeek - 3 : 4 + dayOfWeek;
  const wednesdayDate = dayjs(currentDate).add(-offset, "days");

  return (
    <BoxWrapper $flex={3}>
      <Header>
        <TitleWrapper>
          <BoxTitle>주간 레이드 일정</BoxTitle>

          <Controller>
            <button type="button" onClick={handlePrevWeek}>
              <MdKeyboardArrowLeft />
            </button>
            <span>{dayjs(currentDate).format("YYYY년 MM월")}</span>
            <button type="button" onClick={handleNextWeek}>
              <MdKeyboardArrowRight />
            </button>
          </Controller>
        </TitleWrapper>

        <Button onClick={() => navigate("/schedule")}>일정 바로가기</Button>
      </Header>

      <Body>
        <Weekdays>
          {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
            const date = dayjs(wednesdayDate).add(offset, "days");

            return (
              <WeekItem
                key={offset}
                type="button"
                $isActive={
                  offset === (dayOfWeek >= 3 ? dayOfWeek - 3 : 4 + dayOfWeek)
                }
                onClick={() => setCurrentDate(date.format("YYYY-MM-DD"))}
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
          <Today>{dayjs(currentDate).format("YYYY년 MM월 DD일 dd")}</Today>
          {/* <ul>
            <li>캐릭터이름1 / 카멘 하드 / with. 깐부1, 깐부2</li>
            <li>캐릭터이름2 / 일리아칸 하드 / 메모메모메모</li>*
          </ul> */}
          <Waiting>
            <img alt="우는 모코코" src={WaitingImage} />
            <span>기능 준비 중입니다.</span>
          </Waiting>
        </ScheduleWrapper>
      </Body>
    </BoxWrapper>
  );
};

export default MainWeekly;

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
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  color: ${({ theme }) => theme.app.text.dark2};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const Today = styled.span`
  display: block;
  width: 100%;
  font-size: 16px;
  text-align: left;
`;

const Waiting = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 85px;
    height: 85px;
  }
  span {
    margin-top: 10px;
    font-size: 16px;
  }
`;
