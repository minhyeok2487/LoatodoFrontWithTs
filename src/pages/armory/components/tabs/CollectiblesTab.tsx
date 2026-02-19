import { useState, useMemo, type FC } from "react";
import styled from "styled-components";

import type { Collectible, ProfileTendency } from "@core/types/armory";

interface Props {
  collectibles: Collectible[] | null;
  tendencies: ProfileTendency[] | null;
}

const TENDENCY_COLORS: Record<string, string> = {
  지성: "#3B82F6",
  담력: "#EF4444",
  매력: "#EC4899",
  친절: "#22C55E",
};

const CollectiblesTab: FC<Props> = ({ collectibles, tendencies }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const totalProgress = useMemo(() => {
    if (!collectibles || collectibles.length === 0) return 0;
    const totalPoint = collectibles.reduce((sum, c) => sum + c.Point, 0);
    const totalMax = collectibles.reduce((sum, c) => sum + c.MaxPoint, 0);
    return totalMax > 0 ? Math.round((totalPoint / totalMax) * 100) : 0;
  }, [collectibles]);

  const isEmpty = !collectibles || collectibles.length === 0;
  const hasTendencies = tendencies && tendencies.length > 0;

  if (isEmpty && !hasTendencies) {
    return <EmptyMessage>수집형 포인트 정보가 없습니다.</EmptyMessage>;
  }

  return (
    <Wrapper>
      {/* 성향 */}
      {hasTendencies && (
        <Section>
          <SectionTitle>성향</SectionTitle>
          <Divider />
          <TendencyGrid>
            {tendencies!.map((t, i) => {
              const percentage =
                t.MaxPoint > 0
                  ? Math.round((t.Point / t.MaxPoint) * 100)
                  : 0;
              const color = TENDENCY_COLORS[t.Type] || "#3B82F6";
              return (
                <TendencyItem key={i}>
                  <TendencyHeader>
                    <TendencyName>{t.Type}</TendencyName>
                    <TendencyValue>{t.Point}</TendencyValue>
                  </TendencyHeader>
                  <TendencyBar>
                    <TendencyFill $color={color} $percentage={percentage} />
                  </TendencyBar>
                </TendencyItem>
              );
            })}
          </TendencyGrid>
        </Section>
      )}

      {/* 전체 진행도 */}
      {!isEmpty && (
        <Section>
          <SectionTitleRow>
            <SectionTitle>수집형 포인트</SectionTitle>
            <TotalProgress>{totalProgress}%</TotalProgress>
          </SectionTitleRow>
          <TotalBar>
            <TotalBarFill $percentage={totalProgress} />
          </TotalBar>
          <Divider />

          {/* 개별 수집품 아코디언 */}
          <CollectibleList>
            {collectibles!.map((item, i) => {
              const percentage =
                item.MaxPoint > 0
                  ? Math.round((item.Point / item.MaxPoint) * 100)
                  : 0;
              const isExpanded = expandedIndex === i;

              return (
                <CollectibleItem key={i}>
                  <CollectibleHeader
                    onClick={() =>
                      setExpandedIndex(isExpanded ? null : i)
                    }
                  >
                    <CollectibleLeft>
                      <CollectibleIcon src={item.Icon} alt={item.Type} />
                      <CollectibleName>{item.Type}</CollectibleName>
                    </CollectibleLeft>
                    <CollectibleRight>
                      <CollectibleCount>
                        {item.Point} / {item.MaxPoint}
                      </CollectibleCount>
                      <CollectibleBar>
                        <CollectibleBarFill $percentage={percentage} />
                      </CollectibleBar>
                      <ExpandIcon $expanded={isExpanded}>▼</ExpandIcon>
                    </CollectibleRight>
                  </CollectibleHeader>

                  {isExpanded && item.CollectiblePoints.length > 0 && (
                    <CollectibleDetails>
                      {item.CollectiblePoints.map((p, j) => {
                        const isComplete = p.Point >= p.MaxPoint;
                        return (
                          <DetailRow key={j}>
                            <CheckMark $complete={isComplete}>
                              {isComplete ? "✓" : "○"}
                            </CheckMark>
                            <DetailName $complete={isComplete}>
                              {p.PointName}
                            </DetailName>
                            <DetailValue>
                              {p.Point} / {p.MaxPoint}
                            </DetailValue>
                          </DetailRow>
                        );
                      })}
                    </CollectibleDetails>
                  )}
                </CollectibleItem>
              );
            })}
          </CollectibleList>
        </Section>
      )}
    </Wrapper>
  );
};

export default CollectiblesTab;

// ─── Styled Components ───

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.app.text.light2};
  font-size: 14px;
`;

const Section = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;
`;

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TotalProgress = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #3b82f6;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  margin: 10px 0;
`;

// ─── Tendency Styles ───

const TendencyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  ${({ theme }) => theme.medias.max768} {
    grid-template-columns: 1fr;
  }
`;

const TendencyItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TendencyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TendencyName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const TendencyValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const TendencyBar = styled.div`
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.app.border};
  overflow: hidden;
`;

const TendencyFill = styled.div<{ $color: string; $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  border-radius: 3px;
  background: ${({ $color }) => $color};
  transition: width 0.3s ease;
`;

// ─── Total Progress ───

const TotalBar = styled.div`
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.app.border};
  overflow: hidden;
`;

const TotalBarFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  border-radius: 4px;
  background: #3b82f6;
  transition: width 0.3s ease;
`;

// ─── Collectible Accordion ───

const CollectibleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CollectibleItem = styled.div`
  border-radius: 6px;
  overflow: hidden;
`;

const CollectibleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.app.bg.main};
  }
`;

const CollectibleLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CollectibleIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const CollectibleName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const CollectibleRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CollectibleCount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  white-space: nowrap;
`;

const CollectibleBar = styled.div`
  width: 80px;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.app.border};
  overflow: hidden;

  ${({ theme }) => theme.medias.max768} {
    display: none;
  }
`;

const CollectibleBarFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  border-radius: 3px;
  background: #3b82f6;
`;

const ExpandIcon = styled.span<{ $expanded: boolean }>`
  font-size: 10px;
  color: ${({ theme }) => theme.app.text.light2};
  transition: transform 0.2s;
  transform: rotate(${({ $expanded }) => ($expanded ? "180deg" : "0")});
`;

const CollectibleDetails = styled.div`
  padding: 4px 8px 8px 36px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CheckMark = styled.span<{ $complete: boolean }>`
  font-size: 12px;
  color: ${({ $complete }) => ($complete ? "#22C55E" : "#999")};
  width: 14px;
`;

const DetailName = styled.span<{ $complete: boolean }>`
  font-size: 12px;
  color: ${({ theme, $complete }) =>
    $complete ? theme.app.text.dark1 : theme.app.text.light2};
  flex: 1;
`;

const DetailValue = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
`;
