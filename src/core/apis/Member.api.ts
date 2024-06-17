import { useQuery, useQueryClient } from "@tanstack/react-query";

import { STALE_TIME_MS } from "@core/constants";
import { EditMainCharacterType, MemberType } from "@core/types/Member.type";

import mainAxios from "./mainAxios";

export const getMember = (): Promise<MemberType> => {
  return mainAxios.get("/v4/member").then((res) => res.data);
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
  return mainAxios
    .patch("/v4/member/main-character", data)
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const editApikey = (apiKey: string): Promise<any> => {
  const data = {
    apiKey,
  };

  return mainAxios
    .patch("/member/api-key", data)
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const deleteUserCharacters = (): Promise<any> => {
  return mainAxios
    .delete("/v3/member/setting/characters")
    .then((res) => res.data)
    .catch((error) => console.log(error));
};
