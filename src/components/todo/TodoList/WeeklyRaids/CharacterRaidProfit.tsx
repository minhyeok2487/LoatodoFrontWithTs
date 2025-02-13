import { type FC, useEffect, useState } from "react";
import styled from "styled-components";

import type { Character } from "@core/types/character";

import GoldIcon from "@assets/images/ico_gold.png";

interface Props {
  character: Character;
}

const CharacterRaidProfit: FC<Props> = ({ character }) => {
  const [currentEarnings, setCurrentEarnings] = useState<number>(0);
  const [expectedEarnings, setExpectedEarnings] = useState<number>(0);

  // 1. 예상 주간 수익
  const totalWeekGold = character.todoList.reduce((acc, todo) => {
    return acc + todo.realGold;
  }, 0);

  // 2. 주간 수익
  const getWeekGold = character.weekRaidGold;

  useEffect(() => {
    // 현재 수익과 예상 수익 계산 로직 추가
    const calculateEarnings = () => {
      setCurrentEarnings(getWeekGold);
      setExpectedEarnings(totalWeekGold);
    };

    calculateEarnings();
  }, [character.todoList]);

  return (
    <Gold $isDone={currentEarnings === expectedEarnings}>
      {currentEarnings.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}{" "}
      /{" "}
      {expectedEarnings.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}{" "}
      G
    </Gold>
  );
};

const Gold = styled.span<{
  $isDone: boolean;
}>`
  padding-left: 26px;
  line-height: 19px;
  background: url(${GoldIcon}) no-repeat;
  background-position: 0 0;
  font-size: 14px;
  opacity: ${({ $isDone }) => ($isDone ? 0.3 : 1)};
  text-decoration: ${({ $isDone }) => ($isDone ? "line-through" : "none")};
  color: ${({ $isDone, theme }) =>
    $isDone ? theme.app.text.gray1 : theme.app.text.dark2};
`;

export default CharacterRaidProfit;
