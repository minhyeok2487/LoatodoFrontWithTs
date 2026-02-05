import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";

import useInspectionDetail from "@core/hooks/queries/inspection/useInspectionDetail";

import Button from "@components/Button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  inspectionCharacterId: number;
}

type Period = 7 | 30 | 90 | 0;

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const CombatPowerChart = ({ inspectionCharacterId }: Props) => {
  const [period, setPeriod] = useState<Period>(30);

  const dateRange = useMemo(() => {
    if (period === 0) return {};
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - period);
    return { startDate: formatDate(start), endDate: formatDate(end) };
  }, [period]);

  const { data } = useInspectionDetail(
    inspectionCharacterId,
    dateRange.startDate,
    dateRange.endDate
  );

  const histories = useMemo(() => {
    if (!data?.histories) return [];
    return [...data.histories].sort(
      (a, b) =>
        new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()
    );
  }, [data]);

  const labels = histories.map((h) => h.recordDate);
  const combatPowers = histories.map((h) => h.combatPower);

  const segmentColors = useMemo(() => {
    return histories.map((h, i) => {
      if (i === 0) return "#6b7280";
      const prev = histories[i - 1].combatPower;
      const curr = h.combatPower;
      if (curr > prev) return "#16a34a";
      if (curr === prev) return "#dc2626";
      return "#6b7280";
    });
  }, [histories]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "전투력",
        data: combatPowers,
        borderColor: "#6b7280",
        backgroundColor: "rgba(107, 114, 128, 0.1)",
        pointBackgroundColor: segmentColors,
        pointBorderColor: segmentColors,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.1,
        fill: true,
        segment: {
          borderColor: (ctx: any) => {
            const idx = ctx.p1DataIndex;
            return segmentColors[idx] || "#6b7280";
          },
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          font: { family: "Pretendard", size: 12 },
          maxRotation: 45,
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          font: { family: "Pretendard", size: 12 },
          callback: (value: any) => Number(value).toLocaleString(),
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { family: "Pretendard", size: 14 },
        bodyFont: { family: "Pretendard", size: 12 },
        callbacks: {
          title: (items: any) => items[0]?.label ?? "",
          label: (item: any) => {
            const val = Number(item.raw).toLocaleString();
            const idx = item.dataIndex;
            if (idx > 0) {
              const prev = combatPowers[idx - 1];
              const diff = item.raw - prev;
              const sign = diff > 0 ? "+" : "";
              return `전투력: ${val} (${sign}${diff.toLocaleString()})`;
            }
            return `전투력: ${val}`;
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      intersect: false,
    },
  };

  const periods: { label: string; value: Period }[] = [
    { label: "7일", value: 7 },
    { label: "30일", value: 30 },
    { label: "90일", value: 90 },
    { label: "전체", value: 0 },
  ];

  return (
    <Wrapper>
      <ChartHeader>
        <ChartTitle>전투력 추이</ChartTitle>
        <PeriodButtons>
          {periods.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? "contained" : "outlined"}
              size="small"
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </PeriodButtons>
      </ChartHeader>

      <LegendRow>
        <LegendItem>
          <LegendDot $color="#16a34a" /> 증가
        </LegendItem>
        <LegendItem>
          <LegendDot $color="#dc2626" /> 무변동
        </LegendItem>
        <LegendItem>
          <LegendDot $color="#6b7280" /> 감소
        </LegendItem>
      </LegendRow>

      {histories.length > 0 ? (
        <ChartContainer>
          <Line data={chartData} options={options} />
        </ChartContainer>
      ) : (
        <EmptyChart>데이터가 없습니다.</EmptyChart>
      )}
    </Wrapper>
  );
};

export default CombatPowerChart;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${({ theme }) => theme.medias.max600} {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const ChartTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.main};
`;

const PeriodButtons = styled.div`
  display: flex;
  gap: 6px;
`;

const LegendRow = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LegendDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;

  ${({ theme }) => theme.medias.max600} {
    height: 300px;
  }
`;

const EmptyChart = styled.p`
  padding: 40px 0;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light2};
`;
