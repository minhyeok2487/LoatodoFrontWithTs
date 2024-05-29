import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { STALE_TIME_MS } from "../Constants";
import { FriendSettings, FriendType } from "../types/Friend.type";
import {
  CharacterType,
  TodoType,
  WeekContnetType,
} from "../types/Character.type";
import { SelectChangeEvent } from "@mui/material";

export async function getFriends(): Promise<FriendType[]> {
  return await api.get("/v4/friends").then((res) => res.data);
}

export function useFriends() {
  return useQuery<FriendType[], Error>({
    queryKey: ["friends"],
    queryFn: getFriends,
    staleTime: STALE_TIME_MS, // 1분간격으로 전송
    retry: 0, // 에러 뜨면 멈춤
  });
}

export type searchCharacterResponseType = {
  areWeFriend: string;
  characterListSize: number;
  characterName: string;
  id: number;
  username: string;
};

// 캐릭터 검색
export async function searchCharacter(
  searchName: String
): Promise<searchCharacterResponseType[]> {
  return await api
    .get(`/v2/friends/character/${searchName}`)
    .then((res) => res.data);
}

// 깐부 요청
export async function requestFriend(searchName: String): Promise<any> {
  return await api.post(`/v2/friends/${searchName}`).then((res) => res.data);
}

export async function handleRequest(
  category: string,
  fromMember: string
): Promise<any> {
  return await api
    .post(`/v2/friends/${fromMember}/${category}`)
    .then((res) => res.data);
}

// 깐부 설정 변경
export async function editFriendSetting(
  friendId: number,
  settingName: string,
  checked: boolean
): Promise<FriendSettings> {
  const updateContent = {
    id: friendId,
    name: settingName,
    value: checked,
  };
  return await api
    .patch("/v2/friends/settings", updateContent)
    .then((res) => res.data);
}

// 도비스 도가토 체크
// export async function updateChallenge(
//   friend: FriendType,
//   servername: String,
//   content: String
// ): Promise<any> {
//   return await api
//     .patch(`/v4/characters/todo/challenge/${servername}/${content}`)
//     .then((res) => res.data);
// }

// 캐릭터 순서 변경 저장
export async function saveSort(
  friend: FriendType,
  characters: CharacterType[]
): Promise<any> {
  return await api
    .patch(
      "/v2/friends/characterList/sorting/" + friend.friendUsername,
      characters
    )
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
    .patch("/v2/friends/day-content/check/" + category, data)
    .then((res) => res.data);
}

// 일일 숙제 단일 체크
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
    .patch("/v2/friends/day-content/check/" + category + "/all", data)
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
    .patch("/v2/friends/day-content/gauge", data)
    .then((res) => res.data);
}

// 캐릭터 주간 레이드 추가 폼 데이터 호출
export async function getTodoFormData(
  friend: FriendType,
  character: CharacterType
): Promise<WeekContnetType[]> {
  return await api
    .get(
      "/v4/friends/week/form/" +
        friend.friendUsername +
        "/" +
        character.characterId
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
    .patch("/v2/friends/raid/check", updateContent)
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
    .patch("/v2/friends/raid/check/all", updateContent)
    .then((res) => res.data);
}

/*주간 에포나 체크*/
export async function weekEponaCheck(character: CharacterType): Promise<any> {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return await api
    .patch("/v2/friends/epona", updateContent)
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
    .patch("/v2/friends/epona/all", updateContent)
    .then((res) => res.data);
}

/*실마엘 체크*/
export async function silmaelChange(character: CharacterType): Promise<any> {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return await api
    .patch("/v2/friends/silmael", updateContent)
    .then((res) => res.data);
}

/*큐브 티켓 추가*/
export async function addCubeTicket(character: CharacterType): Promise<any> {
  const updateContent = {
    id: character.characterId,
    characterName: character.characterName,
  };
  return await api
    .patch("/v2/friends/cube/add", updateContent)
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
    .patch("/v2/friends/cube/substract", updateContent)
    .then((res) => res.data);
}
