import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import styled from "styled-components";

import { useUpdateHellKey } from "@core/hooks/mutations/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import CounterActionButton, { CounterValue } from "./CounterActionButton";

interface Props {
  character: Character;
  friend?: Friend;
}

const HellKey = ({ character, friend }: Props) => {
  const updateHellKey = useUpdateHellKey({
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
          disabled={character.hellKey <= 0}
          onClick={() => {
            updateHellKey.mutate({
              friendUsername: friend?.friendUsername,
              characterId: character.characterId,
              num: -1,
            });
          }}
        >
          <FiMinus />
        </CounterActionButton>
        <CounterValue>{character.hellKey} 개</CounterValue>
        <CounterActionButton
          onClick={() => {
            updateHellKey.mutate({
              friendUsername: friend?.friendUsername,
              characterId: character.characterId,
              num: 1,
            });
          }}
        >
          <FiPlus />
        </CounterActionButton>
        {" "}지옥 열쇠
      </Counter>
    </Wrapper>
  );
};

export default HellKey;

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
