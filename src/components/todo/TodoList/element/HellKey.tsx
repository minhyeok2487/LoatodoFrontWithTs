import { useUpdateHellKey } from "@core/hooks/mutations/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import ResourceCounter from "./ResourceCounter";

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
    <ResourceCounter
      value={character.hellKey}
      label="지옥 열쇠"
      onDecrement={() => {
        updateHellKey.mutate({
          friendUsername: friend?.friendUsername,
          characterId: character.characterId,
          num: -1,
        });
      }}
      onIncrement={() => {
        updateHellKey.mutate({
          friendUsername: friend?.friendUsername,
          characterId: character.characterId,
          num: 1,
        });
      }}
    />
  );
};

export default HellKey;
