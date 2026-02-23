import mainAxios from "@core/apis/mainAxios";
import type { Character } from "@core/types/character";
import type {
  CheckElysianRequest,
  CheckAllElysianRequest,
  CheckSilmaelExchangeRequest,
  UpdateCubeTicketRequest,
  UpdateHellKeyRequest,
  UpdateTrialSandRequest,
} from "@core/types/todo";

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
