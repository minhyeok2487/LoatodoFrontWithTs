// 목업 데이터 훅 - 추후 실제 API로 교체

export const useMockDashboardData = () => {
  const summary = {
    totalMembers: 15234,
    totalCharacters: 89432,
    todayNewMembers: 47,
    todayNewCharacters: 312,
    activeMembers: 3421,
    weeklyGrowth: 12.5,
  };

  const memberStats = [
    { date: "2024-01-01", count: 32 },
    { date: "2024-01-02", count: 45 },
    { date: "2024-01-03", count: 28 },
    { date: "2024-01-04", count: 56 },
    { date: "2024-01-05", count: 42 },
    { date: "2024-01-06", count: 38 },
    { date: "2024-01-07", count: 65 },
    { date: "2024-01-08", count: 48 },
    { date: "2024-01-09", count: 52 },
    { date: "2024-01-10", count: 41 },
    { date: "2024-01-11", count: 58 },
    { date: "2024-01-12", count: 47 },
    { date: "2024-01-13", count: 39 },
    { date: "2024-01-14", count: 47 },
  ];

  const characterStats = [
    { date: "2024-01-01", count: 234 },
    { date: "2024-01-02", count: 312 },
    { date: "2024-01-03", count: 198 },
    { date: "2024-01-04", count: 421 },
    { date: "2024-01-05", count: 287 },
    { date: "2024-01-06", count: 256 },
    { date: "2024-01-07", count: 389 },
    { date: "2024-01-08", count: 334 },
    { date: "2024-01-09", count: 298 },
    { date: "2024-01-10", count: 312 },
    { date: "2024-01-11", count: 367 },
    { date: "2024-01-12", count: 289 },
    { date: "2024-01-13", count: 245 },
    { date: "2024-01-14", count: 312 },
  ];

  const recentActivities = [
    { id: 1, type: "member" as const, action: "새 회원 가입", target: "user1234", time: "5분 전" },
    { id: 2, type: "character" as const, action: "캐릭터 등록", target: "광전사 1620", time: "12분 전" },
    { id: 3, type: "donation" as const, action: "후원 완료", target: "10,000원", time: "23분 전" },
    { id: 4, type: "member" as const, action: "새 회원 가입", target: "user5678", time: "35분 전" },
    { id: 5, type: "character" as const, action: "캐릭터 등록", target: "버서커 1580", time: "1시간 전" },
  ];

  return {
    summary,
    memberStats,
    characterStats,
    recentActivities,
    isLoading: false,
  };
};
