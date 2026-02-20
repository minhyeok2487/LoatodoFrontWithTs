import { useMemo, type FC } from "react";
import styled from "styled-components";

import type {
  ArmoryResponse,
  ArkPassiveEngravingEffect,
} from "@core/types/armory";
import { stripHtml } from "@core/utils/tooltipParser";

import EquipmentSection from "./stats/EquipmentSection";
import GemSection from "./stats/GemSection";
import CardSection from "./stats/CardSection";

interface Props {
  data: ArmoryResponse;
}

const COMBAT_STAT_COLORS: Record<string, string> = {
  치명: "#EF4444",
  신속: "#3B82F6",
  제압: "#22C55E",
  특화: "#F59E0B",
  숙련: "#EAB308",
  인내: "#14B8A6",
};

const getCategoryColor = (name: string): string => {
  if (name.includes("진화")) return "#22C55E";
  if (name.includes("깨달음")) return "#3B82F6";
  if (name.includes("도약")) return "#A855F7";
  return "#959595";
};

const getEngravingColor = (grade: string): string => {
  const colors: Record<string, string> = {
    유물: "#DC6A2C",
    전설: "#F59E0B",
    영웅: "#A855F7",
    희귀: "#00AAFF",
    고급: "#68D917",
  };
  return colors[grade] || "#959595";
};

const StatsTab: FC<Props> = ({ data }) => {
  const {
    ArmoryEquipment: equipment,
    ArmoryGem: gem,
    ArmoryCard: card,
    ArmoryProfile: profile,
    ArmoryEngraving: engraving,
    ArkPassive: arkPassive,
  } = data;

  const combatStats = useMemo(() => {
    if (!profile?.Stats) return [];
    return profile.Stats.filter(
      (s) =>
        ["치명", "특화", "제압", "신속", "인내", "숙련"].includes(s.Type) &&
        parseInt(s.Value, 10) > 0
    );
  }, [profile]);

  const basicStats = useMemo(() => {
    if (!profile?.Stats) return [];
    return profile.Stats.filter((s) =>
      ["최대 생명력", "공격력"].includes(s.Type)
    );
  }, [profile]);

  const engravingEffects: ArkPassiveEngravingEffect[] =
    engraving?.ArkPassiveEffects || [];

  const engravingLevelSummary = useMemo(() => {
    if (engravingEffects.length === 0) return "";
    return engravingEffects.map((e) => e.Level).join(" ");
  }, [engravingEffects]);

  return (
    <Container>
      <LeftColumn>
        <EquipmentSection equipment={equipment} />
        <GemSection gem={gem} />
        <CardSection card={card} />
      </LeftColumn>

      <RightColumn>
        {/* 전투력 */}
        {profile?.CombatPower && (
          <Section>
            <SectionTitle>전투력</SectionTitle>
            <Divider />
            <CombatPowerValue>
              {Number(profile.CombatPower.replace(/,/g, "")).toLocaleString(
                undefined,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}
            </CombatPowerValue>
            <Divider />
            <StatRow>
              <StatLabel>최고 전투력</StatLabel>
              <StatValue>
                {Number(
                  (profile.ItemMaxLevel || profile.CombatPower).replace(
                    /,/g,
                    ""
                  )
                ).toLocaleString()}
              </StatValue>
            </StatRow>
          </Section>
        )}

        {/* 특성 */}
        {(basicStats.length > 0 || combatStats.length > 0) && (
          <Section>
            <SectionTitle>특성</SectionTitle>
            <Divider />
            {basicStats.length > 0 && (
              <BasicStatRow>
                {basicStats.map((s, i) => (
                  <BasicStatItem key={i}>
                    <StatLabel>{s.Type}</StatLabel>
                    <StatValue>
                      {parseInt(s.Value, 10).toLocaleString()}
                    </StatValue>
                  </BasicStatItem>
                ))}
              </BasicStatRow>
            )}
            {combatStats.length > 0 && (
              <>
                <Divider />
                <CombatStatGrid>
                  {combatStats.map((s, i) => (
                    <CombatStatItem key={i}>
                      <CombatStatDot
                        $color={COMBAT_STAT_COLORS[s.Type] || "#959595"}
                      />
                      <CombatStatName>{s.Type}</CombatStatName>
                      <CombatStatValue>
                        {parseInt(s.Value, 10).toLocaleString()}
                      </CombatStatValue>
                    </CombatStatItem>
                  ))}
                </CombatStatGrid>
              </>
            )}
          </Section>
        )}

        {/* 각인 */}
        {engravingEffects.length > 0 && (
          <Section>
            <SectionTitleRow>
              <SectionTitle>각인</SectionTitle>
              {engravingLevelSummary && (
                <EngravingLevelSummary>
                  {engravingLevelSummary}
                </EngravingLevelSummary>
              )}
            </SectionTitleRow>
            <Divider />
            <EngravingList>
              {engravingEffects.map((e, i) => (
                <EngravingRow key={i}>
                  <EngravingName $grade={e.Grade}>
                    {stripHtml(e.Name)}
                  </EngravingName>
                  {e.AbilityStoneLevel !== null && e.AbilityStoneLevel > 0 && (
                    <StoneLevelBadge>
                      <StoneIcon>🪨</StoneIcon>×{e.AbilityStoneLevel}
                    </StoneLevelBadge>
                  )}
                  <EngravingDiamonds>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Diamond
                        key={j}
                        $active={j < e.Level}
                        $grade={e.Grade}
                      />
                    ))}
                  </EngravingDiamonds>
                </EngravingRow>
              ))}
            </EngravingList>
          </Section>
        )}

        {/* 아크패시브 요약 */}
        {arkPassive && arkPassive.IsArkPassive && (
          <Section>
            <SectionTitle>아크패시브</SectionTitle>
            <Divider />
            <ArkPassiveGrid>
              {arkPassive.Points.map((p, i) => {
                const color = getCategoryColor(p.Name);
                return (
                  <ArkPassiveCard key={i} $color={color}>
                    <ArkPassiveName>{p.Name}</ArkPassiveName>
                    <ArkPassiveValue>{p.Value}</ArkPassiveValue>
                  </ArkPassiveCard>
                );
              })}
            </ArkPassiveGrid>
          </Section>
        )}
      </RightColumn>
    </Container>
  );
};

export default StatsTab;

// ─── Styled Components ───

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;

  ${({ theme }) => theme.medias.max768} {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  margin: 10px 0;
`;

// ─── Combat Power ───

const CombatPowerValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #f59e0b;
  text-align: center;
  padding: 4px 0;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const StatValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const BasicStatRow = styled.div`
  display: flex;
  gap: 16px;
`;

const BasicStatItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// ─── Combat Stats ───

const CombatStatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const CombatStatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CombatStatDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const CombatStatName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const CombatStatValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

// ─── Engravings ───

const EngravingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EngravingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EngravingLevelSummary = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light2};
  letter-spacing: 2px;
`;

const EngravingName = styled.span<{ $grade: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $grade }) => getEngravingColor($grade)};
  flex: 1;
`;

const StoneLevelBadge = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
  display: flex;
  align-items: center;
  gap: 1px;
`;

const StoneIcon = styled.span`
  font-size: 10px;
`;

const EngravingDiamonds = styled.div`
  display: flex;
  gap: 2px;
`;

const Diamond = styled.div<{ $active: boolean; $grade: string }>`
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  background: ${({ $active, $grade }) =>
    $active ? getEngravingColor($grade) : "#444"};
`;

// ─── Ark Passive ───

const ArkPassiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const ArkPassiveCard = styled.div<{ $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 8px;
  border-radius: 8px;
  border: 1px solid ${({ $color }) => $color}33;
  background: ${({ $color }) => $color}0A;
`;

const ArkPassiveName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const ArkPassiveValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;
