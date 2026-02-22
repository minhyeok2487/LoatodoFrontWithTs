import { FaCalendarAlt } from "@react-icons/all-files/fa/FaCalendarAlt";
import { FaClock } from "@react-icons/all-files/fa/FaClock";
import { FaCube } from "@react-icons/all-files/fa/FaCube";
import { FaGem } from "@react-icons/all-files/fa/FaGem";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import { FaSwift } from "@react-icons/all-files/fa/FaSwift";
import { FaUser } from "@react-icons/all-files/fa/FaUser";
import { FaTrashAlt } from "@react-icons/all-files/fa/FaTrashAlt";
import CheckAllIcon from "@assets/svg/CheckAllIcon";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

import DefaultLayout from "@layouts/DefaultLayout";

import { LOG_CONTENT } from "@core/constants";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useGetLogs from "@core/hooks/queries/logs/useGetLogs";
import EtcLogModal from "@components/todo/EtcLogModal";

import { useRemoveLog } from "@core/hooks/mutations/logs.mutations";
import queryClient from "@core/lib/queryClient";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

type LogContent = keyof typeof LOG_CONTENT | "";

const LogsIndex = () => {
  const [selectedLogContent, setSelectedLogContent] = useState<LogContent>("");
  const [selectedCharacter, setSelectedCharacter] = useState<
    number | undefined
  >(undefined);
  const [isEtcLogModalOpen, setIsEtcLogModalOpen] = useState(false);

  const getLogs = useGetLogs(
    selectedCharacter === 0 ? undefined : selectedCharacter,
    selectedLogContent === "" ? undefined : selectedLogContent
  );

  const removeLogMutation = useRemoveLog({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getLogs(),
      });
      toast.success("로그가 성공적으로 삭제되었습니다.");
    },
    onError: (error: AxiosError) => {
      toast.error(`로그 삭제에 실패했습니다`);
      // eslint-disable-next-line no-console
      console.error("로그 삭제 오류:", error);
    },
  });

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
    { value: "", label: "전체 컨텐츠" },
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
    { value: 0, label: "전체 캐릭터" },
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
      {/* Filter Section */}
      <FilterSection>
        <FilterTitle>필터 설정</FilterTitle>
        <AddEtcLogButton onClick={() => setIsEtcLogModalOpen(true)}>
          기타 수익/지출 남기기
        </AddEtcLogButton>
        <CategoryWrap>
          <FilterGroup>
            <FilterLabel>컨텐츠 선택</FilterLabel>
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
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>캐릭터 선택</FilterLabel>
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
          </FilterGroup>
        </CategoryWrap>
      </FilterSection>

      <Container>
        <EtcLogModal
          isOpen={isEtcLogModalOpen}
          onClose={() => setIsEtcLogModalOpen(false)}
        />
        {getLogs.data?.pages.map((page) =>
          page.content.map((item) => {
            const dayOfWeek = new Date(item.localDate).getDay();
            const koreanWeekdays = ["일", "월", "화", "수", "목", "금", "토"];
            const weekday = koreanWeekdays[dayOfWeek];

            const showDateSeparator = item.localDate !== lastDate;
            lastDate = item.localDate;

            return (
              <TimelineItem key={item.logsId}>
                {showDateSeparator && (
                  <SummaryBox>
                    <SummaryLeft>
                      <SummaryIcon>
                        <FaCalendarAlt />
                      </SummaryIcon>
                      <SummaryDateInfo>
                        <SummaryDate>
                          {item.localDate}({weekday})
                        </SummaryDate>
                        <SummaryFilter>
                          {getLogContentLabel(selectedLogContent) || "전체"} |{" "}
                          {getCharacterLabel(selectedCharacter) || "전체"}
                        </SummaryFilter>
                      </SummaryDateInfo>
                    </SummaryLeft>
                    <SummaryRight>
                      <SummaryLabel>일일 수익</SummaryLabel>
                      <SummaryGold>
                        {profitByDate[item.localDate].toLocaleString()} G
                      </SummaryGold>
                    </SummaryRight>
                  </SummaryBox>
                )}

                <CardContainer>
                  <TimelineLine />
                  <TimelineDot />

                  <Card>
                    <CardContent>
                      <CardLeft>
                        {getIcon(
                          LOG_CONTENT[
                            item.logContent as keyof typeof LOG_CONTENT
                          ]
                        )}
                        <CardInfo>
                          <CardTitle>
                            {
                              LOG_CONTENT[
                                item.logContent as keyof typeof LOG_CONTENT
                              ]
                            }
                          </CardTitle>
                          <LogMessage>{item.message}</LogMessage>
                          <CardMeta>
                            <MetaItem>
                              <FaClock />
                              <span>
                                {new Date(item.createdDate).toLocaleTimeString(
                                  "ko-KR",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )}
                              </span>
                            </MetaItem>
                            <MetaItem>
                              <FaUser />
                              <CharacterInfo>
                                <CharacterName>
                                  {item.characterName}
                                </CharacterName>
                                <CharacterClass>
                                  {item.characterClassName}
                                </CharacterClass>
                              </CharacterInfo>
                            </MetaItem>
                          </CardMeta>
                        </CardInfo>
                      </CardLeft>
                      <CardRight>
                        <ProfitBadge>
                          💰 {item.profit.toLocaleString()} G
                        </ProfitBadge>
                        <DeleteButton onClick={() => removeLogMutation.mutate(item.logsId)}>
                          <FaTrashAlt />
                        </DeleteButton>
                      </CardRight>
                    </CardContent>
                  </Card>
                </CardContainer>
              </TimelineItem>
            );
          })
        )}

        {/* Load More Button */}
        <LoadMoreContainer>
          <LoadMoreButton
            onClick={() => getLogs.fetchNextPage()}
            disabled={getLogs.isFetchingNextPage}
          >
            {getLogs.isFetchingNextPage ? (
              <>
                <LoadingSpinner />
                로딩 중...
              </>
            ) : (
              "더 보기"
            )}
          </LoadMoreButton>
        </LoadMoreContainer>
      </Container>
    </DefaultLayout>
  );
};

export default LogsIndex;

// Styled Components
const FilterSection = styled.div`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 10px 24px;
  margin-bottom: 12px;
  width: 97%;
`;

const FilterTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.black};
  margin: 0 0 12px 0;
`;

const AddEtcLogButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilterLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.light1};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 24px;

  ${({ theme }) => theme.medias.max768} {
    padding: 0 10px;
    gap: 16px;
  }
`;

const CategoryWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: end;

  ${({ theme }) => theme.medias.max768} {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const CategorySelect = styled.select`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  background: white;
  color: #1f2937;
  transition: all 0.2s ease;
  min-height: 40px;

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: transparent;
  }

  ${({ theme }) => theme.medias.max768} {
    width: 100%;
  }
`;

const TimelineItem = styled.div`
  position: relative;
`;

const SummaryBox = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  ${({ theme }) => theme.medias.max768} {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const SummaryLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SummaryIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const SummaryDateInfo = styled.div``;

const SummaryDate = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: white;
`;

const SummaryFilter = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;

const SummaryRight = styled.div`
  text-align: right;

  ${({ theme }) => theme.medias.max768} {
    text-align: left;
  }
`;

const SummaryLabel = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;

const SummaryGold = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin: 0;
`;

const CardContainer = styled.div`
  position: relative;
  margin-left: 20px;

  ${({ theme }) => theme.medias.max768} {
    margin-left: 0;
  }
`;

const TimelineLine = styled.div`
  position: absolute;
  left: -15px;
  top: 6px;
  width: 1px;
  height: calc(100% - 6px);
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.app.bg.reverse},
    transparent
  );

  ${({ theme }) => theme.medias.max768} {
    display: none;
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  left: -20px;
  top: 6px;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  ${({ theme }) => theme.medias.max768} {
    display: none;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.app.bg.gray2};
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.app.border};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const CardContent = styled.div`
  padding: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  ${({ theme }) => theme.medias.max768} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const CardLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;

  ${({ theme }) => theme.medias.max768} {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color:${({ theme }) => theme.app.text.black}
  margin: 0 0 8px 0;
`;

const LogMessage = styled.p`
  white-space: normal;
  word-break: break-word;
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 14px;
  line-height: 1.5;

  ${({ theme }) => theme.medias.max768} {
    font-size: 13px;
  }
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};

  ${({ theme }) => theme.medias.max768} {
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CharacterInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
  align-items: center;
  justify-content: flex-start;
  height: auto;
  line-height: 1;
`;

const CharacterName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.black};
  font-size: 13px;
  line-height: 1;
  display: flex;
  align-items: center;
`;

const CharacterClass = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light1};
  line-height: 1;
  display: flex;
  align-items: center;
  margin-left: 5px;
`;

const CardRight = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-self: center;
`;

const ProfitBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LoadMoreContainer = styled.div`
  text-align: center;
  margin-top: 48px;
`;

const LoadMoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  font-size: 18px;
  margin-left: 10px;
  transition: color 0.2s ease;

  &:hover {
    color: #cc0000;
  }
`;

const getIcon = (content: (typeof LOG_CONTENT)[keyof typeof LOG_CONTENT]) => {
  const getIconStyle = (bgColor: string) => ({
    width: "48px",
    height: "48px",
    background: bgColor,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    color: "white",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    flexShrink: 0,
  });

  switch (content) {
    case LOG_CONTENT.CHAOS:
      return (
        <div
          style={getIconStyle(
            "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
          )}
        >
          <FaStar />
        </div>
      );
    case LOG_CONTENT.GUARDIAN:
      return (
        <div
          style={getIconStyle(
            "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
          )}
        >
          <FaSwift />
        </div>
      );
    case LOG_CONTENT.RAID:
      return (
        <div
          style={getIconStyle(
            "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
          )}
        >
          <FaGem />
        </div>
      );
    case LOG_CONTENT.RAID_MORE_REWARD:
      return (
        <div
          style={getIconStyle(
            "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          )}
        >
          <FaGem />
        </div>
      );
    case LOG_CONTENT.CUBE:
      return (
        <div
          style={getIconStyle(
            "linear-gradient(135deg, #10b981 0%, #059669 100%)"
          )}
        >
          <FaCube />
        </div>
      );
    case LOG_CONTENT.DAY_CHECK_ALL_CHARACTERS:
      return (
        <div
          style={getIconStyle(
            "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
          )}
        >
          <CheckAllIcon />
        </div>
      );
    default:
      return (
        <div
          style={getIconStyle(
            "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
          )}
        >
          ?
        </div>
      );
  }
};
