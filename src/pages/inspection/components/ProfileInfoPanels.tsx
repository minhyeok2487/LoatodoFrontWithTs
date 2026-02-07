import styled from "styled-components";

import type {
  Engraving,
  Gem,
  Card,
  CardSetEffect,
  ArkPassivePoint,
  ArkPassiveEffect,
  ArkgridEffect,
} from "@core/types/inspection";

import {
  getGradeColor,
  ARK_PASSIVE_COLORS,
  type EquipDiff,
} from "./profileUtils";

/* ===== Engraving Section ===== */

export const EngravingSection = ({
  engravings,
}: {
  engravings: Engraving[];
}) => {
  if (engravings.length === 0) return null;
  return (
    <Section>
      <SectionTitle>각인</SectionTitle>
      <EngravingGrid>
        {engravings.map((eng) => (
          <EngravingItem key={eng.name}>
            <EngravingLevel $color={getGradeColor(eng.grade)}>
              Lv.{eng.level}
            </EngravingLevel>
            <EngravingName $color={getGradeColor(eng.grade)}>
              {eng.name}
            </EngravingName>
            {eng.abilityStoneLevel != null && (
              <EngravingStoneBadge>
                돌Lv.{eng.abilityStoneLevel}
              </EngravingStoneBadge>
            )}
          </EngravingItem>
        ))}
      </EngravingGrid>
    </Section>
  );
};

/* ===== Gem Section ===== */

export const GemSection = ({ gems }: { gems: Gem[] }) => {
  if (gems.length === 0) return null;

  const damageGems = gems.filter(
    (g) => g.option?.includes("피해") || g.description?.includes("피해")
  );
  const cooldownGems = gems.filter(
    (g) => g.option?.includes("재사용") || g.description?.includes("재사용")
  );

  const renderGemColumn = (title: string, gemList: Gem[]) => {
    if (gemList.length === 0) return null;
    return (
      <GemColumn>
        <GemColumnTitle>{title}</GemColumnTitle>
        {gemList.map((gem) => (
          <GemItem key={gem.gemSlot}>
            {gem.skillIcon && (
              <GemSkillIcon src={gem.skillIcon} alt={gem.skillName} />
            )}
            <GemInfo>
              <GemSkillName>{gem.skillName}</GemSkillName>
              <GemLevelBadge $color={getGradeColor(gem.grade)}>
                Lv.{gem.level}
              </GemLevelBadge>
            </GemInfo>
            <GemDesc>{gem.description}</GemDesc>
          </GemItem>
        ))}
      </GemColumn>
    );
  };

  return (
    <Section>
      <SectionTitle>보석</SectionTitle>
      <GemGrid>
        {renderGemColumn("피해 증가", damageGems)}
        {renderGemColumn("재사용 감소", cooldownGems)}
      </GemGrid>
    </Section>
  );
};

/* ===== Card Section ===== */

export const CardSection = ({
  cards,
  cardSetEffects,
}: {
  cards: Card[];
  cardSetEffects: CardSetEffect[];
}) => {
  if (cards.length === 0) return null;
  return (
    <Section>
      <SectionTitle>카드</SectionTitle>
      <CardGrid>
        {cards.map((card) => (
          <CardItem key={card.slot}>
            <CardIconWrapper $gradeColor={getGradeColor(card.grade)}>
              {card.icon ? (
                <img src={card.icon} alt={card.name} />
              ) : (
                <PlaceholderIcon>{card.name[0]}</PlaceholderIcon>
              )}
              <CardAwake>
                {"◆".repeat(card.awakeCount)}
                {"◇".repeat(card.awakeTotal - card.awakeCount)}
              </CardAwake>
            </CardIconWrapper>
            <CardName>{card.name}</CardName>
          </CardItem>
        ))}
      </CardGrid>
      {cardSetEffects.length > 0 && (
        <CardSetEffectList>
          {cardSetEffects.map((effect) => (
            <CardSetEffectItem key={effect.name}>
              <CardSetEffectName>{effect.name}</CardSetEffectName>
              <CardSetEffectDesc>{effect.description}</CardSetEffectDesc>
            </CardSetEffectItem>
          ))}
        </CardSetEffectList>
      )}
    </Section>
  );
};

/* ===== Ark Passive Section ===== */

export const ArkPassiveSection = ({
  arkPassiveTitle,
  arkPassivePoints,
  arkPassiveEffects,
}: {
  arkPassiveTitle?: string | null;
  arkPassivePoints: ArkPassivePoint[];
  arkPassiveEffects: ArkPassiveEffect[];
}) => {
  if (arkPassivePoints.length === 0) return null;
  return (
    <Section>
      <SectionTitle>
        아크 패시브
        {arkPassiveTitle && (
          <ArkPassiveTitleBadge>{arkPassiveTitle}</ArkPassiveTitleBadge>
        )}
      </SectionTitle>
      <ArkPassivePointsRow>
        {arkPassivePoints.map((point) => {
          const categoryColor = ARK_PASSIVE_COLORS[point.name] ?? "#aaa";
          return (
            <ArkPassivePointItem key={point.name} $color={categoryColor}>
              <ArkPassivePointDot $color={categoryColor} />
              <ArkPassivePointName>{point.name}</ArkPassivePointName>
              <ArkPassivePointValue>{point.value}</ArkPassivePointValue>
              <ArkPassiveRank>{point.description}</ArkPassiveRank>
            </ArkPassivePointItem>
          );
        })}
      </ArkPassivePointsRow>
      {arkPassiveEffects.length > 0 && (
        <ArkPassiveEffectGrid>
          {["진화", "깨달음", "도약"].map((category) => {
            const effects = arkPassiveEffects.filter(
              (e) => e.category === category
            );
            if (effects.length === 0) return null;
            const categoryColor = ARK_PASSIVE_COLORS[category] ?? "#aaa";
            return (
              <ArkPassiveEffectColumn key={category}>
                <ArkPassiveEffectColumnTitle $color={categoryColor}>
                  {category}
                </ArkPassiveEffectColumnTitle>
                {effects.map((effect) => (
                  <ArkPassiveEffectItem key={effect.effectName}>
                    {effect.icon && (
                      <ArkPassiveEffectIcon
                        src={effect.icon}
                        alt={effect.effectName}
                      />
                    )}
                    <ArkPassiveEffectName>
                      {effect.effectName}
                    </ArkPassiveEffectName>
                    <ArkPassiveEffectLevel $color={categoryColor}>
                      Lv.{effect.level}
                    </ArkPassiveEffectLevel>
                  </ArkPassiveEffectItem>
                ))}
              </ArkPassiveEffectColumn>
            );
          })}
        </ArkPassiveEffectGrid>
      )}
    </Section>
  );
};

/* ===== Arkgrid Section ===== */

export const ArkgridSection = ({
  currentEffects,
  prevEffectsMap,
  hasPreviousHistory,
}: {
  currentEffects: ArkgridEffect[];
  prevEffectsMap: Map<string, ArkgridEffect>;
  hasPreviousHistory: boolean;
}) => {
  if (currentEffects.length === 0) return null;
  return (
    <Section>
      <SectionTitle>아크 그리드</SectionTitle>
      <ArkgridGrid>
        {currentEffects.map((effect) => {
          const prev = prevEffectsMap.get(effect.effectName);
          const levelChanged =
            prev && prev.effectLevel !== effect.effectLevel;
          const isNew = !prev && hasPreviousHistory;

          return (
            <ArkgridItem
              key={effect.effectName}
              $changed={!!levelChanged || !!isNew}
            >
              <ArkgridName>{effect.effectName}</ArkgridName>
              <ArkgridLevel>
                Lv.{effect.effectLevel}
                {levelChanged && prev && (
                  <ArkgridDiff
                    $positive={effect.effectLevel > prev.effectLevel}
                  >
                    {effect.effectLevel > prev.effectLevel ? " ↑" : " ↓"}
                  </ArkgridDiff>
                )}
                {isNew && <ArkgridNewBadge>NEW</ArkgridNewBadge>}
              </ArkgridLevel>
            </ArkgridItem>
          );
        })}
      </ArkgridGrid>
    </Section>
  );
};

/* ===== Changes Section ===== */

export const ChangesSection = ({
  changedDiffs,
}: {
  changedDiffs: EquipDiff[];
}) => (
  <Section>
    <SectionTitle>전일 대비 변화</SectionTitle>
    {changedDiffs.length > 0 ? (
      <ChangesList>
        {changedDiffs.map((diff) => (
          <ChangeEntry key={diff.type}>
            <ChangeSlotName>{diff.type}</ChangeSlotName>
            <ChangeDetail>{diff.changes.join(", ")}</ChangeDetail>
          </ChangeEntry>
        ))}
      </ChangesList>
    ) : (
      <NoChanges>전일 대비 변동 없음</NoChanges>
    )}
  </Section>
);

/* ===== Shared Styled Components ===== */

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h5`
  font-size: 12px;
  font-weight: 600;
  color: #6666aa;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const PlaceholderIcon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #444;
`;

/* Engravings */

const EngravingGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const EngravingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

const EngravingLevel = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: ${({ $color }) => $color};
  border-radius: 4px;
  box-shadow: 0 0 6px ${({ $color }) => $color}40;
  white-space: nowrap;
`;

const EngravingName = styled.span<{ $color: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  text-shadow: 0 0 8px ${({ $color }) => $color}30;
`;

const EngravingStoneBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #aaaacc;
  padding: 1px 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  white-space: nowrap;
`;

/* Gems */

const GemGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const GemColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GemColumnTitle = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #7777aa;
  margin-bottom: 2px;
`;

const GemItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const GemSkillIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  object-fit: cover;
`;

const GemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const GemSkillName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #ccccee;
`;

const GemLevelBadge = styled.span<{ $color: string }>`
  font-size: 10px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  padding: 1px 4px;
  background: ${({ $color }) => $color}15;
  border-radius: 3px;
  white-space: nowrap;
`;

const GemDesc = styled.span`
  font-size: 10px;
  color: #7777aa;
  margin-left: auto;
  white-space: nowrap;
`;

/* Cards */

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CardItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 60px;
`;

const CardIconWrapper = styled.div<{ $gradeColor: string }>`
  position: relative;
  width: 48px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  background: #0e0e1a;
  box-shadow: 0 0 6px ${({ $gradeColor }) => $gradeColor}40,
    inset 0 0 0 1px ${({ $gradeColor }) => $gradeColor}60;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardAwake = styled.span`
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 9px;
  font-weight: 700;
  color: #ffcc00;
  background: rgba(0, 0, 0, 0.7);
  padding: 1px 3px;
  border-radius: 2px;
`;

const CardName = styled.span`
  font-size: 10px;
  color: #aaaacc;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60px;
`;

const CardSetEffectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
`;

const CardSetEffectItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
`;

const CardSetEffectName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #7b68ee;
  white-space: nowrap;
`;

const CardSetEffectDesc = styled.span`
  font-size: 11px;
  color: #7777aa;
`;

/* Ark Passive */

const ArkPassivePointsRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ArkPassiveTitleBadge = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #aaaacc;
  margin-left: 8px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  text-transform: none;
  letter-spacing: 0;
`;

const ArkPassivePointItem = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: ${({ $color }) => $color}08;
  border: 1px solid ${({ $color }) => $color}20;
  border-radius: 10px;
`;

const ArkPassivePointDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 6px ${({ $color }) => $color}60;
  flex-shrink: 0;
`;

const ArkPassivePointName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #aaaacc;
`;

const ArkPassivePointValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
`;

const ArkPassiveRank = styled.span`
  font-size: 10px;
  color: #7777aa;
`;

const ArkPassiveEffectGrid = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const ArkPassiveEffectColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ArkPassiveEffectColumnTitle = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  margin-bottom: 2px;
  text-shadow: 0 0 8px ${({ $color }) => $color}30;
`;

const ArkPassiveEffectItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
`;

const ArkPassiveEffectIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 3px;
  object-fit: cover;
`;

const ArkPassiveEffectName = styled.span`
  font-size: 12px;
  color: #ccccee;
  flex: 1;
`;

const ArkPassiveEffectLevel = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

/* Arkgrid */

const ArkgridGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 6px;
`;

const ArkgridItem = styled.div<{ $changed: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: ${({ $changed }) =>
    $changed
      ? "linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(74, 222, 128, 0.03) 100%)"
      : "rgba(255, 255, 255, 0.02)"};
  border-radius: 8px;
  transition: all 0.2s;

  ${({ $changed }) =>
    $changed && `box-shadow: 0 0 8px rgba(74, 222, 128, 0.1);`}

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-1px);
  }
`;

const ArkgridName = styled.span`
  font-size: 12px;
  color: #aaaacc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArkgridLevel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 3px;
`;

const ArkgridDiff = styled.span<{ $positive: boolean }>`
  font-size: 12px;
  font-weight: 700;
  color: ${({ $positive }) => ($positive ? "#4ade80" : "#f87171")};
  text-shadow: ${({ $positive }) =>
    $positive
      ? "0 0 6px rgba(74,222,128,0.5)"
      : "0 0 6px rgba(248,113,113,0.5)"};
`;

const ArkgridNewBadge = styled.span`
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  padding: 1px 5px;
  border-radius: 6px;
  margin-left: 4px;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
`;

/* Changes */

const ChangesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChangeEntry = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: linear-gradient(
    135deg,
    rgba(251, 191, 36, 0.1) 0%,
    rgba(251, 191, 36, 0.03) 100%
  );
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(251, 191, 36, 0.15) 0%,
      rgba(251, 191, 36, 0.05) 100%
    );
    transform: translateX(2px);
  }
`;

const ChangeSlotName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #ccccee;
  white-space: nowrap;
`;

const ChangeDetail = styled.span`
  font-size: 12px;
  color: #fbbf24;
  text-shadow: 0 0 4px rgba(251, 191, 36, 0.2);
`;

const NoChanges = styled.div`
  padding: 16px;
  font-size: 13px;
  color: #555;
  text-align: center;
  background: rgba(255, 255, 255, 0.01);
  border-radius: 10px;
`;
