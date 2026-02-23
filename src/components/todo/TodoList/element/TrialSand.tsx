import { useUpdateTrialSand } from "@core/hooks/mutations/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import ResourceCounter from "./ResourceCounter";

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
    <ResourceCounter
      value={character.trialSand}
      label="시련의 모래"
      max={MAX_TRIAL_SAND}
      onDecrement={() => {
        updateTrialSand.mutate({
          friendUsername: friend?.friendUsername,
          characterId: character.characterId,
          num: -1,
        });
      }}
      onIncrement={() => {
        updateTrialSand.mutate({
          friendUsername: friend?.friendUsername,
          characterId: character.characterId,
          num: 1,
        });
      }}
    />
  );
};

export default TrialSand;
