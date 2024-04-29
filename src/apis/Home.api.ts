import { useQuery } from "@tanstack/react-query";
import api from "./api";

interface HomeResponse {
    characterName: string
};

export async function getHomeData(): Promise<HomeResponse> {
  return await api.get("/v3/home/test").then((res) => res.data);
}

export function useHome() {
  return useQuery<HomeResponse, Error>({
    queryKey: ["home"],
    queryFn: getHomeData,
  });
}
