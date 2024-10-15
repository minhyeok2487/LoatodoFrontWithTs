import mainAxios from "@core/apis/mainAxios";
import type { NoDataResponse } from "@core/types/api";
import type { Character, WeeklyRaid } from "@core/types/character";
import type {
  AddCustomTodoRequest,
  CheckCustomTodoRequest,
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
  return mainAxios.put("/api/v1/character-list", { friendUsername });
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
export const updateRestGauge = ({
  isFriend,
  characterId,
  characterName,
  eponaGauge,
  chaosGauge,
  guardianGauge,
}: UpdateRestGaugeRequest): Promise<Character> => {
  if (isFriend) {
    return mainAxios
      .patch("/v2/friends/day-content/gauge", {
        characterId,
        characterName,
        eponaGauge,
        chaosGauge,
        guardianGauge,
      })
      .then((res) => res.data);
  }

  return mainAxios
    .patch("/v4/character/day-todo/gauge", {
      characterId,
      characterName,
      eponaGauge,
      chaosGauge,
      guardianGauge,
    })
    .then((res) => res.data);
};

export const checkDailyTodo = ({
  isFriend,
  characterId,
  characterName,
  category,
  checkAll,
}: CheckDailyTodoRequest): Promise<Character> => {
  if (isFriend) {
    return mainAxios
      .patch(
        `/v2/friends/day-content/check/${category}${checkAll ? "/all" : ""}`,
        {
          characterId,
          characterName,
        }
      )
      .then((res) => res.data);
  }

  return mainAxios
    .patch(
      `/v4/character/day-todo/check/${category}${checkAll ? "/all" : ""}`,
      {
        characterId,
        characterName,
      }
    )
    .then((res) => res.data);
};

// 레이드 콘텐츠 투두
export const getAvailableRaids = ({
  friendUsername,
  characterId,
  characterName,
}: GetAvaiableRaidsRequest): Promise<WeeklyRaid[]> => {
  if (friendUsername) {
    return mainAxios
      .get(`/v4/friends/week/form/${friendUsername}/${characterId}`)
      .then((res) => res.data);
  }

  return mainAxios
    .get(`/v4/character/week-todo/form/${characterId}/${characterName}`)
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
  characterName,
}: ToggleGoldVersionRequest): Promise<Character> => {
  if (friendUsername) {
    return mainAxios
      .patch(`/v4/friends/character/${friendUsername}/gold-check-version`, {
        characterId,
        characterName,
      })
      .then((res) => res.data);
  }

  return mainAxios
    .patch("/v3/character/settings/gold-check-version", {
      characterId,
      characterName,
    })
    .then((res) => res.data);
};

export const toggleGoldRaid = ({
  friendUsername,
  characterId,
  characterName,
  weekCategory,
  updateValue,
}: ToggleGoldRaidRequest): Promise<NoDataResponse> => {
  if (friendUsername) {
    return mainAxios.patch(
      `/v4/friends/character/${friendUsername}/gold-check`,
      {
        characterId,
        characterName,
        weekCategory,
        updateValue,
      }
    );
  }

  return mainAxios.patch("/v3/character/week/raid/gold-check", {
    characterId,
    characterName,
    weekCategory,
    updateValue,
  });
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
    .patch(
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
  all,
}: CheckWeeklyEponaRequest) => {
  return mainAxios
    .post(
      "/api/v1/character/week/epona",
      {
        characterId,
        all,
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
