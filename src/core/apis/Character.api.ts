import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { CharacterType } from "../types/Character.type";
import { STALE_TIME_MS } from "../Constants";

export async function getCharacters(): Promise<CharacterType[]> {
  return await api.get("/v4/characters").then((res) => res.data);
}

export function useCharacters() {
  return useQuery<CharacterType[], Error>({
    queryKey: ["character"],
    queryFn: getCharacters,
    staleTime: STALE_TIME_MS, // 1분간격으로 전송
    retry: 0, // 에러 뜨면 멈춤
  });
}
