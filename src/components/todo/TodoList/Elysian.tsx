import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import styled from "styled-components";

import {
  useCheckAllElysian,
  useCheckElysian,
} from "@core/hooks/mutations/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import CounterActionButton, { CounterValue } from "./element/CounterActionButton";

interface Props {
  character: Character;
  friend?: Friend;
}

const Elysian = ({ character, friend }: Props) => {
  const { mutate: checkElysian } = useCheckElysian({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });
    },
  });

  const { mutate: checkAllElysian } = useCheckAllElysian({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });
    },
  });

  const handleIncrement = () => {
    if (character.elysianCount < 5) {
      checkElysian({
        friendUsername: friend?.friendUsername,
        characterId: character.characterId,
        action: "INCREMENT",
      });
    }
  };

  const handleDecrement = () => {
    if (character.elysianCount > 0) {
      checkElysian({
        friendUsername: friend?.friendUsername,
        characterId: character.characterId,
        action: "DECREMENT",
      });
    }
  };

  const handleCheckAll = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();

    checkAllElysian({
      friendUsername: friend?.friendUsername,
      characterId: character.characterId,
    });
  };

  const handleClick = () => {
    checkAllElysian({
      friendUsername: friend?.friendUsername,
      characterId: character.characterId,
    });
  };

  return (
    <Wrapper>
      <Counter>
        <CounterActionButton
          disabled={character.elysianCount <= 0}
          onClick={handleDecrement}
        >
          <FiMinus />
        </CounterActionButton>
        <CounterValue>{character.elysianCount} / 5</CounterValue>
        <CounterActionButton
          disabled={character.elysianCount >= 5}
          onClick={handleIncrement}
        >
          <FiPlus />
        </CounterActionButton>
        <Label onContextMenu={handleCheckAll} onClick={handleClick}>
          낙원(천상)
        </Label>
      </Counter>
    </Wrapper>
  );
};

export default Elysian;

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

const Label = styled.span`
  cursor: pointer;
`;
