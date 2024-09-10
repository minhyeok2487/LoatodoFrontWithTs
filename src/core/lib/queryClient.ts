import { QueryClient } from "@tanstack/react-query";

import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      // api 전부 react-query 래핑 후 작업 예정
      // staleTime: STALE_TIME_MS,
    },
  },
});

export default queryClient;

const getNewCharacters = (characters: Character[], newCharacter: Character) => {
  return characters.map((character) =>
    character.characterId === newCharacter.characterId
      ? newCharacter
      : character
  );
};

export const updateCharacterQueryData = ({
  character,
  isFriend,
}: {
  character: Character;
  isFriend: boolean;
}) => {
  if (isFriend) {
    queryClient.setQueryData<Friend[]>(
      queryKeyGenerator.getFriends(),
      (friends) => {
        if (friends) {
          return friends.map((friend) => {
            return {
              ...friend,
              characterList: getNewCharacters(friend.characterList, character),
            };
          });
        }

        return friends;
      }
    );
  } else {
    queryClient.setQueryData<Character[]>(
      queryKeyGenerator.getCharacters(),
      (characters) => {
        if (characters) {
          return getNewCharacters(characters, character);
        }

        return characters;
      }
    );
  }
};
