import mainAxios from "@core/apis/mainAxios";
import type { NoDataResponse } from "@core/types/api";
import type { Character, TodoRaid } from "@core/types/character";
import type {
  AddCustomTodoRequest,
  CheckCustomTodoRequest,
  CheckDailyTodoRequest,
  CheckRaidTodoRequest,
  CheckWeeklyTodoRequest,
  CustomTodoItem,
  RemoveCustomTodoRequest,
  UpdateCharacterMemoRequest,
  UpdateCharacterSortRequest,
  UpdateCustomTodoRequest,
  UpdateRaidTodoMemoRequest,
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

// 캐릭터 순서 변경
export const updateCharactersSort = ({
  sortCharacters,
  friendUsername,
}: UpdateCharacterSortRequest): Promise<Character[]> => {
  if (friendUsername) {
    return mainAxios
      .patch(
        `/v2/friends/characterList/sorting/${friendUsername}`,
        sortCharacters
      )
      .then((res) => res.data);
  }

  return mainAxios
    .patch("/v4/characters/sorting", sortCharacters)
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

// 레이드 투두
export const checkRaidTodo = ({
  isFriend,
  characterId,
  characterName,
  weekCategory,
  currentGate,
  totalGate,
  checkAll,
}: CheckRaidTodoRequest): Promise<Character> => {
  if (isFriend) {
    return mainAxios
      .patch(`/v2/friends/raid/check${checkAll ? "/all" : ""}`, {
        characterId,
        characterName,
        weekCategory,
        currentGate,
        totalGate,
      })
      .then((res) => res.data);
  }

  return mainAxios
    .patch(`/v2/character/week/raid/check${checkAll ? "/all" : ""}`, {
      characterId,
      characterName,
      weekCategory,
      currentGate,
      totalGate,
    })
    .then((res) => res.data);
};

export const updateRaidTodoMemo = ({
  isFriend,
  characterId,
  todoId,
  message,
}: UpdateRaidTodoMemoRequest): Promise<TodoRaid> => {
  if (isFriend) {
    throw Error("기능 준비 중입니다.");
  }

  return mainAxios
    .patch("/v2/character/week/message", {
      characterId,
      todoId,
      message,
    })
    .then((res) => res.data);
};

// 주간 콘텐츠 투두
export const checkWeeklyTodo = ({
  isFriend,
  characterId,
  characterName,
  action,
}: CheckWeeklyTodoRequest): Promise<Character> => {
  const url = (() => {
    if (isFriend) {
      switch (action) {
        case "UPDATE_WEEKLY_EPONA":
          return "/v2/friends/epona";
        case "UPDATE_WEEKLY_EPONA_ALL":
          return "/v2/friends/epona/all";
        case "TOGGLE_SILMAEL_EXCHANGE":
          return "/v2/friends/silmael";
        case "SUBSCTRACT_CUBE_TICKET":
          return "/v2/friends/cube/substract";
        case "ADD_CUBE_TICKET":
          return "/v2/friends/cube/add";
        default:
          return "/v2/friends/epona";
      }
    } else {
      switch (action) {
        case "UPDATE_WEEKLY_EPONA":
          return "/v2/character/week/epona";
        case "UPDATE_WEEKLY_EPONA_ALL":
          return "/v2/character/week/epona/all";
        case "TOGGLE_SILMAEL_EXCHANGE":
          return "/v2/character/week/silmael";
        case "SUBSCTRACT_CUBE_TICKET":
          return "/v2/character/week/cube/substract";
        case "ADD_CUBE_TICKET":
          return "/v2/character/week/cube/add";
        default:
          return "/v2/character/week/epona";
      }
    }
  })();

  return mainAxios
    .patch(url, {
      id: characterId,
      characterName,
    })
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
