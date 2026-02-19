import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import styled from "styled-components";

import { useUpdateHellKey } from "@core/hooks/mutations/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

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
        <ActionButton
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
        </ActionButton>
        {character.hellKey} 개
        <ActionButton
          onClick={() => {
            updateHellKey.mutate({
              friendUsername: friend?.friendUsername,
              characterId: character.characterId,
              num: 1,
            });
          }}
        >
          <FiPlus />
        </ActionButton>
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

const ActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: ${({ theme }) => theme.app.palette.red[250]};
  font-size: 16px;
  color: ${({ theme }) => theme.app.palette.gray[0]};

  &:disabled {
    background: ${({ theme }) => theme.app.palette.gray[250]};
  }
`;
