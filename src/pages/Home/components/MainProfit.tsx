import { useState } from "react";
import { CharacterDto } from "../../../types/MemberResponse";
import { useCharacterData } from "../../../apis/Member.api";

const MainProfit = () => {
  const [dayTotalGold, setDayTotalGold] = useState(0);
  const [weekTotalGold, setWeekTotalGold] = useState(0);

  const { data } = useCharacterData();
  if (data == undefined) {
    return null;
  }
  const characterList: CharacterDto[] = Object.values(
    data.characterDtoMap
  ).flat();

  //1. 총 일일 숙제
  const totalDay = characterList.reduce((accumulator, character) => {
    if (character.settings.showCharacter) {
      if (character.settings.showChaos) {
        accumulator++;
      }
      if (character.settings.showGuardian) {
        accumulator++;
      }
    }
    return accumulator;
  }, 0);

  //2. 일일 숙제
  const getDay = characterList.reduce((accumulator, character) => {
    if (character.settings.showCharacter) {
      if (character.chaosCheck === 2) {
        accumulator++;
      }
      if (character.guardianCheck === 1) {
        accumulator++;
      }
    }
    return accumulator;
  }, 0);

  //3. 총 주간 숙제
  const totalWeek = characterList.reduce((accumulator, character) => {
    if (character.goldCharacter) {
      character.todoList.forEach((todo) => {
        accumulator++;
      });
    }
    return accumulator;
  }, 0);

  //4. 주간 숙제
  const getWeek = characterList.reduce((accumulator, character) => {
    if (character.goldCharacter) {
      character.todoList.forEach((todo) => {
        if (todo.check) {
          accumulator++;
        }
      });
    }
    return accumulator;
  }, 0);

  return (
    <div className="main-profit">
      <h1>내 숙제</h1>
      <div className="main-profit-box days">
        <div className="main-profit-text">
          <span className="tit">일일 숙제</span>
          <span>
            <em>완료 {getDay}</em> / 총 {totalDay}
          </span>
        </div>
        <span className="bar">
          <i style={{ width: `${(getDay / totalDay) * 100}%` }}></i>
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
          <i style={{ width: `${(getWeek / totalWeek) * 100}%` }}></i>
          <em>{((getWeek / totalWeek) * 100).toFixed(1)} %</em>
        </span>
      </div>
      <div>
        <ul className="total">
          <li>
            <span>
              주간 <i>총</i> 수익<i>(A+B)</i>
            </span>{" "}
            <em>{(dayTotalGold + weekTotalGold).toFixed(2)} G</em>
          </li>
          <li>
            <span>
              주간 <i>일일</i> 수익<i>(A)</i>
            </span>{" "}
            <em>{dayTotalGold.toFixed(2)} G</em>
          </li>
          <li>
            <span>
              주간 <i>레이드</i> 수익<i>(B)</i>
            </span>{" "}
            <em>{weekTotalGold} G</em>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MainProfit;
