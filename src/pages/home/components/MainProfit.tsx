import styled from "@emotion/styled";
import { FC } from "react";

import { CharacterType } from "@core/types/Character.type";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";

interface Props {
  characters?: CharacterType[];
}

const MainProfit: FC<Props> = ({ characters }) => {
  if (characters === undefined) {
    return null;
  }

  // 1. 총 일일 숙제
  const totalDay = characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.settings.showCharacter) {
      if (character.settings.showChaos) {
        newAcc += 1;
      }
      if (character.settings.showGuardian) {
        newAcc += 1;
      }
    }

    return newAcc;
  }, 0);

  // 2. 일일 숙제
  const getDay = characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.settings.showCharacter) {
      if (character.chaosCheck === 2) {
        newAcc += 1;
      }
      if (character.guardianCheck === 1) {
        newAcc += 1;
      }
    }

    return newAcc;
  }, 0);

  // 3. 이번주 총 주간 숙제
  const totalWeek = characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.goldCharacter) {
      character.todoList.forEach((todo) => {
        newAcc += 1;
      });
    }

    return newAcc;
  }, 0);

  // 4. 이번주 주간 숙제
  const getWeek = characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.goldCharacter) {
      character.todoList.forEach((todo) => {
        if (todo.check) {
          newAcc += 1;
        }
      });
    }

    return newAcc;
  }, 0);

  // 5. 주간 일일 수익
  const totalWeekDayTodoGold = characters.reduce((acc, character) => {
    return acc + character.weekDayTodoGold;
  }, 0);

  // 5. 주간 레이드 수익
  const totalWeekRaidGold = characters.reduce((acc, character) => {
    return acc + character.weekRaidGold;
  }, 0);

  return (
    <BoxWrapper flex={2} pb={1}>
      <BoxTitle>내 숙제</BoxTitle>

      <GaugeBox>
        <GagueTitle>
          <span>일일 숙제</span>
          <span>
            완료 {getDay}
            <strong> / 총 {totalDay}</strong>
          </span>
        </GagueTitle>
        <Gauge process={(getDay / totalDay) * 100} type="daily">
          <span />
          <strong>{((getDay / totalDay) * 100).toFixed(1)} %</strong>
        </Gauge>
      </GaugeBox>
      <GaugeBox>
        <GagueTitle>
          <span>주간 숙제</span>
          <span>
            <em>완료 {getWeek}</em> / 총 {totalWeek}
          </span>
        </GagueTitle>
        <Gauge process={(getWeek / totalWeek) * 100} type="weekly">
          <span />
          <strong>
            {totalWeek > 0 ? ((getWeek / totalWeek) * 100).toFixed(1) : 0} %
          </strong>
        </Gauge>
      </GaugeBox>
      <ProfitBox>
        <ul>
          <li>
            <dl>
              <dt>
                주간 <i>총</i> 수익<i>(A+B)</i>
              </dt>
              <dd>{(totalWeekDayTodoGold + totalWeekRaidGold).toFixed(2)} G</dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>
                주간 <i>일일</i> 수익<i>(A)</i>
              </dt>
              <dd>{totalWeekDayTodoGold.toFixed(2)} G</dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>
                주간 <i>레이드</i> 수익<i>(B)</i>
              </dt>
              <dd>{totalWeekRaidGold} G</dd>
            </dl>
          </li>
        </ul>
      </ProfitBox>
    </BoxWrapper>
  );
};

export default MainProfit;

const GaugeBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  width: 100%;

  & + & {
    margin-top: 14px;
  }
`;

const GagueTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.app.text.light1};

  strong {
    color: ${({ theme }) => theme.app.text.light2};
  }
`;

const Gauge = styled.div<{ process: number; type: "daily" | "weekly" }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  height: 20px;
  border-radius: 10px;

  background: ${({ theme }) => theme.app.bg.main};

  span {
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ process }) => process}%;
    height: 100%;
    background: ${({ type, theme }) => {
      switch (type) {
        case "daily":
          return theme.app.bar.blue;
        case "weekly":
          return theme.app.bar.red;
        default:
          return theme.app.white;
      }
    }};
    border-radius: 10px;
  }

  strong {
    color: ${({ theme }) => theme.app.text.dark2};
    font-weight: 400;
    font-size: 14px;
  }
`;

const ProfitBox = styled.dl`
  padding-top: 24px;
  margin-top: 16px;
  border-top: 1px dashed ${({ theme }) => theme.app.border};

  ul {
    display: flex;
    justify-content: space-around;
    align-items: center;

    li {
      &:nth-child(1) {
        i {
          color: ${({ theme }) => theme.app.text.black};
        }
      }

      &:nth-child(2) {
        i {
          color: ${({ theme }) => theme.app.red};
        }
      }

      &:nth-child(3) {
        i {
          color: ${({ theme }) => theme.app.blue};
        }
      }
    }
  }

  dl {
    display: flex;
    flex-direction: column;
    align-items: center;

    dt {
      font-size: 15px;
      font-weight: 300;
      color: ${({ theme }) => theme.app.text.light1};

      ${({theme}) => theme.medias.max900}{
        font-size:12px;
        font-weight:400;
      }
    }

    dd {
      color: ${({ theme }) => theme.app.text.dark2};
      font-size: 20px;
      font-weight: 700;

      ${({theme}) => theme.medias.max900}{
        font-size:16px;
      }
    }
  }
`;
