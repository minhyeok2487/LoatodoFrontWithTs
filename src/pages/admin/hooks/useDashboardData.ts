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

export const useRecentActivities = (limit = 10) => {
  return useQuery({
    queryKey: ["admin", "dashboard", "recent-activities", limit],
    queryFn: () => adminApi.getRecentActivities(limit),
    staleTime: 1000 * 60 * 2, // 2분
  });
};
