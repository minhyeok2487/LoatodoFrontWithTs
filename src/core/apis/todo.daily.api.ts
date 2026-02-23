import mainAxios from "@core/apis/mainAxios";
import type { Character } from "@core/types/character";
import type {
  CheckDailyTodoAllRequest,
  CheckDailyTodoRequest,
  UpdateDayTodoAllCharactersRequest,
  UpdateDayTodoAllCharactersResponse,
  UpdateRestGaugeRequest,
} from "@core/types/todo";

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
