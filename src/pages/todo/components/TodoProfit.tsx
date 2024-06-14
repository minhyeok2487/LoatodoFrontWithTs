import { FC } from "react";

import { CharacterType } from "@core/types/Character.type";

interface Props {
  characters: CharacterType[];
}

const TodoProfit: FC<Props> = ({ characters }) => {
  // 1. 예상 일일 수익
  const totalDayGold = characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.settings.showChaos) {
      newAcc += character.chaosGold;
    }

    if (character.settings.showGuardian) {
      newAcc += character.guardianGold;
    }

    return newAcc;
  }, 0);

  // 2. 일일 수익
  const getDayGold = characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.chaosCheck >= 1) {
      for (let i = 0; i < character.chaosCheck; i += 1) {
        newAcc += character.chaosGold / 2;
      }
    }

    if (character.guardianCheck === 1) {
      newAcc += character.guardianGold;
    }

    return newAcc;
  }, 0);

  // 3. 예상 주간 수익
  const totalWeekGold = characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.goldCharacter) {
      character.todoList.forEach((todo) => {
        newAcc += todo.gold;
      });
    }

    return newAcc;
  }, 0);

  // 4. 주간 수익
  let getWeekGold = characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.goldCharacter) {
      newAcc += character.weekRaidGold;
    }

    return newAcc;
  }, 0);

  let percentage = ((getWeekGold / totalWeekGold) * 100).toFixed(1);
  if (percentage === "NaN") {
    percentage = "0.0";
    getWeekGold = 0.0;
  }

  return (
    <div className="setting-wrap profit-wrap">
      <div className="content-box">
        <p>일일 수익</p>
        <span className="bar">
          <i style={{ width: `${(getDayGold / totalDayGold) * 100}%` }} />
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
          <i style={{ width: `${percentage}%` }} />
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
