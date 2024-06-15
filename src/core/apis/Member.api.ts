import { useQuery, useQueryClient } from "@tanstack/react-query";

import { STALE_TIME_MS } from "@core/constants";
import { EditMainCharacterType, MemberType } from "@core/types/Member.type";

import api from "./api";

export const getMember = (): Promise<MemberType> => {
  return api.get("/v4/member").then((res) => res.data);
};

export const useMember = () => {
  const queryClient = useQueryClient();

  return {
    ...useQuery<MemberType, Error>({
      queryKey: ["member"],
      queryFn: getMember,
      staleTime: STALE_TIME_MS, // 1 minute interval
      retry: 0, // Stops on error
    }),
    queryClient,
  };
};

export const editMainCharacter = (
  data: EditMainCharacterType
): Promise<any> => {
  return api
    .patch("/v4/member/main-character", data)
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const editApikey = (apiKey: string): Promise<any> => {
  const data = {
    apiKey,
  };

  return api
    .patch("/member/api-key", data)
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const deleteUserCharacters = (): Promise<any> => {
  return api
    .delete("/v3/member/setting/characters")
    .then((res) => res.data)
    .catch((error) => console.log(error));
};
