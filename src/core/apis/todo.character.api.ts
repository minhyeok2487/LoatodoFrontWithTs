import mainAxios from "@core/apis/mainAxios";
import type { Character } from "@core/types/character";
import type {
  UpdateCharacterMemoRequest,
  UpdateCharacterSortRequest,
} from "@core/types/todo";

// 캐릭터 메모
export const updateCharacterMemo = ({
  friendUsername,
  characterId,
  memo,
}: UpdateCharacterMemoRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/memo",
      {
        characterId,
        memo,
      },
      {
        params: {
          friendUsername,
        }
      }
    )
    .then((res) => res.data);
};

// 캐릭터 순서 변경
export const updateCharactersSort = ({
  sortCharacters,
  friendUsername,
}: UpdateCharacterSortRequest): Promise<Character[]> => {
  return mainAxios
    .patch("/api/v1/character-list/sorting", sortCharacters, {
      params: {
        friendUsername,
      },
    })
    .then((res) => res.data);
};
