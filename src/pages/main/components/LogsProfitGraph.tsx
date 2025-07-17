import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
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
    "기타 수익",
    "합산 수익",
  ]);
  const [selectedCharacter, setSelectedCharacter] = useState<
    number | undefined
  >(undefined);
  const [startDate, setStartDate] = useState<string>(() => {
    const { start } = getWeekRangeFromWednesday();
    return formatDate(start);
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const { end } = getWeekRangeFromWednesday();
    return formatDate(end);
  });
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
      acc.etcProfit += log.etcProfit;
      acc.totalProfit += log.totalProfit;
      return acc;
    },
    { dayProfit: 0, weekProfit: 0, etcProfit: 0, totalProfit: 0 }
  );

  const getWeekdayFromDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay(); // 0 (일) ~ 6 (토)
    const koreanWeekdays = ["일", "월", "화", "수", "목", "금", "토"];
    return `${dateString} (${koreanWeekdays[dayOfWeek]})`;
  };

  const sortedData = [...data].sort((a, b) => {
    return new Date(a.localDate).getTime() - new Date(b.localDate).getTime();
  });

  const labels = sortedData.map((log) => getWeekdayFromDate(log.localDate));
  const allDates = sortedData.map((log) => log.localDate);

  const datasets = [
    {
      label: "일일 수익",
      data: allDates.map((date) => {
        const log = sortedData.find((log) => log.localDate === date);
        return log ? log.dayProfit : 0;
      }),
      borderColor: "#abc1cf",
      backgroundColor: "#abc1cf",
    },
    {
      label: "주간 수익",
      data: allDates.map((date) => {
        const log = sortedData.find((log) => log.localDate === date);
        return log ? log.weekProfit : 0;
      }),
      borderColor: "#b9cfab",
      backgroundColor: "#b9cfab",
    },
    {
      label: "기타 수익",
      data: allDates.map((date) => {
        const log = sortedData.find((log) => log.localDate === date);
        return log ? log.etcProfit : 0;
      }),
      borderColor: "#d8bfd8",
      backgroundColor: "#d8bfd8",
    },
    {
      label: "합산 수익",
      data: allDates.map((date) => {
        const log = sortedData.find((log) => log.localDate === date);
        return log ? log.totalProfit : 0;
      }),
      borderColor: "#e9b4ac",
      backgroundColor: "#e9b4ac",
    },
  ].filter((dataset) => selectedCategories.includes(dataset.label));

  const chartData = {
    labels,
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
    const currentStartDate = new Date(startDate);

    // 7일 더하거나 빼기
    const newStartDate = new Date(currentStartDate);
    if (direction === "previous") {
      newStartDate.setDate(currentStartDate.getDate() - 7);
    } else {
      newStartDate.setDate(currentStartDate.getDate() + 7);
    }

    // 종료일은 시작일로부터 6일 후 (화요일)
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + 6);
    newEndDate.setHours(23, 59, 59, 999);

    // 오늘 날짜를 넘지 않도록 제한
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (newEndDate > today) {
      setStartDate(formatDate(newStartDate));
      setEndDate(formatDate(today));
    } else {
      setStartDate(formatDate(newStartDate));
      setEndDate(formatDate(newEndDate));
    }
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
          <span>기타 수익</span> {(totalSums.etcProfit ?? 0).toLocaleString()}원
        </SummaryBox>
        <SummaryBox>
          <span>합산 수익</span> {totalSums.totalProfit.toLocaleString()}원
        </SummaryBox>
      </SummaryContainer>

      <SelectContainer>
        <CheckboxContainer>
          {["일일 수익", "주간 수익", "기타 수익", "합산 수익"].map(
            (category) => (
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
            )
          )}
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

      <StyledBarChart data={chartData} options={options} />
    </BoxWrapper>
  );
};

export default LogsProfitGraph;

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getWeekRangeFromWednesday = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (일) ~ 6 (토)

  const startDate = new Date(now);

  // 수요일 이후면 (수요일 포함) 이번 주 수요일부터
  if (dayOfWeek >= 3) {
    // 이번 주 수요일로 이동
    startDate.setDate(now.getDate() - (dayOfWeek - 3));
  } else {
    // 수요일 이전이면 저번 주 수요일로 이동
    startDate.setDate(now.getDate() - (dayOfWeek + 4));
  }

  // 수요일 오전 6시로 설정
  startDate.setHours(6, 0, 0, 0);

  // 종료일은 시작일로부터 6일 후 (화요일 23:59:59)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { start: startDate, end: endDate };
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

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    gap: 12px;
  }
`;

const SummaryBox = styled.div`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.app.border};
  padding: 16px 20px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 20px;

  ${({ theme }) => theme.medias.max900} {
    font-size: 18px;
  }

  span {
    display: flex;
    align-items: flex-start;
    margin-bottom: 2px;
    font-size: 16px;
    color: ${({ theme }) => theme.app.text.light1};

    ${({ theme }) => theme.medias.max900} {
      font-size: 14px;
    }
  }
`;

const SelectContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    gap: 16px;
  }
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
  border: 1px solid ${({ theme }) => theme.app.border};
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.white};
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

    ${({ theme }) => theme.medias.max900} {
      width: 64px;
      height: 22px;
      overflow: hidden;
    }

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 2px;
      border-radius: 4px;
      width: 18px;
      height: 18px;
      border: 1px solid ${({ theme }) => theme.app.border};
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

const StyledBarChart = styled(Bar)`
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

  ${({ theme }) => theme.medias.max900} {
    min-width: auto;
    margin: 0;
  }
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
