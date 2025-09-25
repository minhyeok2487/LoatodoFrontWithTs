import styled from "styled-components";

import {
  useCheckAllElysian,
  useCheckElysian,
} from "@core/hooks/mutations/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import Button from "@components/Button";

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
    <Wrapper $isDone={character.elysianCount === 5}>
      <Content onContextMenu={handleCheckAll} onClick={handleClick}>
        <span>낙원(천상)</span>
        <span>{character.elysianCount} / 5</span>
      </Content>
      <ButtonWrapper>
        <Button onClick={handleDecrement}>-</Button>
        <Button onClick={handleIncrement}>+</Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default Elysian;

const Wrapper = styled.div<{
  $isDone: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  font-size: 14px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  opacity: ${({ $isDone }) => ($isDone ? 0.5 : 1)};
`;

const Content = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 5px;

  button {
    width: 30px;
    height: 30px;
    min-width: 30px;
  }
`;
