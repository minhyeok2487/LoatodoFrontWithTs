import type { FC } from "react";
import styled from "styled-components";

import { Character } from "@core/types/character";

import GoldIcon from "@assets/images/ico_gold.png";

interface Props {
  characters: Character[];
}

const Profit: FC<Props> = ({ characters }) => {
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
          <Gauge $process={(getDayGold / totalDayGold) * 100} $type="daily">
            <span>
              <em>{((getDayGold / totalDayGold) * 100).toFixed(1)} %</em>
            </span>
          </Gauge>
        </dd>
        <Gold>
          {getDayGold.toFixed(2)} / {totalDayGold.toFixed(2)} G
        </Gold>
      </Box>
      <Box>
        <dt>주간 수익</dt>
        <dd>
          <Gauge $process={percentage} $type="weekly">
            <span>
              <em>{percentage} %</em>
            </span>
          </Gauge>
        </dd>
        <Gold>
          {getWeekGold.toLocaleString()} / {totalWeekGold.toLocaleString()} G
        </Gold>
      </Box>
    </Wrapper>
  );
};

export default Profit;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
  }
`;

const Box = styled.dl`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  background: ${({ theme }) => theme.app.bg.light};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;

  dt {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.app.text.dark2};
    line-height: 1;
  }

  dd {
    display: flex;
    flex-direction: column;
    margin-bottom: 2px;
    gap: 8px;
    width: 100%;
  }
`;

const Gauge = styled.div<{ $process: number; $type: "daily" | "weekly" }>`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 5px auto 0;
  width: 350px;
  height: 18px;
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.main};

  ${({ theme }) => theme.medias.max600} {
    width: 90%;
  }

  span {
    width: ${({ $process }) => $process}%;
    height: 100%;
    background: ${({ $type, theme }) => {
      switch ($type) {
        case "daily":
          return theme.app.bar.blue;
        case "weekly":
          return theme.app.bar.red;
        default:
          return theme.app.white;
      }
    }};
    border-radius: 8px;

    em {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: ${({ theme }) => theme.app.text.dark2};
      font-size: 13px;
      line-height: 1;
    }
  }
`;

const Gold = styled.span`
  padding-left: 26px;
  line-height: 19px;
  background: url(${GoldIcon}) no-repeat;
  background-position: 0 0;
  font-size: 14px;
`;
