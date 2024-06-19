import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import {
  CharacterType,
  TodoType,
  WeekContnetType,
} from "../types/Character.type";
import { STALE_TIME_MS } from "../Constants";

export async function getCharacters(): Promise<CharacterType[]> {
  return await api.get("/v4/characters").then((res) => res.data);
}

export function useCharacters() {
  const queryClient = useQueryClient();
  return {
      ...useQuery<CharacterType[], Error>({
          queryKey: ["character"],
          queryFn: getCharacters,
          staleTime: STALE_TIME_MS, // 5 minute interval
          retry: 0, // Stops on error
      }),
      queryClient,
  };
}

// 캐릭터 정보 업데이트
export async function updateCharacters(): Promise<any> {
  return await api.put("/v4/characters").then((res) => res.data);
}

// 캐릭터 출력내용 업데이트
export async function updateSetting(
  characterId: number,
  characterName: string,
  value: boolean,
  settingName: string
): Promise<any> {
  const updateContent = {
    characterId: characterId,
    characterName: characterName,
    value: value,
    name: settingName
};
  return await api.patch("/v2/character/settings", updateContent).then((res) => res.data);
}

// 도비스 도가토 체크
export async function updateChallenge(
  servername: String,
  content: String
): Promise<any> {
  return await api
    .patch(`/v4/characters/todo/challenge/${servername}/${content}`)
    .then((res) => res.data);
}

// 캐릭터 순서 변경 저장
export async function saveSort(
  characters:CharacterType[]
): Promise<any> {
  return await api
    .patch("/member/characterList/sorting", characters)
    .then((res) => res.data);
}

// 일일 숙제 단일 체크
export async function updateDayContent(
  characterId: Number,
  characterName: String,
  category: String
): Promise<any> {
  const data = {
    characterId: characterId,
    characterName: characterName,
  };
  return await api
    .patch(`/v3/character/day-content/check/${category}`, data)
    .then((res) => res.data);
}

// 일일 숙제 전체 체크
export async function updateDayContentAll(
  characterId: Number,
  characterName: String,
  category: String
): Promise<any> {
  const data = {
    characterId: characterId,
    characterName: characterName,
  };
  return await api
    .patch(`/v3/character/day-content/check/${category}/all`, data)
    .then((res) => res.data);
}

// 캐릭터 휴식 게이지 수정
export async function updateDayContentGuage(
  characterId: Number,
  characterName: String,
  chaosGauge: Number,
  guardianGauge: Number,
  eponaGauge: Number
): Promise<any> {
  const data = {
    characterId: characterId,
    characterName: characterName,
    chaosGauge: chaosGauge,
    guardianGauge: guardianGauge,
    eponaGauge: eponaGauge,
  };
  return await api
    .patch("/v2/character/day-content/gauge", data)
    .then((res) => res.data);
}

// 골드 체크 버전 변경
export async function updateGoldCheckVersion(
  character: CharacterType
): Promise<any> {
  const data = {
    characterId: character.characterId,
    characterName: character.characterName,
  };
  return await api
    .patch("/v3/character/settings/gold-check-version", data)
    .then((res) => res.data);
}

// 컨텐츠 골드 획득 지정/해제
export async function updateCheckGold(
  character: CharacterType,
  weekCategory: string,
  updateValue: boolean
): Promise<any> {
  const data = {
    characterId: character.characterId,
    characterName: character.characterName,
    weekCategory: weekCategory,
    updateValue: updateValue,
  };
  return await api
    .patch("/v3/character/week/raid/gold-check", data)
    .then((res) => res.data);
}

// 캐릭터 주간 레이드 추가 폼 데이터 호출
export async function getTodoFormData(
  characterId: Number,
  characterName: String
): Promise<WeekContnetType[]> {
  return await api
    .get("/v2/character/week/form/" + characterId + "/" + characterName)
    .then((res) => res.data);
}

// 캐릭터 주간 레이드 업데이트(추가/삭제)
export async function updateWeekTodo(
  character: CharacterType,
  content: WeekContnetType
): Promise<any> {
  return await api
    .post(
      "/v2/character/week/raid/" +
        character.characterId +
        "/" +
        character.characterName,
      content
    )
    .then((res) => res.data);
}

// 캐릭터 주간 레이드 업데이트(추가/삭제) All
export async function updateWeekTodoAll(
  character: CharacterType,
  content: WeekContnetType[]
): Promise<any> {
  return await api
    .post(
      "/v2/character/week/raid/" +
        character.characterId +
        "/" +
        character.characterName +
        "/all",
      content
    )
    .then((res) => res.data);
}

// 캐릭터 주간 숙제 체크
export async function updateWeekCheck(
  character: CharacterType,
  todo: TodoType
): Promise<any> {
  const updateContent = {
    characterId: character.characterId,
    characterName: character.characterName,
    weekCategory: todo.weekCategory,
    currentGate: todo.currentGate,
    totalGate: todo.totalGate,
  };
  return await api
    .patch("/v2/character/week/raid/check", updateContent)
    .then((res) => res.data);
}

// 캐릭터 주간 숙제 체크 All
export async function updateWeekCheckAll(
  character: CharacterType,
  todo: TodoType
): Promise<any> {
  const updateContent = {
    characterId: character.characterId,
    characterName: character.characterName,
    weekCategory: todo.weekCategory,
  };
  return await api
    .patch("/v2/character/week/raid/check/all", updateContent)
    .then((res) => res.data);
}

// 골드획득 캐릭터 업데이트
export async function updateGoldCharacter(
  character: CharacterType
): Promise<any> {
  const updateContent = {
    characterId: character.characterId,
    characterName: character.characterName,
  };
  return await api
    .patch("/v2/character/gold-character/", updateContent)
    .then((res) => res.data);
}

// 캐릭터 주간 레이드 순서 변경
export async function saveRaidSort(character: CharacterType): Promise<any> {
  const characterId = character.characterId;
  const characterName = character.characterName;
  const data = character.todoList.map((todo, index) => ({
    weekCategory: todo.weekCategory,
    sortNumber: index + 1,
  }));
  return await api
    .put(
      "/v2/character/week/raid/" + characterId + "/" + characterName + "/sort",
      data
    )
    .then((res) => res.data);
}

// 캐릭터 주간 레이드 메시지 수정
export async function updateWeekMessage(
  character: CharacterType,
  todoId: Number,
  message: string
): Promise<any> {
  const updateContent = {
    characterId: character.characterId,
    todoId: todoId,
    message: message
  };
  return await api
    .patch("/v2/character/week/message", updateContent)
    .then((res) => res.data);
}

/*주간 에포나 체크*/
export async function weekEponaCheck(
  character: CharacterType
): Promise<any> {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return await api
    .patch("/v2/character/week/epona", updateContent)
    .then((res) => res.data);
}

/*주간 에포나 체크 ALL*/
export async function weekEponaCheckAll(
  character: CharacterType
): Promise<any> {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return await api
    .patch("/v2/character/week/epona/all", updateContent)
    .then((res) => res.data);
}

/*실마엘 교환 체크*/
export async function silmaelChange(
  character: CharacterType
): Promise<any> {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return await api
    .patch("/v2/character/week/silmael", updateContent)
    .then((res) => res.data);
}


/*큐브 티켓 추가*/
export async function addCubeTicket(
  character: CharacterType
): Promise<any> {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return await api
    .patch("/v2/character/week/cube/add", updateContent)
    .then((res) => res.data);
}

/*큐브 티켓 감소*/
export async function substractCubeTicket(
  character: CharacterType
): Promise<any> {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return await api
    .patch("/v2/character/week/cube/substract", updateContent)
    .then((res) => res.data);
}

/*큐브 데이터 호출*/
export async function getCubeContent(
  name: String
): Promise<any> {
  return await api
    .get("/v2/character/cube/" + name)
    .then((res) => res.data);
}