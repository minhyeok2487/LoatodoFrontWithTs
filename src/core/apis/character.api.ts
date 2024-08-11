import type { NoDataResponse, UpdateWeeklyTodoAction } from "@core/types/api";
import type {
  Character,
  CubeName,
  CubeReward,
  GetAvailableWeeklyRaidsRequest,
  SaveCharactersSortRequest,
  SaveWeeklyRaidTodoListSortRequest,
  TodoRaid,
  ToggleCharacterGoldCheckVersionRequest,
  ToggleOptainableGoldCharacterRequest,
  ToggleOptainableGoldRaidRequest,
  UpdateChallengeRequest,
  UpdateCharacterMemoRequest,
  UpdateDailyTodoRequest,
  UpdateRestGaugeRequest,
  UpdateTodoRaidListRequest,
  UpdateTodoRaidRequest,
  UpdateVisibleSettingRequest,
  UpdateWeeklyRaidMemoRequest,
  UpdateWeeklyRaidTodoRequest,
  UpdateWeeklyTodoRequest,
  WeeklyRaid,
} from "@core/types/character";

import mainAxios from "./mainAxios";

export const getCharacters = (): Promise<Character[]> => {
  return mainAxios.get("/v4/characters").then((res) => res.data);
};

export const updateCharacterMemo = ({
  characterId,
  memo,
}: UpdateCharacterMemoRequest): Promise<NoDataResponse> => {
  return mainAxios
    .post("/v4/character/memo", { characterId, memo })
    .then((res) => res.data);
};

// 캐릭터 순서 변경
export const saveCharactersSort = ({
  sortCharacters,
}: SaveCharactersSortRequest): Promise<NoDataResponse> => {
  return mainAxios.patch("/v4/characters/sorting", sortCharacters);
};

// 캐릭터 주간 레이드 추가 폼 데이터 호출
export const getAvailableWeeklyRaids = ({
  characterId,
  characterName,
}: GetAvailableWeeklyRaidsRequest): Promise<WeeklyRaid[]> => {
  return mainAxios
    .get(`/v4/character/week-todo/form/${characterId}/${characterName}`)
    .then((res) => res.data);
};

// 큐브 보상
export const getCubeReward = (name: CubeName): Promise<CubeReward> => {
  return mainAxios.get(`/v2/character/cube/${name}`).then((res) => res.data);
};

// 캐릭터 정보 업데이트
export const refreshCharacters = (): Promise<NoDataResponse> => {
  return mainAxios.put("/v4/characters");
};

// 캐릭터 출력내용 업데이트
export const updateVisibleSetting = ({
  characterId,
  characterName,
  value,
  name,
}: UpdateVisibleSettingRequest): Promise<NoDataResponse> => {
  return mainAxios.patch("/v4/character/settings", {
    characterId,
    characterName,
    value,
    name,
  });
};

// 도비스 도가토 체크
export const updateChallenge = ({
  serverName,
  content,
}: UpdateChallengeRequest): Promise<NoDataResponse> => {
  return mainAxios.patch(
    `/v4/characters/todo/challenge/${serverName}/${content}`
  );
};

// 골드획득 캐릭터 업데이트
export const toggleOptainableGoldCharacter = ({
  characterId,
  characterName,
}: ToggleOptainableGoldCharacterRequest): Promise<Character> => {
  return mainAxios
    .patch("/v4/character/gold-character/", {
      characterId,
      characterName,
    })
    .then((res) => res.data);
};

// 골드 체크 버전 변경
export const toggleCharacterGoldCheckVersion = ({
  characterId,
  characterName,
}: ToggleCharacterGoldCheckVersionRequest): Promise<Character> => {
  return mainAxios
    .patch("/v3/character/settings/gold-check-version", {
      characterId,
      characterName,
    })
    .then((res) => res.data);
};

// 컨텐츠 골드 획득 지정/해제
export const toggleOptainableGoldRaid = ({
  characterId,
  characterName,
  weekCategory,
  updateValue,
}: ToggleOptainableGoldRaidRequest): Promise<NoDataResponse> => {
  return mainAxios.patch("/v3/character/week/raid/gold-check", {
    characterId,
    characterName,
    weekCategory,
    updateValue,
  });
};

// 주간 레이드 업데이트 All
export const updateTodoRaidList = ({
  characterId,
  characterName,
  raids,
}: UpdateTodoRaidListRequest): Promise<Character> => {
  return mainAxios
    .post(`/v2/character/week/raid/${characterId}/${characterName}/all`, raids)
    .then((res) => res.data);
};

// 주간 레이드 관문별 업데이트
export const updateTodoRaid = ({
  characterId,
  characterName,
  raid,
}: UpdateTodoRaidRequest): Promise<Character> => {
  return mainAxios
    .post(`/v2/character/week/raid/${characterId}/${characterName}`, raid)
    .then((res) => res.data);
};

// 캐릭터 주간 레이드 순서 변경
export const saveWeeklyRaidTodoListSort = ({
  characterId,
  characterName,
  sorted,
}: SaveWeeklyRaidTodoListSortRequest): Promise<Character> => {
  const data = sorted.map((todo, index) => ({
    weekCategory: todo.weekCategory,
    sortNumber: index + 1,
  }));

  return mainAxios
    .put(`/v2/character/week/raid/${characterId}/${characterName}/sort`, data)
    .then((res) => res.data);
};

// 캐릭터 주간 레이드 메모 수정
export const updateWeeklyRaidMemo = ({
  characterId,
  todoId,
  message,
}: UpdateWeeklyRaidMemoRequest): Promise<TodoRaid> => {
  return mainAxios
    .patch("/v2/character/week/message", {
      characterId,
      todoId,
      message,
    })
    .then((res) => res.data);
};

// ----------- todoList start
export const updateDailyTodo = ({
  params,
  allCheck,
}: {
  params: UpdateDailyTodoRequest;
  allCheck: boolean;
}): Promise<Character> => {
  const url = allCheck
    ? `/v4/character/day-todo/check/${params.category}/all`
    : `/v4/character/day-todo/check/${params.category}`;

  return mainAxios
    .patch(url, {
      characterId: params.characterId,
      characterName: params.characterName,
    })
    .then((res) => res.data);
};

// 캐릭터 휴식 게이지 수정
export const updateRestGauge = ({
  characterId,
  characterName,
  eponaGauge,
  chaosGauge,
  guardianGauge,
}: UpdateRestGaugeRequest): Promise<Character> => {
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

export const updateWeeklyRaidTodo = (
  params: UpdateWeeklyRaidTodoRequest
): Promise<Character> => {
  const url = params.allCheck
    ? "/v2/character/week/raid/check/all"
    : "/v2/character/week/raid/check";

  return mainAxios
    .patch(
      url,
      params.allCheck
        ? {
            characterId: params.characterId,
            characterName: params.characterName,
            weekCategory: params.weekCategory,
          }
        : {
            characterId: params.characterId,
            characterName: params.characterName,
            weekCategory: params.weekCategory,
            currentGate: params.currentGate,
            totalGate: params.totalGatte,
          }
    )
    .then((res) => res.data);
};

// 캐릭터 주간 컨텐츠 업데이트
export const updateWeeklyTodo = ({
  params,
  action,
}: {
  params: UpdateWeeklyTodoRequest;
  action: UpdateWeeklyTodoAction;
}): Promise<Character> => {
  const url = (() => {
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
  })();

  return mainAxios.patch(url, params).then((res) => res.data);
};
