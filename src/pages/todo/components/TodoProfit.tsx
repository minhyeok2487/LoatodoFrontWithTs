import styled from "@emotion/styled";
import type { FC } from "react";

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

  let percentage = Number(((getWeekGold / totalWeekGold) * 100).toFixed(1));
  if (Number.isNaN(percentage)) {
    percentage = 0.0;
    getWeekGold = 0.0;
  }

  return (
    <Wrapper>
      <Box>
        <dt>일일 수익</dt>
        <dd>
          <Gauge process={(getDayGold / totalDayGold) * 100} type="daily">
            <span />
            <strong>{(getDayGold / totalDayGold) * 100} %</strong>
          </Gauge>
        </dd>
        <p>
          {getDayGold.toFixed(2)} / <span>{totalDayGold.toFixed(2)}</span>G
        </p>
      </Box>
      <Box>
        <dt>주간 수익</dt>
        <dd>
          <Gauge process={percentage} type="weekly">
            <span />
            <strong>{percentage} %</strong>
          </Gauge>
        </dd>
        <p className={`${percentage === 100 ? "on" : ""}`}>
          {getWeekGold.toLocaleString()} /{" "}
          <span>{totalWeekGold.toLocaleString()}</span>G
        </p>
      </Box>
    </Wrapper>
  );
};

export default TodoProfit;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
`;

const Box = styled.dl`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: ${({ theme }) => theme.app.bg.light};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;

  dt {
    font-size: 16px;
    color: ${({ theme }) => theme.app.text.dark2};
    line-height: 1;
  }

  dd {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const Gauge = styled.div<{ process: number; type: "daily" | "weekly" }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  width: 350px;
  height: 15px;
  border-radius: 8px;
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
    border-radius: 8px;
  }

  strong {
    color: ${({ theme }) => theme.app.text.dark2};
    font-size: 12px;
    font-weight: 300;
  }
`;

const Gold = styled.div``;
