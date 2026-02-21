import { useMemo, type FC } from "react";
import styled from "styled-components";

import type { ArmoryArkPassive, ArkPassiveEffect } from "@core/types/armory";
import { stripHtml } from "@core/utils/tooltipParser";

interface Props {
  arkPassive: ArmoryArkPassive | null;
}

export const parseEffectDescription = (
  desc: string | null
): { tier: string; skillName: string; level: string } | null => {
  if (!desc) return null;
  const text = stripHtml(desc);
  // "깨달음 1티어 수라의 길 Lv.1" or "진화 1티어 치명 Lv.30"
  const match = text.match(/(\d+티어)\s+(.+?)(?:\s+Lv\.?\s*(\d+))?$/);
  if (match) {
    return {
      tier: match[1],
      skillName: match[2],
      level: match[3] || "",
    };
  }
  // fallback: just name
  const lvMatch = text.match(/(.+?)\s+Lv\.?\s*(\d+)/);
  if (lvMatch) {
    return { tier: "", skillName: lvMatch[1], level: lvMatch[2] };
  }
  return { tier: "", skillName: text, level: "" };
};

export const CATEGORY_ORDER = ["진화", "깨달음", "도약"];

export const CATEGORY_COLORS: Record<string, { main: string; bg: string }> = {
  진화: { main: "#22C55E", bg: "rgba(34, 197, 94, 0.08)" },
  깨달음: { main: "#3B82F6", bg: "rgba(59, 130, 246, 0.08)" },
  도약: { main: "#A855F7", bg: "rgba(168, 85, 247, 0.08)" },
};

const ArkPassiveTab: FC<Props> = ({ arkPassive }) => {
  if (!arkPassive || !arkPassive.IsArkPassive) {
    return <EmptyMessage>아크그리드 정보가 없습니다.</EmptyMessage>;
  }

  const grouped = useMemo(() => {
    if (!arkPassive.Effects || arkPassive.Effects.length === 0) return [];

    const map = arkPassive.Effects.reduce<Record<string, ArkPassiveEffect[]>>(
      (acc, effect) => {
        const key = effect.Name;
        if (!acc[key]) acc[key] = [];
        acc[key].push(effect);
        return acc;
      },
      {}
    );

    return CATEGORY_ORDER.filter((cat) => map[cat]).map((cat) => ({
      name: cat,
      effects: map[cat],
    }));
  }, [arkPassive.Effects]);

  return (
    <Wrapper>
      {/* 포인트 요약 */}
      <PointsRow>
        {arkPassive.Points.map((point, i) => {
          const colors = CATEGORY_COLORS[point.Name] || {
            main: "#959595",
            bg: "#f5f5f5",
          };
          return (
            <PointCard key={i} $color={colors.main} $bg={colors.bg}>
              <PointName>{point.Name}</PointName>
              <PointValue>{point.Value}</PointValue>
              <PointProgress>
                <ProgressTrack>
                  <ProgressFill
                    $color={colors.main}
                    $percentage={Math.min((point.Value / 350) * 100, 100)}
                  />
                </ProgressTrack>
              </PointProgress>
            </PointCard>
          );
        })}
      </PointsRow>

      {/* 카테고리별 효과 */}
      {grouped.map((group) => {
        const colors = CATEGORY_COLORS[group.name] || {
          main: "#959595",
          bg: "#f5f5f5",
        };
        return (
          <GroupSection key={group.name}>
            <GroupHeader $color={colors.main} $bg={colors.bg}>
              {group.name} ({group.effects.length})
            </GroupHeader>
            <EffectList>
              {group.effects.map((effect, i) => {
                const parsed = parseEffectDescription(effect.Description);
                return (
                  <EffectItem key={i}>
                    {effect.Icon && (
                      <EffectIcon src={effect.Icon} alt={parsed?.skillName} />
                    )}
                    <EffectInfo>
                      {parsed?.tier && (
                        <TierBadge $color={colors.main}>
                          T{parsed.tier.replace("티어", "")}
                        </TierBadge>
                      )}
                      {parsed?.level && (
                        <LevelText>Lv.{parsed.level}</LevelText>
                      )}
                      <EffectName>
                        {parsed?.skillName ||
                          stripHtml(effect.Description || "")}
                      </EffectName>
                    </EffectInfo>
                  </EffectItem>
                );
              })}
            </EffectList>
          </GroupSection>
        );
      })}
    </Wrapper>
  );
};

export default ArkPassiveTab;

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

const PointsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  ${({ theme }) => theme.medias.max768} {
    grid-template-columns: 1fr;
  }
`;

const PointCard = styled.div<{ $color: string; $bg: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  border-radius: 8px;
  background: ${({ $bg }) => $bg};
  border: 1px solid ${({ $color }) => $color}33;
`;

const PointName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const PointValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const PointProgress = styled.div`
  width: 100%;
  padding: 0 8px;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.app.border};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $color: string; $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  border-radius: 3px;
  background: ${({ $color }) => $color};
  transition: width 0.3s ease;
`;

const GroupSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const GroupHeader = styled.div<{ $color: string; $bg: string }>`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;

const EffectList = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.app.bg.white};
`;

const EffectItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};

  &:last-child {
    border-bottom: none;
  }
`;

const EffectIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #1a1a2e;
  flex-shrink: 0;
`;

const EffectInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const TierBadge = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  background: ${({ $color }) => $color}1A;
  color: ${({ $color }) => $color};
`;

const LevelText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light2};
`;

const EffectName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;
