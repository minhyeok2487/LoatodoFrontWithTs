import { useMemo, type FC } from "react";
import styled from "styled-components";

import type { ArmoryArkPassive, ArkPassiveEffect } from "@core/types/armory";
import { stripHtml } from "@core/utils/tooltipParser";

interface Props {
  arkPassive: ArmoryArkPassive | null;
}

/** Description HTML에서 티어 + 스킬명 + 레벨 추출 */
const parseEffectDescription = (
  desc: string | null
): { tier: string; skillName: string } | null => {
  if (!desc) return null;
  const text = stripHtml(desc);
  // "깨달음 1티어 수라의 길 Lv.1" 형태
  const match = text.match(/(\d+티어)\s+(.+)/);
  if (match) {
    return { tier: match[1], skillName: match[2] };
  }
  return { tier: "", skillName: text };
};

const CATEGORY_ORDER = ["진화", "깨달음", "도약"];

const ArkPassiveTab: FC<Props> = ({ arkPassive }) => {
  if (!arkPassive || !arkPassive.IsArkPassive) {
    return <EmptyMessage>아크패시브 정보가 없습니다.</EmptyMessage>;
  }

  const getCategoryColor = (name: string): string => {
    if (name.includes("진화")) return "#22C55E";
    if (name.includes("깨달음")) return "#3B82F6";
    if (name.includes("도약")) return "#A855F7";
    return "#959595";
  };

  // Effects를 Name(카테고리)별로 그룹핑
  const grouped = useMemo(() => {
    if (!arkPassive.Effects || arkPassive.Effects.length === 0) return [];

    const map = arkPassive.Effects.reduce<Record<string, ArkPassiveEffect[]>>(
      (acc, effect) => {
        const key = effect.Name;
        if (!acc[key]) {
          acc[key] = [];
        }
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
        {arkPassive.Points.map((point, i) => (
          <PointCard key={i} $color={getCategoryColor(point.Name)}>
            <PointName>{point.Name}</PointName>
            <PointValue>{point.Value}</PointValue>
          </PointCard>
        ))}
      </PointsRow>

      {/* 카테고리별 효과 */}
      {grouped.map((group) => (
        <GroupSection key={group.name}>
          <GroupTitle $color={getCategoryColor(group.name)}>
            {group.name} ({group.effects.length})
          </GroupTitle>
          <SkillGrid>
            {group.effects.map((effect, i) => {
              const parsed = parseEffectDescription(effect.Description);
              return (
                <SkillCard key={i}>
                  {effect.Icon && (
                    <SkillIcon src={effect.Icon} alt={parsed?.skillName || ""} />
                  )}
                  <SkillInfo>
                    <SkillName>
                      {parsed?.skillName || stripHtml(effect.Description || "")}
                    </SkillName>
                    {parsed?.tier && <SkillTier>{parsed.tier}</SkillTier>}
                  </SkillInfo>
                </SkillCard>
              );
            })}
          </SkillGrid>
        </GroupSection>
      ))}
    </Wrapper>
  );
};

export default ArkPassiveTab;

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
  display: flex;
  gap: 12px;

  ${({ theme }) => theme.medias.max768} {
    flex-direction: column;
  }
`;

const PointCard = styled.div<{ $color: string }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 2px solid ${({ $color }) => $color};
`;

const PointName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const PointValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const GroupSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GroupTitle = styled.h3<{ $color: string }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;

  ${({ theme }) => theme.medias.max768} {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

const SkillCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const SkillIcon = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: #1a1a2e;
  flex-shrink: 0;
`;

const SkillInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const SkillName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SkillTier = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
`;
