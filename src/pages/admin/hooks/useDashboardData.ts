import { useQuery } from "@tanstack/react-query";

import * as adminApi from "@core/apis/admin.api";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "summary"],
    queryFn: adminApi.getDashboardSummary,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useDailyMembers = (limit = 14) => {
  return useQuery({
    queryKey: ["admin", "dashboard", "daily-members", limit],
    queryFn: () => adminApi.getDailyMembers(limit),
    staleTime: 1000 * 60 * 5,
  });
};

export const useDailyCharacters = (limit = 14) => {
  return useQuery({
    queryKey: ["admin", "dashboard", "daily-characters", limit],
    queryFn: () => adminApi.getDailyCharacters(limit),
    staleTime: 1000 * 60 * 5,
  });
};

// 최근 활동은 별도 API가 없으므로 목업 데이터 유지
export const useRecentActivities = () => {
  const activities = [
    { id: 1, type: "member" as const, action: "새 회원 가입", target: "user1234", time: "5분 전" },
    { id: 2, type: "character" as const, action: "캐릭터 등록", target: "광전사 1620", time: "12분 전" },
    { id: 3, type: "donation" as const, action: "후원 완료", target: "10,000원", time: "23분 전" },
    { id: 4, type: "member" as const, action: "새 회원 가입", target: "user5678", time: "35분 전" },
    { id: 5, type: "character" as const, action: "캐릭터 등록", target: "버서커 1580", time: "1시간 전" },
  ];

  return { data: activities, isLoading: false };
};
