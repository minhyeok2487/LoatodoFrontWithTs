import { FaGem } from "@react-icons/all-files/fa/FaGem";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import { FaSwift } from "@react-icons/all-files/fa/FaSwift";
import { useEffect, useState } from "react";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { LOG_CONTENT } from "@core/constants";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useGetLogs from "@core/hooks/queries/logs/useGetLogs";

import GoldIcon from "@assets/images/ico_gold.png";

type LogContent = keyof typeof LOG_CONTENT | "";

const LogsIndex = () => {
  const [selectedLogContent, setSelectedLogContent] = useState<LogContent>("");
  const [selectedCharacter, setSelectedCharacter] = useState<
    number | undefined
  >(undefined);

  const getLogs = useGetLogs(
    selectedCharacter === 0 ? undefined : selectedCharacter,
    selectedLogContent === "" ? undefined : selectedLogContent
  );

  useEffect(() => {
    let throttleTimeout: NodeJS.Timeout | null = null;

    const onScroll = () => {
      if (throttleTimeout) return;

      throttleTimeout = setTimeout(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (
          documentHeight - (scrollTop + windowHeight) < 50 &&
          !getLogs.isFetchingNextPage
        ) {
          getLogs.fetchNextPage();
        }

        throttleTimeout = null;
      }, 500);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [getLogs]);

  let lastDate = "";

  const LogContentOptions = [
    { value: "", label: "컨텐츠 전체" },
    ...Object.entries(LOG_CONTENT).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const handleLogContentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLogContent(event.target.value as LogContent);
  };

  const getCharacters = useCharacters();

  const CharacterOptions = [
    { value: 0, label: "캐릭터 전체" },
    ...(getCharacters.data?.map((character) => ({
      value: character.characterId,
      label: character.characterName,
    })) ?? []),
  ];

  const handleCharacterOptionsChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCharacter(Number(event.target.value));
  };

  const profitByDate: Record<string, number> = {};

  getLogs.data?.pages.forEach((page) => {
    page.content.forEach((item) => {
      if (!profitByDate[item.localDate]) {
        profitByDate[item.localDate] = 0;
      }
      profitByDate[item.localDate] += item.profit;
    });
  });

  const getLogContentLabel = (value: string) => {
    return (
      LogContentOptions.find((option) => option.value === value)?.label ?? ""
    );
  };

  const getCharacterLabel = (value: number | undefined) => {
    return (
      CharacterOptions.find((option) => option.value === value)?.label ?? ""
    );
  };

  return (
    <DefaultLayout
      pageTitle="타임라인"
      description="최근 기록 100개씩 조회가 가능합니다."
    >
      <CategoryWrap>
        <CategorySelect
          value={selectedLogContent}
          onChange={handleLogContentChange}
        >
          {LogContentOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </CategorySelect>
        <CategorySelect
          value={selectedCharacter}
          onChange={handleCharacterOptionsChange}
        >
          {CharacterOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </CategorySelect>
      </CategoryWrap>
      <Container>
        {getLogs.data?.pages.map((page) =>
          page.content.map((item) => {
            const dayOfWeek = new Date(item.localDate).getDay();
            const koreanWeekdays = ["일", "월", "화", "수", "목", "금", "토"];
            const weekday = koreanWeekdays[dayOfWeek];

            const showDateSeparator = item.localDate !== lastDate;
            lastDate = item.localDate;

            return (
              <div key={item.logsId}>
                {showDateSeparator && (
                  <SummaryBox>
                    <span>
                      {item.localDate}({weekday})
                    </span>
                    <span>
                      {getLogContentLabel(selectedLogContent)}{" "}
                      {getCharacterLabel(selectedCharacter)} 수익
                    </span>
                    <Gold>
                      {profitByDate[item.localDate].toLocaleString()} G
                    </Gold>
                  </SummaryBox>
                )}

                <Card>
                  {getIcon(
                    LOG_CONTENT[item.logContent as keyof typeof LOG_CONTENT]
                  )}
                  <div>
                    <LogMessage>{item.message}</LogMessage>
                    <p>
                      {new Date(item.createdDate)
                        .toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .replace(/\s|\.$/g, "")}
                      (
                      {new Date(item.createdDate).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                      )
                    </p>
                    <Gold>{item.profit.toLocaleString()} G</Gold>
                  </div>
                </Card>
              </div>
            );
          })
        )}
      </Container>
    </DefaultLayout>
  );
};

export default LogsIndex;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px; 
  margin: 0 auto; 

  @media (max-width: 768px) {
    padding: 0 10px; 
`;

const CategoryWrap = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;

    & > * {
      margin: 4px 0;
      width: 100%;
    }
  }
`;

const CategorySelect = styled.select`
  margin-left: 8px;
  padding: 6px 30px 6px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.main};
  color: ${({ theme }) => theme.app.text.black};
  width: 200px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 6px 20px 6px 10px;
  }
`;

const SummaryBox = styled.div`
  width: 100%;
  margin: 10px 0;
  padding-left: 5px;
  display: flex;
  align-items: center;
  font-size: 20px;
  position: relative;
  color: ${({ theme }) => theme.app.text.black};
  flex-wrap: wrap;

  span {
    padding: 1px 5px;
    border-radius: 5px;
    margin-right: 7px;
    font-weight: bold;
  }

  &:before {
    content: "";
    position: absolute;
    left: -12px;
    width: 10px;
    height: 10px;
    background: ${({ theme }) => theme.app.text.black};
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding-left: 0;

    span {
      margin-right: 5px; // Reduce margin between spans on mobile
    }
  }
`;

const Card = styled.div`
  display: flex;
  align-items: flex-start;
  border: 1px solid ${({ theme }) => theme.app.border};
  color: ${({ theme }) => theme.app.text.black};
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.main};
  flex-direction: row;

  @media (max-width: 768px) {
    padding: 12px;
    flex-direction: column;
    align-items: center;

    & > div {
      width: 100%;
    }
  }
`;

const LogMessage = styled.p`
  white-space: normal;
  word-break: break-word;
  margin: 0;
  flex-grow: 1;
  width: 100%;
  color: ${({ theme }) => theme.app.text.black};
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px; // Slightly smaller font for mobile
  }
`;

const Gold = styled.p`
  font-weight: bold;
  display: flex;
  align-items: center;
  padding-left: 26px;
  line-height: 25px;
  background: url(${GoldIcon}) no-repeat;
  background-position: 0 center;
  background-size: 20px;
  color: #d4a017;
  margin: 0;

  @media (max-width: 768px) {
    line-height: 20px;
    background-size: 17px;
    padding-left: 23px;
  }
`;

const getIcon = (content: (typeof LOG_CONTENT)[keyof typeof LOG_CONTENT]) => {
  switch (content) {
    case LOG_CONTENT.CHAOS:
      return (
        <IconWrapper style={{ backgroundColor: "orange" }}>
          <FaStar />
        </IconWrapper>
      );
    case LOG_CONTENT.GUARDIAN:
      return (
        <IconWrapper style={{ backgroundColor: "purple" }}>
          <FaSwift />
        </IconWrapper>
      );
    case LOG_CONTENT.RAID:
      return (
        <IconWrapper style={{ backgroundColor: "blue" }}>
          <FaGem />
        </IconWrapper>
      );
    case LOG_CONTENT.RAID_MORE_REWARD:
      return (
        <IconWrapper style={{ backgroundColor: "red" }}>
          <FaGem />
        </IconWrapper>
      );
    default:
      return <IconWrapper style={{ backgroundColor: "gray" }}>?</IconWrapper>;
  }
};

// Wrapper for icons in log entries
const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 16px;
  font-size: 24px;
  color: white;

  @media (max-width: 768px) {
    display: none;
    margin: 0px;
  }
`;
