import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { MemberType, EditMainCharacterType } from '../types/Member.type';
const STALE_TIME_MS = 60000;

export async function getMember(): Promise<MemberType> {
  return await api.get("/v4/member").then((res) => res.data);
}

export async function editMainCharacter(data:EditMainCharacterType): Promise<any> {
  return await api.patch("/v4/member/main-character",data)
  .then((res) => res.data)
  .catch((error) => console.log(error));
}

export function useMember() {
  return useQuery<MemberType, Error>({
    queryKey: ["member"],
    queryFn: getMember,
    staleTime: STALE_TIME_MS, // 1분간격으로 전송
    retry: 0, // 에러 뜨면 멈춤
  });
}
