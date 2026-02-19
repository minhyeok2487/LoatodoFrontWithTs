import mainAxios from "@core/apis/mainAxios";
import type { NoDataResponse } from "@core/types/api";
import type { Character, WeeklyRaid } from "@core/types/character";
import type {
  AddCustomTodoRequest,
  CheckCustomTodoRequest,
  CheckDailyTodoAllRequest,
  CheckDailyTodoRequest,
  CheckRaidTodoRequest,
  CheckServerTodoRequest,
  CheckSilmaelExchangeRequest,
  CreateServerTodoRequest,
  CustomTodoItem,
  DeleteServerTodoRequest,
  GetAvaiableRaidsRequest,
  RemoveCustomTodoRequest,
  ServerTodoItem,
  ServerTodoOverviewResponse,
  ToggleGoldCharacterRequest,
  ToggleGoldRaidRequest,
  ToggleGoldVersionRequest,
  ToggleServerTodoEnabledRequest,
  UpdateCharacterMemoRequest,
  UpdateCharacterSortRequest,
  UpdateCubeTicketRequest,
  UpdateHellKeyRequest,
  UpdateTrialSandRequest,
  UpdateCustomTodoRequest,
  UpdateDayTodoAllCharactersRequest,
  UpdateDayTodoAllCharactersResponse,
  UpdateRaidBusGoldRequest,
  UpdateRaidMoreRewardCheckRequest,
  UpdateRaidTodoMemoRequest,
  UpdateRaidTodoRequest,
  UpdateRaidTodoSortRequest,
  UpdateRestGaugeRequest,
  CheckElysianRequest,
  CheckAllElysianRequest,
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

// 일간 콘테츠 투두 전체 check
export const checkDailyTodoAll = ({
  friendUsername,
  characterId,
}: CheckDailyTodoAllRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/day/check/all",
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

export const updateRestGauge = ({
  friendUsername,
  characterId,
  chaosGauge,
  guardianGauge,
}: UpdateRestGaugeRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/day/gauge",
      {
        characterId,
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

export const updateHellKey = ({
  friendUsername,
  characterId,
  num,
}: UpdateHellKeyRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/week/hell-key",
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

export const updateTrialSand = ({
  friendUsername,
  characterId,
  num,
}: UpdateTrialSandRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/week/trial-sand",
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
  return mainAxios
    .get(
      "/api/v1/custom",
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const addCustomTodo = ({
  friendUsername,
  characterId,
  contentName,
  frequency,
}: AddCustomTodoRequest): Promise<NoDataResponse> => {
  return mainAxios
    .post(
      "/api/v1/custom",
      {
        characterId,
        contentName,
        frequency
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const checkCustomTodo = ({
  friendUsername,
  characterId,
  customTodoId,
}: CheckCustomTodoRequest): Promise<NoDataResponse> => {
  return mainAxios
    .post(
      "/api/v1/custom/check",
      {
        characterId,
        customTodoId,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const updateCustomTodo = ({
  friendUsername,
  customTodoId,
  characterId,
  contentName,
}: UpdateCustomTodoRequest): Promise<NoDataResponse> => {
  return mainAxios
    .patch(
      `/api/v1/custom/${customTodoId}`,
      {
        characterId,
        contentName,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const removeCustomtodo = ({
  friendUsername,
  customTodoId,
}: RemoveCustomTodoRequest): Promise<NoDataResponse> => {
  return mainAxios
    .delete(
      `/api/v1/custom/${customTodoId}`,
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

// 모든 캐릭터 일일 숙제 전체 체크(출력된 것만)
export const updateDayTodoAllCharacters = ({
  serverName,
  friendUsername
}: UpdateDayTodoAllCharactersRequest): Promise<UpdateDayTodoAllCharactersResponse> => {
  return mainAxios
    .post(
      "/api/v1/character/day/check/all-characters",
      { serverName },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const getServerTodos = (
  friendUsername?: string
): Promise<ServerTodoOverviewResponse> => {
  return mainAxios
    .get("/api/v1/server-todos", {
      params: {
        friendUsername,
      },
    })
    .then((res) => res.data);
};

export const toggleServerTodoEnabled = ({
  friendUsername,
  todoId,
  serverName,
  enabled,
}: ToggleServerTodoEnabledRequest): Promise<ServerTodoOverviewResponse> => {
  return mainAxios
    .patch(
      `/api/v1/server-todos/${todoId}/toggle-enabled`,
      {
        serverName,
        enabled,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const checkServerTodo = ({
  friendUsername,
  todoId,
  serverName,
  checked,
}: CheckServerTodoRequest): Promise<ServerTodoOverviewResponse> => {
  return mainAxios
    .post(
      `/api/v1/server-todos/${todoId}/check`,
      {
        serverName,
        checked,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const checkElysian = ({
  friendUsername,
  characterId,
  action,
}: CheckElysianRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/week/elysian",
      {
        characterId,
        action,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const checkAllElysian = ({
  friendUsername,
  characterId,
}: CheckAllElysianRequest): Promise<Character> => {
  return mainAxios
    .post(
      "/api/v1/character/week/elysian/all",
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

// 서버 숙제 생성 (사용자 커스텀)
export const createServerTodo = ({
  contentName,
  defaultEnabled,
  frequency,
  custom,
}: CreateServerTodoRequest): Promise<ServerTodoItem> => {
  return mainAxios
    .post("/api/v1/server-todos", {
      contentName,
      defaultEnabled,
      frequency,
      custom,
    })
    .then((res) => res.data);
};

// 서버 숙제 삭제 (사용자 커스텀만 가능)
export const deleteServerTodo = ({
  todoId,
}: DeleteServerTodoRequest): Promise<void> => {
  return mainAxios.delete(`/api/v1/server-todos/${todoId}`);
};
