import { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import palette from "@core/constants/palette";
import useAnalysisList from "@core/hooks/queries/analysis/useAnalysisList";

import Button from "@components/Button";

import AnalysisRecordModal from "./components/AnalysisRecordModal";

const formatBattleTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}분 ${seconds}초`;
};

const formatLargeNumber = (num: number | undefined): string => {
  if (num === undefined) return '-';
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(2)}억`;
  }
  return num.toLocaleString();
};

const AnalysisIndex = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: analysisList, isLoading, isError } = useAnalysisList();

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const uniqueDetailKeys = useMemo(() => {
    const keys = new Set<string>();
    analysisList?.content.forEach((analysis) => {
      Object.keys(analysis.analysisDetails).forEach((key) => keys.add(key));
    });
    return Array.from(keys);
  }, [analysisList]);

  if (isLoading)
    return (
      <DefaultLayout>
        <Container>
          <p>로딩 중...</p>
        </Container>
      </DefaultLayout>
    );
  if (isError)
    return (
      <DefaultLayout>
        <Container>
          <p>데이터를 불러오는 데 실패했습니다.</p>
        </Container>
      </DefaultLayout>
    );

  return (
    <DefaultLayout>
      <Container>
        <Header>
          <TitleSection>
            <MainTitle>전투 분석</MainTitle>
            <Subtitle>전투 데이터를 체계적으로 관리하고 분석하세요</Subtitle>
          </TitleSection>
          <ActionSection>
            <StyledButton onClick={open} variant="contained">
              <ButtonIcon>⚔️</ButtonIcon>새 기록 추가
            </StyledButton>
          </ActionSection>
        </Header>

        <ContentArea>
          {analysisList?.content && analysisList.content.length > 0 ? (
            <AnalysisTable>
              <thead>
                <tr>
                  <th>캐릭터</th>
                  <th>직업</th>
                  <th>아이템 레벨</th>
                  <th>전투력</th>
                  <th>컨텐츠</th>
                  <th>컨텐츠 날짜</th>
                  <th>전투 시간</th>
                  <th>피해량</th>
                  <th>초당 피해량</th>
                  {uniqueDetailKeys.map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analysisList.content.map((analysis) => (
                  <tr key={analysis.id}>
                    <td>{analysis.characterName}</td>
                    <td>{analysis.characterClassName}</td>
                    <td>{analysis.itemLevel}</td>
                    <td>{analysis.combatPower}</td>
                    <td>{analysis.contentName}</td>
                    <td>{analysis.contentDate}</td>
                    <td>{formatBattleTime(analysis.battleTime)}</td>
                    <td>{formatLargeNumber(analysis.damage)}</td>
                    <td>{formatLargeNumber(analysis.dps)}</td>
                    {uniqueDetailKeys.map((key) => (
                      <td key={key}>{analysis.analysisDetails[key] || "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </AnalysisTable>
          ) : (
            <EmptyState>
              <EmptyIcon>📊</EmptyIcon>
              <EmptyTitle>분석할 전투 데이터가 없습니다</EmptyTitle>
              <EmptyDescription>
                첫 번째 전투 기록을 추가하여
                <br />
                상세한 분석을 시작해보세요
              </EmptyDescription>
              <EmptyActionButton onClick={open}>
                첫 기록 만들기
              </EmptyActionButton>
            </EmptyState>
          )}
        </ContentArea>
      </Container>
      <AnalysisRecordModal isOpen={isOpen} onClose={close} />
    </DefaultLayout>
  );
};

export default AnalysisIndex;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 30px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.app.bg.main} 0%,
    ${({ theme }) => theme.app.bg.main}f5 100%
  );
  min-height: calc(100vh - 60px);
  animation: ${fadeInUp} 0.6s ease-out;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 30px; /* Increased padding */
  border-bottom: 2px solid ${({ theme }) => theme.app.border}30; /* Slightly stronger border */
`;

const TitleSection = styled.div`
  flex: 1;
`;

const MainTitle = styled.h1`
  font-size: 36px; /* Slightly larger title */
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.main};
  margin: 0 0 10px 0; /* Adjusted margin */
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.app.text.main},
    ${({ theme }) => theme.app.text.main}80
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 17px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0;
  font-weight: 400;
`;

const ActionSection = styled.div`
  display: flex;
  gap: 16px;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  font-weight: 600;
  border-radius: 14px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonIcon = styled.span`
  font-size: 20px;
`;

const ContentArea = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border}40;
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const EmptyState = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${palette.gray[200]}; /* Using directly imported palette */
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(
      90deg,
      ${palette.blue[450]},
      ${palette.red[250]}
    );
  }
`;

const EmptyIcon = styled.div`
  font-size: 60px;
  margin-bottom: 20px;
  animation: ${pulse} 2s infinite;
`;

const EmptyTitle = styled.h3`
  font-size: 26px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
  margin: 0 0 16px 0;
`;

const EmptyDescription = styled.p`
  font-size: 17px;
  color: ${({ theme }) => theme.app.text.light2};
  margin: 0 0 30px 0;
  line-height: 1.6;
`;

const EmptyActionButton = styled(Button)`
  background: linear-gradient(
    135deg,
    ${palette.blue[450]},
    ${palette.red[250]}
  );
  color: white;
  border: none;
  padding: 14px 30px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const AnalysisTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.app.bg.white};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  th,
  td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.app.border};
    color: ${({ theme }) => theme.app.text.main};
  }

  th {
    background-color: ${({ theme }) => theme.app.bg.gray1};
    font-weight: bold;
    color: ${({ theme }) => theme.app.text.dark1};
  }

  tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background-color: ${({ theme }) => theme.app.bg.gray2};
  }
`;
