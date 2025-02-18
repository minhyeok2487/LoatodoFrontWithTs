import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";

import useCharacters from "@core/hooks/queries/character/useCharacters";
import useGetLogsProfit from "@core/hooks/queries/logs/useGetLogsProfit";
import type { Character } from "@core/types/character";

import BoxWrapper from "./BoxWrapper";

const LogsProfitGraph = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "일일 수익",
    "주간 수익",
    "합산 수익",
  ]);
  const [selectedCharacter, setSelectedCharacter] = useState<
    number | undefined
  >(undefined);
  const [startDate, setStartDate] = useState<string>(
    formatDate(getRecentWednesday())
  );
  const [endDate, setEndDate] = useState<string>(formatDate(new Date()));
  const [request, setRequest] = useState({
    characterId: selectedCharacter,
    startDate,
    endDate,
  });

  const getCharacters = useCharacters();
  const { data = [], refetch } = useGetLogsProfit(request);

  useEffect(() => {
    // 상태가 변경된 후에 새로운 요청 값으로 업데이트
    setRequest({ characterId: selectedCharacter, startDate, endDate });
  }, [selectedCharacter, startDate, endDate]);

  useEffect(() => {
    refetch(); // 상태 변경 후에 refetch 호출
  }, [request, refetch]);

  const totalSums = data.reduce(
    (acc, log) => {
      acc.dayProfit += log.dayProfit;
      acc.weekProfit += log.weekProfit;
      acc.totalProfit += log.totalProfit;
      return acc;
    },
    { dayProfit: 0, weekProfit: 0, totalProfit: 0 }
  );

  const labels = data.map((log) => log.localDate);
  const allDates = [...new Set(labels)];

  const datasets = [
    {
      label: "일일 수익",
      data: allDates.map((date) => {
        const log = data.find((log) => log.localDate === date);
        return log ? log.dayProfit : 0;
      }),
      borderColor: "blue",
      backgroundColor: "rgba(0, 0, 255, 0.2)",
    },
    {
      label: "주간 수익",
      data: allDates.map((date) => {
        const log = data.find((log) => log.localDate === date);
        return log ? log.weekProfit : 0;
      }),
      borderColor: "green",
      backgroundColor: "rgba(0, 255, 0, 0.2)",
    },
    {
      label: "합산 수익",
      data: allDates.map((date) => {
        const log = data.find((log) => log.localDate === date);
        return log ? log.totalProfit : 0;
      }),
      borderColor: "red",
      backgroundColor: "rgba(255, 0, 0, 0.2)",
    },
  ].filter((dataset) => selectedCategories.includes(dataset.label));

  const chartData = {
    labels: allDates,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
        position: "nearest" as const,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
        callbacks: {
          title: (tooltipItems: any) => {
            const date = tooltipItems[0]?.label;
            return `${date}`;
          },
          label: (tooltipItem: any) => {
            const datasetLabel = tooltipItem.dataset.label;
            const value = tooltipItem.raw;
            return `${datasetLabel}: ${value.toLocaleString()}원`;
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const, // 마우스가 가까운 데이터를 기준으로 툴팁 표시
      intersect: false, // 데이터 점과의 교차 여부 설정
    },
  };

  const handleDateChange = (direction: "previous" | "next") => {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    const daysToAddOrSubtract = direction === "previous" ? -7 : 7;

    newStartDate.setDate(newStartDate.getDate() + daysToAddOrSubtract);
    newEndDate.setDate(newEndDate.getDate() + daysToAddOrSubtract);

    // Ensure the end date does not exceed today
    if (direction === "next" && newEndDate > new Date()) {
      return; // Prevent going beyond today
    }

    setStartDate(formatDate(newStartDate));
    setEndDate(formatDate(newEndDate));
  };

  const isPastEndDate =
    new Date(endDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  return (
    <BoxWrapper $flex={1}>
      <SummaryContainer>
        <SummaryBox color="#007bff">
          일일 수익: {totalSums.dayProfit.toLocaleString()}원
        </SummaryBox>
        <SummaryBox color="#28a745">
          주간 수익: {totalSums.weekProfit.toLocaleString()}원
        </SummaryBox>
        <SummaryBox color="#dc3545">
          합산 수익: {totalSums.totalProfit.toLocaleString()}원
        </SummaryBox>
      </SummaryContainer>

      <DateNavigationContainer>
        <ArrowButton onClick={() => handleDateChange("previous")}>
          ◀
        </ArrowButton>
        <DateRangeText>{`${startDate} - ${endDate}`}</DateRangeText>
        {isPastEndDate && (
          <ArrowButton onClick={() => handleDateChange("next")}>▶</ArrowButton>
        )}
      </DateNavigationContainer>

      <DropdownContainer>
        <label htmlFor="character-select">
          캐릭터 선택:
          <StyledSelect
            id="character-select"
            value={selectedCharacter || "전체"}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setSelectedCharacter(
                selectedValue === "전체" ? undefined : Number(selectedValue)
              );
            }}
          >
            <option value="전체">전체</option>
            {getCharacters.data?.map((character: Character) => (
              <option key={character.characterId} value={character.characterId}>
                {character.characterName}
              </option>
            ))}
          </StyledSelect>
        </label>
      </DropdownContainer>

      <CheckboxContainer>
        {["일일 수익", "주간 수익", "합산 수익"].map((category) => (
          <label key={category} htmlFor={category}>
            <input
              id={category}
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => {
                setSelectedCategories((prev) =>
                  prev.includes(category)
                    ? prev.filter((c) => c !== category)
                    : [...prev, category]
                );
              }}
            />
            {category}
          </label>
        ))}
      </CheckboxContainer>

      <StyledLineChart data={chartData} options={options} />
    </BoxWrapper>
  );
};

export default LogsProfitGraph;

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0]; // Formats date as YYYY-MM-DD
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getRecentWednesday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceWednesday = (dayOfWeek + 4) % 7; // 4 is Wednesday
  today.setDate(today.getDate() - daysSinceWednesday);
  return today;
};

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SummaryBox = styled.div<{ color: string }>`
  flex: 1;
  margin: 0 10px;
  padding: 20px;
  border-radius: 8px;
  color: white;
  background-color: ${(props) => props.color};
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
`;

const DropdownContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledSelect = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-top: 10px;
`;

const CheckboxContainer = styled.div`
  margin-bottom: 15px;
  display: flex;
  gap: 15px;
`;

const StyledLineChart = styled(Line)`
  width: 100% !important;
  height: 400px !important;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const DateNavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 15px;
  color: #007bff; // Change color to match your theme
  transition: color 0.3s;

  &:hover {
    color: #0056b3; // Darker shade on hover
  }
`;

const DateRangeText = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 10px;
`;
