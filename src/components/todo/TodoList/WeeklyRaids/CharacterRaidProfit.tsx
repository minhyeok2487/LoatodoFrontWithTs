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
  const [currentCharacterEarnings, setCurrentCharacterEarnings] =
    useState<number>(0);
  const [expectedCharacterEarnings, setExpectedCharacterEarnings] =
    useState<number>(0);

  // 1. 예상 주간 수익
  const totalWeekGold = character.todoList.reduce((acc, todo) => {
    return acc + todo.realGold;
  }, 0);

  // 2. 주간 수익
  const getWeekGold = character.weekRaidGold;

  // 3. 예상 캐릭터 주간 수익
  const totalCharacterWeekGold = character.todoList.reduce((acc, todo) => {
    return acc + todo.characterGold;
  }, 0);

  // 4. 주간 수익
  const getCharacterWeekGold = character.weekCharacterRaidGold;

  useEffect(() => {
    // 현재 수익과 예상 수익 계산 로직 추가
    const calculateEarnings = () => {
      setCurrentEarnings(getWeekGold);
      setExpectedEarnings(totalWeekGold);
      setCurrentCharacterEarnings(getCharacterWeekGold);
      setExpectedCharacterEarnings(totalCharacterWeekGold);
    };

    calculateEarnings();
  }, [
    character.todoList,
    getWeekGold,
    totalWeekGold,
    getCharacterWeekGold,
    totalCharacterWeekGold,
  ]);

  return (
    <Gold
      $isDone={
        currentEarnings === expectedEarnings &&
        currentCharacterEarnings === expectedCharacterEarnings
      }
    >
      <GoldRow>
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
      </GoldRow>
      {expectedCharacterEarnings !== 0 && (
        <CharacterGoldRow>
          {currentCharacterEarnings.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}{" "}
          /{" "}
          {expectedCharacterEarnings.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </CharacterGoldRow>
      )}
    </Gold>
  );
};

const Gold = styled.span<{
  $isDone: boolean;
}>`
  padding-left: 18px;
  background: url(${GoldIcon}) no-repeat;
  background-position: left top;
  background-size: 13px;
  opacity: ${({ $isDone }) => ($isDone ? 0.3 : 1)};
  text-decoration: ${({ $isDone }) => ($isDone ? "line-through" : "none")};
  color: ${({ $isDone, theme }) =>
    $isDone ? theme.app.text.gray1 : theme.app.text.light1};
  width: 100%;
  text-align: left;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 2px;
`;

const GoldRow = styled.div`
  font-size: 13px;
  line-height: 1.2;
`;

const CharacterGoldRow = styled.div`
  font-size: 10px;
  opacity: 0.7;
  color: ${({ theme }) => theme.app.text.gray1};
  line-height: 1.2;
`;

export default CharacterRaidProfit;
