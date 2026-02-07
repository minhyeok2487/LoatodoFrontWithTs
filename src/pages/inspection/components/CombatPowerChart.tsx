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
import { useQueries } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import styled from "styled-components";

import * as inspectionApi from "@core/apis/inspection.api";
import { authCheckedAtom } from "@core/atoms/auth.atom";
import { STALE_TIME_MS } from "@core/constants";
import type { InspectionCharacter } from "@core/types/inspection";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

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
  characters: InspectionCharacter[];
}

type Period = 7 | 30 | 90 | 0;

const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#ca8a04",
  "#be185d",
  "#4f46e5",
  "#059669",
];

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const CombatPowerChart = ({ characters }: Props) => {
  const [period, setPeriod] = useState<Period>(30);
  const authChecked = useAtomValue(authCheckedAtom);

  const dateRange = useMemo(() => {
    if (period === 0) return {};
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - period);
    return { startDate: formatDate(start), endDate: formatDate(end) };
  }, [period]);

  const detailQueries = useQueries({
    queries: characters.map((char) => ({
      queryKey: queryKeyGenerator.getInspectionDetail({
        id: char.id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
      queryFn: () =>
        inspectionApi.getInspectionCharacterDetail(
          char.id,
          dateRange.startDate,
          dateRange.endDate
        ),
      staleTime: STALE_TIME_MS,
      enabled: authChecked && !!char.id,
    })),
  });

  const { allDates, datasetsMap } = useMemo(() => {
    const dateSet = new Set<string>();
    const map = new Map<
      number,
      { name: string; historyMap: Map<string, number> }
    >();

    detailQueries.forEach((query, idx) => {
      const char = characters[idx];
      if (!query.data?.histories) return;
      const historyMap = new Map<string, number>();
      query.data.histories.forEach((h) => {
        dateSet.add(h.recordDate);
        historyMap.set(h.recordDate, h.combatPower);
      });
      map.set(char.id, { name: char.characterName, historyMap });
    });

    const sortedDates = Array.from(dateSet).sort();
    return { allDates: sortedDates, datasetsMap: map };
  }, [detailQueries, characters]);

  const chartData = useMemo(() => {
    const datasets = characters.map((char, idx) => {
      const color = CHART_COLORS[idx % CHART_COLORS.length];
      const entry = datasetsMap.get(char.id);
      const data = allDates.map(
        (date) => entry?.historyMap.get(date) ?? null
      );

      return {
        label: char.characterName,
        data,
        borderColor: color,
        backgroundColor: `${color}20`,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 7,
        borderWidth: 2.5,
        tension: 0.1,
        fill: false,
        spanGaps: true,
      };
    });

    return { labels: allDates, datasets };
  }, [allDates, datasetsMap, characters]);

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
          callback: (value: string | number) => Number(value).toLocaleString(),
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (item: any) => {
            const val = Number(item.raw).toLocaleString();
            return `${item.dataset.label}: ${val}`;
          },
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  const periods: { label: string; value: Period }[] = [
    { label: "7일", value: 7 },
    { label: "30일", value: 30 },
    { label: "90일", value: 90 },
    { label: "전체", value: 0 },
  ];

  const hasData = allDates.length > 0;

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

      {characters.length > 0 && (
        <LegendRow>
          {characters.map((char, idx) => {
            const color = CHART_COLORS[idx % CHART_COLORS.length];
            return (
              <LegendChip key={char.id} $color={color}>
                <LegendDot $color={color} />
                {char.characterName}
              </LegendChip>
            );
          })}
        </LegendRow>
      )}

      {hasData ? (
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
  flex-wrap: wrap;
  gap: 8px;
`;

const LegendChip = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border: 1.5px solid ${({ $color }) => $color};
  border-radius: 16px;
  background: ${({ $color }) => `${$color}10`};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.main};
  white-space: nowrap;
`;

const LegendDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
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
