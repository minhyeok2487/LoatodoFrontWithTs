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
    <BoxWrapper flex={2}>
      <BoxTitle>내 숙제</BoxTitle>
      <div className="main-profit-box days">
        <div className="main-profit-text">
          <span className="tit">일일 숙제</span>
          <span>
            <em>완료 {getDay}</em> / 총 {totalDay}
          </span>
        </div>
        <span className="bar">
          <i style={{ width: `${(getDay / totalDay) * 100}%` }} />
          <em>{((getDay / totalDay) * 100).toFixed(1)} %</em>
        </span>
      </div>
      <div className="main-profit-box weeks">
        <div className="main-profit-text">
          <span className="tit">주간 숙제</span>
          <span>
            <em>완료 {getWeek}</em> / 총 {totalWeek}
          </span>
        </div>
        <span className="bar">
          <i style={{ width: `${(getWeek / totalWeek) * 100}%` }} />
          <em>
            {totalWeek > 0 ? ((getWeek / totalWeek) * 100).toFixed(1) : 0} %
          </em>
        </span>
      </div>
      <div>
        <ul className="total">
          <li>
            <span>
              주간 <i>총</i> 수익<i>(A+B)</i>
            </span>{" "}
            <em>{(totalWeekDayTodoGold + totalWeekRaidGold).toFixed(2)} G</em>
          </li>
          <li>
            <span>
              주간 <i>일일</i> 수익<i>(A)</i>
            </span>{" "}
            <em>{totalWeekDayTodoGold.toFixed(2)} G</em>
          </li>
          <li>
            <span>
              주간 <i>레이드</i> 수익<i>(B)</i>
            </span>{" "}
            <em>{totalWeekRaidGold} G</em>
          </li>
        </ul>
      </div>
    </BoxWrapper>
  );
};

export default MainProfit;
