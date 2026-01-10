import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { MdPeople } from "@react-icons/all-files/md/MdPeople";
import { MdPerson } from "@react-icons/all-files/md/MdPerson";
import { MdTrendingUp } from "@react-icons/all-files/md/MdTrendingUp";
import { MdAccessTime } from "@react-icons/all-files/md/MdAccessTime";

import { AdminPageTitle, AdminCard } from "@components/admin";
import StatCard from "./components/StatCard";
import RecentActivity from "./components/RecentActivity";
import {
  useDashboardSummary,
  useDailyMembers,
  useDailyCharacters,
  useRecentActivities,
} from "./hooks/useDashboardData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.06)",
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
  },
};

const AdminDashboard = () => {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: memberStats, isLoading: memberStatsLoading } = useDailyMembers();
  const { data: characterStats, isLoading: characterStatsLoading } = useDailyCharacters();
  const { data: recentActivities } = useRecentActivities();

  const isLoading = summaryLoading || memberStatsLoading || characterStatsLoading;

  const memberChartData = {
    labels: (memberStats ?? []).map((item) => item.date.slice(5)),
    datasets: [
      {
        label: "일일 가입자",
        data: (memberStats ?? []).map((item) => item.count),
        borderColor: "#667eea",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#667eea",
      },
    ],
  };

  const characterChartData = {
    labels: (characterStats ?? []).map((item) => item.date.slice(5)),
    datasets: [
      {
        label: "일일 캐릭터 등록",
        data: (characterStats ?? []).map((item) => item.count),
        backgroundColor: "rgba(118, 75, 162, 0.8)",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  // 이번 주 성장률 계산 (마지막 7일 vs 그 전 7일)
  const calculateWeeklyGrowth = () => {
    if (!memberStats || memberStats.length < 14) return 0;
    const lastWeek = memberStats.slice(-7).reduce((sum, item) => sum + item.count, 0);
    const prevWeek = memberStats.slice(-14, -7).reduce((sum, item) => sum + item.count, 0);
    if (prevWeek === 0) return 0;
    return Math.round(((lastWeek - prevWeek) / prevWeek) * 100 * 10) / 10;
  };

  const weeklyGrowth = calculateWeeklyGrowth();

  if (isLoading) {
    return (
      <div>
        <AdminPageTitle
          title="대시보드"
          description="서비스 전체 현황을 한눈에 확인하세요"
        />
        <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
      </div>
    );
  }

  return (
    <div>
      <AdminPageTitle
        title="대시보드"
        description="서비스 전체 현황을 한눈에 확인하세요"
      />

      <StatsGrid>
        <StatCard
          icon={<MdPeople size={24} />}
          label="전체 회원"
          value={(summary?.totalMembers ?? 0).toLocaleString()}
          subtext={
            weeklyGrowth !== 0 ? (
              <GrowthText $positive={weeklyGrowth > 0}>
                <MdTrendingUp size={14} />
                {weeklyGrowth > 0 ? "+" : ""}{weeklyGrowth}% 이번 주
              </GrowthText>
            ) : undefined
          }
        />
        <StatCard
          icon={<MdPerson size={24} />}
          label="전체 캐릭터"
          value={(summary?.totalCharacters ?? 0).toLocaleString()}
          subtext={
            summary?.totalMembers
              ? `회원당 평균 ${(summary.totalCharacters / summary.totalMembers).toFixed(1)}개`
              : undefined
          }
        />
        <StatCard
          icon={<MdTrendingUp size={24} />}
          label="오늘 가입"
          value={`+${summary?.todayNewMembers ?? 0}`}
          subtext={`캐릭터 +${summary?.todayNewCharacters ?? 0}`}
        />
        <StatCard
          icon={<MdAccessTime size={24} />}
          label="활성 회원"
          value={(summary?.activeMembers ?? 0).toLocaleString()}
          subtext="최근 7일 접속"
        />
      </StatsGrid>

      <ChartsSection>
        <AdminCard title="일일 가입자 추이" subtitle="최근 14일">
          <ChartContainer>
            {memberStats && memberStats.length > 0 ? (
              <Line data={memberChartData} options={chartOptions} />
            ) : (
              <NoDataMessage>데이터가 없습니다</NoDataMessage>
            )}
          </ChartContainer>
        </AdminCard>

        <AdminCard title="일일 캐릭터 등록" subtitle="최근 14일">
          <ChartContainer>
            {characterStats && characterStats.length > 0 ? (
              <Bar data={characterChartData} options={chartOptions} />
            ) : (
              <NoDataMessage>데이터가 없습니다</NoDataMessage>
            )}
          </ChartContainer>
        </AdminCard>
      </ChartsSection>

      <AdminCard title="최근 활동" subtitle="실시간 업데이트">
        <RecentActivity activities={recentActivities ?? []} />
      </AdminCard>
    </div>
  );
};

export default AdminDashboard;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;

  ${({ theme }) => theme.medias.max1024} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.medias.max500} {
    grid-template-columns: 1fr;
  }
`;

const GrowthText = styled.span<{ $positive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  color: ${({ $positive }) => ($positive ? "#10b981" : "#ef4444")};
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 28px;

  ${({ theme }) => theme.medias.max1024} {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  height: 280px;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  font-size: 16px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const NoDataMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light2};
`;
