import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import styled from "styled-components";

import { useUpdateTrialSand } from "@core/hooks/mutations/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import CounterActionButton, { CounterValue } from "./CounterActionButton";

interface Props {
  character: Character;
  friend?: Friend;
}

const MAX_TRIAL_SAND = 5;

const TrialSand = ({ character, friend }: Props) => {
  const updateTrialSand = useUpdateTrialSand({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });
    },
  });

  return (
    <Wrapper>
      <Counter>
        <CounterActionButton
          disabled={character.trialSand <= 0}
          onClick={() => {
            updateTrialSand.mutate({
              friendUsername: friend?.friendUsername,
              characterId: character.characterId,
              num: -1,
            });
          }}
        >
          <FiMinus />
        </CounterActionButton>
        <CounterValue>{character.trialSand} / {MAX_TRIAL_SAND}</CounterValue>
        <CounterActionButton
          disabled={character.trialSand >= MAX_TRIAL_SAND}
          onClick={() => {
            updateTrialSand.mutate({
              friendUsername: friend?.friendUsername,
              characterId: character.characterId,
              num: 1,
            });
          }}
        >
          <FiPlus />
        </CounterActionButton>
        {" "}시련의 모래
      </Counter>
    </Wrapper>
  );
};

export default TrialSand;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  font-size: 14px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const Counter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  margin: 5px 0;
`;
