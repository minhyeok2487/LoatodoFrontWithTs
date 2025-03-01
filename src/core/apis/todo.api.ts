import mainAxios from "@core/apis/mainAxios";
import type { NoDataResponse } from "@core/types/api";
import type { Character, WeeklyRaid } from "@core/types/character";
import type {
  AddCustomTodoRequest,
  CheckCustomTodoRequest,
  CheckDailyTodoAllRequest,
  CheckDailyTodoRequest,
  CheckRaidTodoRequest,
  CheckSilmaelExchangeRequest,
  CheckWeeklyEponaRequest,
  CustomTodoItem,
  GetAvaiableRaidsRequest,
  RemoveCustomTodoRequest,
  ToggleGoldCharacterRequest,
  ToggleGoldRaidRequest,
  ToggleGoldVersionRequest,
  UpdateCharacterMemoRequest,
  UpdateCharacterSortRequest,
  UpdateCubeTicketRequest,
  UpdateCustomTodoRequest,
  UpdateRaidBusGoldRequest,
  UpdateRaidMoreRewardCheckRequest,
  UpdateRaidTodoMemoRequest,
  UpdateRaidTodoRequest,
  UpdateRaidTodoSortRequest,
  UpdateRestGaugeRequest,
} from "@core/types/todo";

// 캐릭터 메모
export const updateCharacterMemo = ({
  friendUsername,
  characterId,
  memo,
}: UpdateCharacterMemoRequest): Promise<Character> => {
  if (friendUsername) {
    return mainAxios
      .post(`/v4/friends/character/${friendUsername}/memo`, {
        characterId,
        memo,
      })
      .then((res) => res.data);
  }

  return mainAxios
    .post("/v4/character/memo", { characterId, memo })
    .then((res) => res.data);
};

// 캐릭터 정보 업데이트
export const refreshCharacters = (
  friendUsername?: string
): Promise<NoDataResponse> => {
  return mainAxios.put("/api/v1/character-list", null, { params: { friendUsername } });
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

// 일간 콘테츠 투두
export const checkDailyTodo = ({
  friendUsername,
  characterId,
  category,
  allCheck,
}: CheckDailyTodoRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/day/check",
      {
        characterId,
        category,
        allCheck,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const updateRestGauge = ({
  friendUsername,
  characterId,
  eponaGauge,
  chaosGauge,
  guardianGauge,
}: UpdateRestGaugeRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/day/gauge",
      {
        characterId,
        eponaGauge,
        chaosGauge,
        guardianGauge,
      },
      { params: { friendUsername } }
    )
    .then((res) => res.data);
};

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

export const toggleGoldCharacter = ({
  friendUsername,
  characterId,
  characterName,
}: ToggleGoldCharacterRequest): Promise<Character> => {
  if (friendUsername) {
    return mainAxios
      .patch(`/v4/friends/character/${friendUsername}/gold-character`, {
        characterId,
        characterName,
      })
      .then((res) => res.data);
  }

  return mainAxios
    .patch("/v4/character/gold-character", {
      characterId,
      characterName,
    })
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

// 주간 콘텐츠 투두
export const updateCubeTicket = ({
  friendUsername,
  characterId,
  num,
}: UpdateCubeTicketRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/week/cube",
      {
        characterId,
        num,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const checkWeeklyEpona = ({
  friendUsername,
  characterId,
  allCheck,
}: CheckWeeklyEponaRequest) => {
  return mainAxios
    .post(
      "/api/v1/character/week/epona",
      {
        characterId,
        allCheck,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const checkSilmaelExchange = ({
  friendUsername,
  characterId,
}: CheckSilmaelExchangeRequest) => {
  return mainAxios
    .post(
      "/api/v1/character/week/silmael",
      {
        characterId,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

// 커스텀 투두
export const getCustomTodos = (
  friendUsername?: string
): Promise<CustomTodoItem[]> => {
  if (friendUsername) {
    return mainAxios
      .get(`/v4/friends/custom/${friendUsername}`)
      .then((res) => res.data);
  }

  return mainAxios.get("/v4/custom").then((res) => res.data);
};

export const addCustomTodo = ({
  friendUsername,
  characterId,
  contentName,
  frequency,
}: AddCustomTodoRequest): Promise<NoDataResponse> => {
  if (friendUsername) {
    return mainAxios.post(`/v4/friends/custom/${friendUsername}`, {
      characterId,
      contentName,
      frequency,
    });
  }

  return mainAxios.post("/v4/custom", { characterId, contentName, frequency });
};

export const checkCustomTodo = ({
  friendUsername,
  characterId,
  customTodoId,
}: CheckCustomTodoRequest): Promise<NoDataResponse> => {
  if (friendUsername) {
    return mainAxios.post(`/v4/friends/custom/${friendUsername}/check`, {
      characterId,
      customTodoId,
    });
  }

  return mainAxios.post("/v4/custom/check", { characterId, customTodoId });
};

export const updateCustomTodo = ({
  friendUsername,
  customTodoId,
  characterId,
  contentName,
}: UpdateCustomTodoRequest): Promise<NoDataResponse> => {
  if (friendUsername) {
    return mainAxios.patch(
      `/v4/friends/custom/${friendUsername}/${customTodoId}`,
      {
        characterId,
        contentName,
      }
    );
  }

  return mainAxios.patch(`/v4/custom/${customTodoId}`, {
    characterId,
    contentName,
  });
};

export const removeCustomtodo = ({
  friendUsername,
  customTodoId,
}: RemoveCustomTodoRequest): Promise<NoDataResponse> => {
  if (friendUsername) {
    return mainAxios.delete(
      `/v4/friends/custom/${friendUsername}/${customTodoId}`
    );
  }

  return mainAxios.delete(`/v4/custom/${customTodoId}`);
};

export const updateWeekRaidBusGold = ({
  friendUsername,
  characterId,
  weekCategory,
  busGold,
}: UpdateRaidBusGoldRequest) => {
  return mainAxios
    .post(
      "/api/v1/character/week/raid/bus",
      {
        characterId,
        weekCategory,
        busGold,
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