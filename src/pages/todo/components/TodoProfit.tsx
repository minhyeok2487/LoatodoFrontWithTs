import { CharacterType } from "../../../core/types/Character.type";
import { FC } from "react";

interface Props {
  characters: CharacterType[];
}

const TodoProfit:FC<Props> = ({characters}) => {
  //1. 예상 일일 수익
  const totalDayGold = characters.reduce((accumulator, character) => {
    if (character.settings.showChaos) {
      accumulator += character.chaosGold;
    }
    if (character.settings.showGuardian) {
      accumulator += character.guardianGold;
    }
    return accumulator;
  }, 0);

  //2. 일일 수익
  const getDayGold = characters.reduce((accumulator, character) => {
    if (character.chaosCheck >= 1) {
      for (var i = 0; i < character.chaosCheck; i++) {
        accumulator += character.chaosGold / 2;
      }
    }
    if (character.guardianCheck === 1) {
      accumulator += character.guardianGold;
    }
    return accumulator;
  }, 0);

  //3. 예상 주간 수익
  const totalWeekGold = characters.reduce((accumulator, character) => {
    if (character.goldCharacter) {
      character.todoList.forEach((todo) => {
        accumulator += todo.gold;
      });
    }
    return accumulator;
  }, 0);

  //4. 주간 수익
  let getWeekGold = characters.reduce((accumulator, character) => {
    if (character.goldCharacter) {
      accumulator += character.weekRaidGold;
    }
    return accumulator;
  }, 0);

  let percentage = ((getWeekGold / totalWeekGold) * 100).toFixed(1);
  if (percentage === "NaN") {
    percentage = "0.0";
    getWeekGold = 0.00;
  }

  return (
    <div className="setting-wrap profit-wrap">
      <div className="content-box">
        <p>일일 수익</p>
        <span className="bar">
          <i style={{ width: `${(getDayGold / totalDayGold) * 100}%` }}></i>
          <em style={{ textAlign: "center" }}>
            {((getDayGold / totalDayGold) * 100).toFixed(1)} %
          </em>
        </span>
        <p>
          {getDayGold.toFixed(2)} / <span>{totalDayGold.toFixed(2)}</span>G
        </p>
      </div>
      <div className="content-box">
        <p>주간 수익</p>
        <span className="bar">
          <i style={{ width: `${percentage}%` }}></i>
          <em style={{ textAlign: "center" }}>{percentage} %</em>
        </span>
        <p className={`${percentage === "100" ? "on" : ""}`}>
          {getWeekGold.toLocaleString()} /{" "}
          <span>{totalWeekGold.toLocaleString()}</span>G
        </p>
      </div>
    </div>
  );
};

export default TodoProfit;
