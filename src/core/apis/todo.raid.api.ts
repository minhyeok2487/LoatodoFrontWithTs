import mainAxios from "@core/apis/mainAxios";
import type { Character, WeeklyRaid } from "@core/types/character";
import type {
  CheckRaidTodoRequest,
  GetAvaiableRaidsRequest,
  ToggleGoldCharacterRequest,
  ToggleGoldRaidRequest,
  ToggleGoldVersionRequest,
  UpdateRaidBusGoldRequest,
  UpdateRaidMoreRewardCheckRequest,
  UpdateRaidTodoMemoRequest,
  UpdateRaidTodoRequest,
  UpdateRaidTodoSortRequest,
} from "@core/types/todo";

// 레이드 콘텐츠 투두
export const getAvailableRaids = ({
  friendUsername,
  characterId,
}: GetAvaiableRaidsRequest): Promise<WeeklyRaid[]> => {
  return mainAxios
    .get(`/api/v1/character/week/raid/form`,
      {
        params: {
          characterId,
          friendUsername,
        },
      })
    .then((res) => res.data);
};

export const updateRaidTodo = ({
  friendUsername,
  characterId,
  weekContentIdList,
}: UpdateRaidTodoRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/week/raid",
      {
        characterId,
        weekContentIdList,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const checkRaidTodo = ({
  friendUsername,
  characterId,
  weekCategory,
  allCheck,
}: CheckRaidTodoRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/week/raid/check",
      {
        characterId,
        weekCategory,
        allCheck,
      },
      {
        params: { friendUsername },
      }
    )
    .then((res) => res.data);
};

// 골드 획득 캐릭터 지정/해제
export const toggleGoldCharacter = ({
  friendUsername,
  characterId,
}: ToggleGoldCharacterRequest): Promise<Character> => {
  return mainAxios
    .patch(
      "/api/v1/character/gold-character",
      {
        characterId,
      },
      {
        params: {
          friendUsername,
        }
      }
    )
    .then((res) => res.data);
};

export const toggleGoldVersion = ({
  friendUsername,
  characterId,
}: ToggleGoldVersionRequest): Promise<Character> => {
  return mainAxios
    .patch(
      "/api/v1/character/week/gold-check-version",
      {
        characterId
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const toggleGoldRaid = ({
  friendUsername,
  characterId,
  weekCategory,
  updateValue,
}: ToggleGoldRaidRequest): Promise<Character> => {
  return mainAxios
    .patch(
      "/api/v1/character/week/raid/gold-check",
      {
        characterId,
        weekCategory,
        updateValue,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const updateRaidTodoMemo = ({
  friendUsername,
  characterId,
  todoId,
  message,
}: UpdateRaidTodoMemoRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/week/raid/message",
      {
        characterId,
        todoId,
        message,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const updateRaidTodoSort = ({
  friendUsername,
  characterId,
  sorted,
}: UpdateRaidTodoSortRequest): Promise<Character> => {
  const sortRequestList = sorted.map((todo, index) => ({
    weekCategory: todo.weekCategory,
    sortNumber: index + 1,
  }));

  return mainAxios
    .post(
      `/api/v1/character/week/raid/sort`,
      {
        characterId,
        sortRequestList,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const updateWeekRaidBusGold = ({
  friendUsername,
  characterId,
  weekCategory,
  busGold,
  fixed
}: UpdateRaidBusGoldRequest) => {
  return mainAxios
    .post(
      "/api/v1/character/week/raid/bus",
      {
        characterId,
        weekCategory,
        busGold,
        fixed,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const updateRaidMoreRewardCheck = ({
  friendUsername,
  characterId,
  weekCategory,
  gate,
}: UpdateRaidMoreRewardCheckRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/week/raid/more-reward",
      {
        characterId,
        weekCategory,
        gate,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};
