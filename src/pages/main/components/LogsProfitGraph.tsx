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
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import useCharacters from "@core/hooks/queries/character/useCharacters";
import useGetLogsProfit from "@core/hooks/queries/logs/useGetLogsProfit";
import type { Character } from "@core/types/character";

import Button from "@components/Button";

import ArrowIcon from "@assets/images/ico_arr.png";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";

const LogsProfitGraph = () => {
  const navigate = useNavigate();

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
      borderColor: "#abc1cf",
      backgroundColor: "#abc1cf",
    },
    {
      label: "주간 수익",
      data: allDates.map((date) => {
        const log = data.find((log) => log.localDate === date);
        return log ? log.weekProfit : 0;
      }),
      borderColor: "#b9cfab",
      backgroundColor: "#b9cfab",
    },
    {
      label: "합산 수익",
      data: allDates.map((date) => {
        const log = data.find((log) => log.localDate === date);
        return log ? log.totalProfit : 0;
      }),
      borderColor: "#e9b4ac",
      backgroundColor: "#e9b4ac",
    },
  ].filter((dataset) => selectedCategories.includes(dataset.label));

  const chartData = {
    labels: allDates,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // animation: {
    //   delay: 500,
    //   duration: 1000,
    //   easing: "easeOutQuad" as any,
    // },
    scales: {
      x: {
        ticks: {
          font: {
            family: "Pretendard",
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: "Pretendard",
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            family: "Pretendard",
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
        position: "nearest" as const,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          family: "Pretendard",
          size: 14,
        },
        titleColor: "white",
        bodyFont: {
          family: "Pretendard",
          size: 12,
        },
        bodyColor: "white",
        borderWidth: 1,

        interaction: {
          mode: "nearest" as const,
          intersect: false,
        },
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
      <Header>
        <BoxTitle>주간 내 수익 현황</BoxTitle>
        <Button variant="outlined" onClick={() => navigate("/logs")}>
          타임라인
        </Button>
      </Header>
      <SummaryContainer>
        <SummaryBox>
          <span>일일 수익</span> {totalSums.dayProfit.toLocaleString()}원
        </SummaryBox>
        <SummaryBox>
          <span>주간 수익</span> {totalSums.weekProfit.toLocaleString()}원
        </SummaryBox>
        <SummaryBox>
          <span>합산 수익</span> {totalSums.totalProfit.toLocaleString()}원
        </SummaryBox>
      </SummaryContainer>

      <SelectContainer>
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
        <DateNavigationContainer>
          <ArrowButton onClick={() => handleDateChange("previous")}>
            <ArrowButtonLeft />
          </ArrowButton>
          <DateRangeText>{`${startDate} - ${endDate}`}</DateRangeText>
          {isPastEndDate && (
            <ArrowButton onClick={() => handleDateChange("next")}>
              <ArrowButtonRight />
            </ArrowButton>
          )}
        </DateNavigationContainer>

        <DropdownContainer>
          <label htmlFor="character-select">
            캐릭터
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
                <option
                  key={character.characterId}
                  value={character.characterId}
                >
                  {character.characterName}
                </option>
              ))}
            </StyledSelect>
          </label>
        </DropdownContainer>
      </SelectContainer>

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

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
`;

const SummaryContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-top: 16px;
  margin-bottom: 20px;
`;

const SummaryBox = styled.div`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.app.border};
  padding: 16px 20px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 20px;

  span {
    display: flex;
    align-items: flex-start;
    margin-bottom: 2px;
    font-size: 16px;
    color: ${({ theme }) => theme.app.text.light1};
  }
`;

const SelectContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;

  &:after {
    content: "";
    width: 14px;
    height: 14px;
    position: absolute;
    right: 10px;
    top: 14px;
    transform: rotate(90deg);
    background: url(${ArrowIcon}) no-repeat center right;
  }
`;

const StyledSelect = styled.select`
  margin-left: 8px;
  padding: 6px 30px 6px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.main};
  color: ${({ theme }) => theme.app.text.black};
  outline: none;
  appearance: none;
`;

const CheckboxContainer = styled.div`
  display: flex;
  gap: 15px;

  display: inline-flex;
  align-items: center;
  flex-shrink: initial;

  input {
    appearance: none;
    cursor: pointer;
    padding-left: 23px;
  }

  label {
    position: relative;
    cursor: pointer;
    font-size: 15px;
    color: ${({ theme }) => theme.app.text.light2};

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 2px;
      border-radius: 4px;
      width: 18px;
      height: 18px;
      border: 1px solid ${({ theme }) => theme.app.text.light2};
    }

    &:has(input:checked) {
      color: ${({ theme }) => theme.app.text.main};
    }

    &:has(input:checked):before {
      content: "✓";
      padding-left: 2px;
      line-height: 16px;
      color: ${({ theme }) => theme.app.text.gray1};
    }
  }
`;

const StyledLineChart = styled(Line)`
  margin-top: 16px;
  width: 100% !important;
  height: 400px !important;
  max-height: 400px;
  border-radius: 8px;
`;

const DateNavigationContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 350px;
  margin-left: -80px;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  height: 16px;
  cursor: pointer;
  padding: 0 15px;
  color: ${({ theme }) => theme.app.text.light1};
  transition: color 0.3s;
`;

const ArrowButtonLeft = styled.div`
  width: 16px;
  height: 16px;
  background: url(${ArrowIcon}) no-repeat center;
  transform: rotate(180deg);
`;
const ArrowButtonRight = styled.button`
  width: 16px;
  height: 16px;
  background: url(${ArrowIcon}) no-repeat center;
`;

const DateRangeText = styled.span`
  font-size: 18px;
  font-weight: 700;
  margin: 0 10px;
`;
