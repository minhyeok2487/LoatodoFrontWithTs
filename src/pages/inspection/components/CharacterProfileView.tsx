import { useMemo } from "react";
import styled from "styled-components";

import useInspectionDetail from "@core/hooks/queries/inspection/useInspectionDetail";
import type {
  InspectionCharacter,
  EquipmentHistory,
  ArkgridEffect,
  Engraving,
  Card,
  CardSetEffect,
  Gem,
  ArkPassivePoint,
  ArkPassiveEffect,
} from "@core/types/inspection";

interface Props {
  character: InspectionCharacter;
  onClose: () => void;
}

const GRADE_COLORS: Record<string, string> = {
  고대: "#E3C7A1",
  유물: "#FA5D00",
  전설: "#F99200",
  영웅: "#8045DD",
  희귀: "#2AB1F6",
  고급: "#91FE02",
  일반: "#CCCCCC",
};

const getGradeColor = (grade?: string | null): string =>
  (grade && GRADE_COLORS[grade]) || "#666";

const getQualityColor = (quality: number): string => {
  if (quality === 100) return "#FF6600";
  if (quality >= 90) return "#9B59B6";
  if (quality >= 70) return "#2E86C1";
  if (quality >= 30) return "#27AE60";
  return "#F1C40F";
};

const ARMOR_SLOTS = ["투구", "어깨", "상의", "하의", "장갑", "무기"];
const ACCESSORY_SLOTS = ["목걸이", "귀걸이", "반지"];
const OTHER_SLOTS = ["어빌리티 스톤", "팔찌"];

const formatEffectText = (text: string): string =>
  text
    .replace(/([\d.]+%)([\uAC00-\uD7AF])/g, "$1\n$2")
    .replace(/(\+[\d,.]+)([\uAC00-\uD7AF])/g, "$1\n$2")
    .replace(/(다\.)\s*([\uAC00-\uD7AF])/g, "$1\n$2");

type GrindingTier = "dealer" | "support" | "compromise" | "trash";

const GRINDING_TIER_COLORS: Record<GrindingTier, string> = {
  dealer: "#4FC3F7",
  support: "#FFB74D",
  compromise: "#FF8A65",
  trash: "#555",
};

const getGrindingTier = (line: string): GrindingTier => {
  const t = line.trim();
  if (!t) return "trash";
  if (/아덴 획득|낙인력|파티원 회복|파티원 보호막|아군 공격력 강화|아군 피해량 강화/.test(t))
    return "support";
  if (/최대 생명력|최대 마나/.test(t)) return "compromise";
  if (/상태이상 공격 지속시간|전투 중 생명력 회복량/.test(t)) return "trash";
  if (/추가 피해|적에게 주는 피해|공격력|무기공격력|치명타 적중|치명타 피해/.test(t))
    return "dealer";
  return "trash";
};

const formatRefinement = (equip: EquipmentHistory): string => {
  let text = "";
  if (equip.refinement != null && equip.refinement > 0) {
    text += `+${equip.refinement}강`;
  }
  if (equip.advancedRefinement != null && equip.advancedRefinement > 0) {
    text += ` (+상재${equip.advancedRefinement})`;
  }
  return text;
};

type EquipChangeType = "upgraded" | "downgraded" | "changed" | "new" | "removed" | "unchanged";

interface EquipDiff {
  type: string;
  current: EquipmentHistory | null;
  previous: EquipmentHistory | null;
  changeType: EquipChangeType;
  changes: string[];
}

const ARK_PASSIVE_COLORS: Record<string, string> = {
  진화: "#F1D594",
  깨달음: "#83E9FF",
  도약: "#C2EA55",
};

// Mock data - 백엔드 완료 전 UI 확인용
const MOCK_ENGRAVINGS: Engraving[] = [
  { name: "원한", level: 0, grade: "유물", abilityStoneLevel: null },
  { name: "아드레날린", level: 2, grade: "유물", abilityStoneLevel: 4 },
  { name: "돌격대장", level: 0, grade: "유물", abilityStoneLevel: null },
  { name: "예리한 둔기", level: 0, grade: "전설", abilityStoneLevel: null },
  { name: "바리케이드", level: 0, grade: "전설", abilityStoneLevel: null },
];

const MOCK_GEMS: Gem[] = [
  { skillName: "천벌", gemSlot: 1, skillIcon: "", level: 7, grade: "전설", description: "재사용 대기시간 18.00% 감소", option: "재사용" },
  { skillName: "심판", gemSlot: 2, skillIcon: "", level: 7, grade: "전설", description: "재사용 대기시간 16.00% 감소", option: "재사용" },
  { skillName: "홀리 소드", gemSlot: 3, skillIcon: "", level: 7, grade: "전설", description: "재사용 대기시간 16.00% 감소", option: "재사용" },
  { skillName: "천벌", gemSlot: 4, skillIcon: "", level: 10, grade: "고대", description: "피해 40.00% 증가", option: "피해" },
  { skillName: "심판", gemSlot: 5, skillIcon: "", level: 10, grade: "고대", description: "피해 40.00% 증가", option: "피해" },
  { skillName: "홀리 소드", gemSlot: 6, skillIcon: "", level: 9, grade: "유물", description: "피해 30.00% 증가", option: "피해" },
];

const MOCK_CARDS: Card[] = [
  { slot: 1, name: "카멘", icon: "", awakeCount: 5, awakeTotal: 5, grade: "전설" },
  { slot: 2, name: "비아키스", icon: "", awakeCount: 5, awakeTotal: 5, grade: "전설" },
  { slot: 3, name: "쿠크세이튼", icon: "", awakeCount: 5, awakeTotal: 5, grade: "전설" },
  { slot: 4, name: "발탄", icon: "", awakeCount: 5, awakeTotal: 5, grade: "전설" },
  { slot: 5, name: "일리아칸", icon: "", awakeCount: 5, awakeTotal: 5, grade: "전설" },
  { slot: 6, name: "아브렐슈드", icon: "", awakeCount: 5, awakeTotal: 5, grade: "전설" },
];

const MOCK_CARD_SET_EFFECTS: CardSetEffect[] = [
  { name: "카제로스의 군단장", description: "6세트 30각성" },
];

const MOCK_ARK_PASSIVE_POINTS: ArkPassivePoint[] = [
  { name: "진화", value: 155, description: "6랭크 21레벨" },
  { name: "깨달음", value: 155, description: "6랭크 21레벨" },
  { name: "도약", value: 155, description: "6랭크 21레벨" },
];

const MOCK_ARK_PASSIVE_EFFECTS: ArkPassiveEffect[] = [
  { category: "진화", effectName: "점화 Lv.3", icon: "", tier: 1, level: 3 },
  { category: "진화", effectName: "권능 Lv.2", icon: "", tier: 1, level: 2 },
  { category: "진화", effectName: "쐐기 Lv.1", icon: "", tier: 2, level: 1 },
  { category: "깨달음", effectName: "환류 Lv.3", icon: "", tier: 1, level: 3 },
  { category: "깨달음", effectName: "섬광 Lv.2", icon: "", tier: 1, level: 2 },
  { category: "도약", effectName: "창공 Lv.3", icon: "", tier: 1, level: 3 },
  { category: "도약", effectName: "비상 Lv.2", icon: "", tier: 2, level: 2 },
];

const CharacterProfileView = ({ character, onClose }: Props) => {
  const { data } = useInspectionDetail(character.id);

  const { latestHistory, previousHistory } = useMemo(() => {
    if (!data?.histories || data.histories.length === 0)
      return { latestHistory: null, previousHistory: null };
    const sorted = [...data.histories].sort(
      (a, b) =>
        new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
    );
    return {
      latestHistory: sorted[0],
      previousHistory: sorted.length > 1 ? sorted[1] : null,
    };
  }, [data]);

  const equipMap = useMemo(() => {
    const map = new Map<string, EquipmentHistory[]>();
    (latestHistory?.equipments ?? []).forEach((e) => {
      const list = map.get(e.type) ?? [];
      list.push(e);
      map.set(e.type, list);
    });
    return map;
  }, [latestHistory]);

  const equipDiffs = useMemo((): EquipDiff[] => {
    const currentEquips = latestHistory?.equipments ?? [];
    const prevEquips = previousHistory?.equipments ?? [];
    if (currentEquips.length === 0) return [];

    const prevByType = new Map<string, EquipmentHistory[]>();
    prevEquips.forEach((e) => {
      const list = prevByType.get(e.type) ?? [];
      list.push(e);
      prevByType.set(e.type, list);
    });

    const usedPrevIndices = new Map<string, number>();

    return currentEquips.map((equip) => {
      const prevList = prevByType.get(equip.type) ?? [];
      const idx = usedPrevIndices.get(equip.type) ?? 0;
      usedPrevIndices.set(equip.type, idx + 1);
      const prev = prevList[idx] ?? null;

      if (!prev || prevEquips.length === 0) {
        return {
          type: equip.type,
          current: equip,
          previous: null,
          changeType: "unchanged" as EquipChangeType,
          changes: [],
        };
      }
      const changes: string[] = [];
      if (equip.name !== prev.name) changes.push("장비 교체");
      if (equip.quality != null && prev.quality != null && equip.quality !== prev.quality) {
        const diff = equip.quality - prev.quality;
        changes.push(`품질 ${diff > 0 ? "+" : ""}${diff}`);
      }
      if (equip.refinement != null && prev.refinement != null && equip.refinement !== prev.refinement) {
        changes.push(`재련 ${prev.refinement} → ${equip.refinement}`);
      }
      if (equip.advancedRefinement != null && prev.advancedRefinement != null && equip.advancedRefinement !== prev.advancedRefinement) {
        changes.push(`상재 ${prev.advancedRefinement} → ${equip.advancedRefinement}`);
      }
      const changeType: EquipChangeType = changes.length === 0 ? "unchanged" : "changed";
      return { type: equip.type, current: equip, previous: prev, changeType, changes };
    });
  }, [latestHistory, previousHistory]);

  // TODO: 테스트 후 삭제
  const TEST_MODE = true;
  const testDiffs: EquipDiff[] = TEST_MODE
    ? [
        { type: "투구", current: null, previous: null, changeType: "changed", changes: ["장비 교체"] },
        { type: "무기", current: null, previous: null, changeType: "changed", changes: ["재련 24 → 25"] },
        { type: "상의", current: null, previous: null, changeType: "changed", changes: ["상재 1 → 2"] },
        { type: "장갑", current: null, previous: null, changeType: "changed", changes: ["품질 +7"] },
        { type: "목걸이", current: null, previous: null, changeType: "changed", changes: ["장비 교체", "품질 +15"] },
        { type: "귀걸이", current: null, previous: null, changeType: "changed", changes: ["품질 +3"] },
        { type: "반지", current: null, previous: null, changeType: "changed", changes: ["장비 교체"] },
      ]
    : [];

  const changedDiffs = TEST_MODE
    ? testDiffs
    : equipDiffs.filter((d) => d.changeType !== "unchanged");

  const { currentEffects, prevEffectsMap } = useMemo(() => {
    const current = latestHistory?.arkgridEffects ?? [];
    const prevMap = new Map<string, ArkgridEffect>();
    (previousHistory?.arkgridEffects ?? []).forEach((e) =>
      prevMap.set(e.effectName, e)
    );
    return { currentEffects: current, prevEffectsMap: prevMap };
  }, [latestHistory, previousHistory]);

  const realEngravings = latestHistory?.engravings ?? [];
  const realCards = latestHistory?.cards ?? [];
  const realCardSetEffects = latestHistory?.cardSetEffects ?? [];
  const realGems = latestHistory?.gems ?? [];
  const realArkPassivePoints = latestHistory?.arkPassivePoints ?? [];
  const realArkPassiveEffects = latestHistory?.arkPassiveEffects ?? [];

  // 백엔드 데이터가 없으면 목 데이터 사용
  const engravings = realEngravings.length > 0 ? realEngravings : MOCK_ENGRAVINGS;
  const cards = realCards.length > 0 ? realCards : MOCK_CARDS;
  const cardSetEffects = realCardSetEffects.length > 0 ? realCardSetEffects : MOCK_CARD_SET_EFFECTS;
  const gems = realGems.length > 0 ? realGems : MOCK_GEMS;
  const arkPassivePoints = realArkPassivePoints.length > 0 ? realArkPassivePoints : MOCK_ARK_PASSIVE_POINTS;
  const arkPassiveEffects = realArkPassiveEffects.length > 0 ? realArkPassiveEffects : MOCK_ARK_PASSIVE_EFFECTS;

  const damageGems = gems.filter(
    (g) => g.option?.includes("피해") || g.description?.includes("피해")
  );
  const cooldownGems = gems.filter(
    (g) => g.option?.includes("재사용") || g.description?.includes("재사용")
  );

  const renderSingleEquip = (
    equip: EquipmentHistory,
    index: number,
    mode: "armor" | "accessory" | "other"
  ) => {
    const gradeColor = getGradeColor(equip.grade);
    const refinementText = formatRefinement(equip);
    const allDiffs = TEST_MODE ? testDiffs : equipDiffs;
    const matchingDiffs = allDiffs.filter((d) => d.type === equip.type);
    const diff = TEST_MODE
      ? matchingDiffs[index] ?? matchingDiffs[0] ?? null
      : matchingDiffs.find((d) => d.current === equip) ?? null;
    const hasChange = diff && diff.changeType !== "unchanged";

    return (
      <EquipSlot key={`${equip.type}-${index}`} $hasChange={!!hasChange}>
        <EquipIcon $gradeColor={gradeColor}>
          {equip.icon ? (
            <img src={equip.icon} alt={equip.type} />
          ) : (
            <PlaceholderIcon>{equip.type[0]}</PlaceholderIcon>
          )}
        </EquipIcon>
        <EquipDetails>
          <EquipNameRow>
            <EquipName $gradeColor={gradeColor}>{equip.name}</EquipName>
            {mode === "armor" && refinementText && (
              <RefinementText>{refinementText}</RefinementText>
            )}
          </EquipNameRow>

          {equip.quality != null && equip.quality >= 0 && (
            <QualityRow>
              <QualityBar>
                <QualityFill
                  $width={equip.quality}
                  $color={getQualityColor(equip.quality)}
                />
              </QualityBar>
              <QualityValue $color={getQualityColor(equip.quality)}>
                {equip.quality}
              </QualityValue>
            </QualityRow>
          )}

          {mode === "armor" && equip.basicEffect && (
            <EffectText>{formatEffectText(equip.basicEffect)}</EffectText>
          )}
          {mode === "accessory" && equip.grindingEffect && (
            <EffectLines>
              {formatEffectText(equip.grindingEffect)
                .split("\n")
                .filter((l) => l.trim())
                .map((line, i) => (
                  <EffectLine key={i} $color={GRINDING_TIER_COLORS[getGrindingTier(line)]}>
                    {line}
                  </EffectLine>
                ))}
            </EffectLines>
          )}
          {mode === "accessory" && equip.engravings && (
            <EffectText>{formatEffectText(equip.engravings)}</EffectText>
          )}
          {equip.type === "어빌리티 스톤" && equip.engravings && (
            <EffectText>{formatEffectText(equip.engravings)}</EffectText>
          )}
          {equip.type === "팔찌" && equip.braceletEffect && (
            <EffectText>{formatEffectText(equip.braceletEffect)}</EffectText>
          )}

          {hasChange && diff && (
            <ChangeIndicator>{diff.changes.join(", ")}</ChangeIndicator>
          )}
        </EquipDetails>
      </EquipSlot>
    );
  };

  const renderSlotGroup = (slotNames: string[], mode: "armor" | "accessory" | "other") => {
    const items: JSX.Element[] = [];
    slotNames.forEach((slotName) => {
      const equips = equipMap.get(slotName) ?? [];
      if (equips.length === 0) {
        items.push(<EmptySlot key={slotName}>{slotName}</EmptySlot>);
      } else {
        equips.forEach((equip, idx) => {
          items.push(renderSingleEquip(equip, idx, mode));
        });
      }
    });
    return items;
  };

  return (
    <ProfileWrapper>
      {/* Header */}
      <ProfileHeader>
        <HeaderLeft>
          <HeaderInfo>
            {character.title && (
              <CharacterTitle>{character.title}</CharacterTitle>
            )}
            <CharacterNameLarge>{character.characterName}</CharacterNameLarge>
            <CharacterMeta>
              {character.serverName} / {character.characterClassName}
              {character.guildName && ` / ${character.guildName}`}
            </CharacterMeta>
            {(character.townName || character.expeditionLevel > 0) && (
              <CharacterMeta>
                {character.townName && character.townLevel != null
                  ? `영지 ${character.townName} Lv.${character.townLevel}`
                  : ""}
                {character.townName && character.expeditionLevel > 0 ? " / " : ""}
                {character.expeditionLevel > 0
                  ? `원정대 Lv.${character.expeditionLevel}`
                  : ""}
              </CharacterMeta>
            )}
          </HeaderInfo>
        </HeaderLeft>

        <HeaderStats>
          <HeaderStatItem>
            <HeaderStatLabel>아이템 Lv</HeaderStatLabel>
            <HeaderStatValue>
              {character.itemLevel.toLocaleString()}
            </HeaderStatValue>
          </HeaderStatItem>
          <HeaderStatItem>
            <HeaderStatLabel>전투력</HeaderStatLabel>
            <HeaderStatValue>
              {character.combatPower.toLocaleString()}
            </HeaderStatValue>
          </HeaderStatItem>
          {character.previousCombatPower !== null && (
            <HeaderStatItem>
              <HeaderStatLabel>전일 대비</HeaderStatLabel>
              <HeaderStatChange $isPositive={character.combatPowerChange > 0}>
                {character.combatPowerChange > 0 ? "+" : ""}
                {character.combatPowerChange.toLocaleString()}
              </HeaderStatChange>
            </HeaderStatItem>
          )}
        </HeaderStats>

        <CloseButton onClick={onClose}>닫기</CloseButton>

        {character.stats && character.stats.length > 0 && (
          <StatsBar>
            {character.stats.map((stat) => (
              <StatBadge key={stat.type}>
                <StatBadgeLabel>{stat.type}</StatBadgeLabel>
                <StatBadgeValue>{stat.value}</StatBadgeValue>
              </StatBadge>
            ))}
          </StatsBar>
        )}
      </ProfileHeader>

      {/* Equipment: Left - Right with character background */}
      {(latestHistory?.equipments ?? []).length > 0 && (
        <EquipmentSection>
          {character.characterImage && (
            <CharacterBgImage
              src={character.characterImage}
              alt=""
            />
          )}
          <LeftEquipPanel>
            <SectionTitle>방어구 / 무기</SectionTitle>
            <SlotList>
              {renderSlotGroup(ARMOR_SLOTS, "armor")}
            </SlotList>
          </LeftEquipPanel>

          <RightEquipPanel>
            <SectionTitle>악세서리</SectionTitle>
            <SlotList>
              {renderSlotGroup(ACCESSORY_SLOTS, "accessory")}
            </SlotList>

            {OTHER_SLOTS.some((s) => equipMap.has(s)) && (
              <>
                <SectionTitle>기타</SectionTitle>
                <SlotList>
                  {renderSlotGroup(OTHER_SLOTS, "other")}
                </SlotList>
              </>
            )}
          </RightEquipPanel>
        </EquipmentSection>
      )}

      {/* Engravings + Gems + Cards + Ark Passive + Arkgrid + Changes */}
      <BottomSection>
        {/* Engravings */}
        {engravings.length > 0 && (
          <EngravingSection>
            <SectionTitle>각인</SectionTitle>
            <EngravingGrid>
              {engravings.map((eng, idx) => (
                <EngravingItem key={idx}>
                  <EngravingLevel
                    $color={getGradeColor(eng.grade)}
                  >
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
          </EngravingSection>
        )}

        {/* Gems */}
        {gems.length > 0 && (
          <GemSection>
            <SectionTitle>보석</SectionTitle>
            <GemGrid>
              {damageGems.length > 0 && (
                <GemColumn>
                  <GemColumnTitle>피해 증가</GemColumnTitle>
                  {damageGems.map((gem, idx) => (
                    <GemItem key={idx}>
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
              )}
              {cooldownGems.length > 0 && (
                <GemColumn>
                  <GemColumnTitle>재사용 감소</GemColumnTitle>
                  {cooldownGems.map((gem, idx) => (
                    <GemItem key={idx}>
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
              )}
            </GemGrid>
          </GemSection>
        )}

        {/* Cards */}
        {cards.length > 0 && (
          <CardSection>
            <SectionTitle>카드</SectionTitle>
            <CardGrid>
              {cards.map((card, idx) => (
                <CardItem key={idx}>
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
                {cardSetEffects.map((effect, idx) => (
                  <CardSetEffectItem key={idx}>
                    <CardSetEffectName>{effect.name}</CardSetEffectName>
                    <CardSetEffectDesc>{effect.description}</CardSetEffectDesc>
                  </CardSetEffectItem>
                ))}
              </CardSetEffectList>
            )}
          </CardSection>
        )}

        {/* Ark Passive */}
        {arkPassivePoints.length > 0 && (
          <ArkPassiveSection>
            <SectionTitle>
              아크 패시브
              {latestHistory?.arkPassiveTitle && (
                <ArkPassiveTitleBadge>
                  {latestHistory.arkPassiveTitle}
                </ArkPassiveTitleBadge>
              )}
            </SectionTitle>
            <ArkPassivePointsRow>
              {arkPassivePoints.map((point, idx) => {
                const categoryColor = ARK_PASSIVE_COLORS[point.name] ?? "#aaa";
                return (
                  <ArkPassivePointItem key={idx} $color={categoryColor}>
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
                      {effects.map((effect, idx) => (
                        <ArkPassiveEffectItem key={idx}>
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
          </ArkPassiveSection>
        )}

        {currentEffects.length > 0 && (
          <ArkgridSection>
            <SectionTitle>아크 그리드</SectionTitle>
            <ArkgridGrid>
              {currentEffects.map((effect, idx) => {
                const prev = prevEffectsMap.get(effect.effectName);
                const levelChanged =
                  prev && prev.effectLevel !== effect.effectLevel;
                const isNew = !prev && previousHistory != null;

                return (
                  <ArkgridItem key={idx} $changed={!!levelChanged || !!isNew}>
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
          </ArkgridSection>
        )}

        <ChangesSection>
          <SectionTitle>전일 대비 변화</SectionTitle>
          {changedDiffs.length > 0 ? (
            <ChangesList>
              {changedDiffs.map((diff, idx) => (
                <ChangeEntry key={`${diff.type}-${idx}`}>
                  <ChangeSlotName>{diff.type}</ChangeSlotName>
                  <ChangeDetail>
                    {diff.changes.join(", ")}
                  </ChangeDetail>
                </ChangeEntry>
              ))}
            </ChangesList>
          ) : (
            <NoChanges>전일 대비 변동 없음</NoChanges>
          )}
        </ChangesSection>

        {latestHistory && (
          <RecordDate>
            {latestHistory.recordDate} 기준
          </RecordDate>
        )}
      </BottomSection>
    </ProfileWrapper>
  );
};

export default CharacterProfileView;

/* ===== Styled Components ===== */

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at top, #1e1e3a 0%, #12121f 60%, #0a0a14 100%);
  border-radius: 16px;
  overflow: hidden;
  color: #e0e0e0;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 28px;
  background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%);
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CharacterNameLarge = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(120, 120, 255, 0.3);
`;

const CharacterMeta = styled.span`
  font-size: 13px;
  color: #8888aa;
`;

const HeaderStats = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const HeaderStatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  backdrop-filter: blur(4px);
`;

const HeaderStatLabel = styled.span`
  font-size: 11px;
  color: #8888aa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HeaderStatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
`;

const HeaderStatChange = styled.span<{ $isPositive: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ $isPositive }) => ($isPositive ? "#4ade80" : "#f87171")};
  text-shadow: ${({ $isPositive }) =>
    $isPositive ? "0 0 8px rgba(74, 222, 128, 0.4)" : "0 0 8px rgba(248, 113, 113, 0.4)"};
`;

const CloseButton = styled.button`
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #9999bb;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(4px);

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.12);
    transform: scale(1.05);
  }
`;

const EquipmentSection = styled.div`
  position: relative;
  display: flex;
  gap: 24px;
  padding: 20px 28px 24px;
  align-items: flex-start;
  overflow: hidden;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const CharacterBgImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 110%;
  opacity: 0.12;
  pointer-events: none;
  object-fit: contain;
  mask-image: radial-gradient(ellipse 70% 80% at center, #000 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 70% 80% at center, #000 30%, transparent 70%);
`;

const LeftEquipPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  position: relative;
  z-index: 1;
`;

const RightEquipPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  position: relative;
  z-index: 1;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 28px 24px;
`;

const SectionTitle = styled.h5`
  font-size: 12px;
  font-weight: 600;
  color: #6666aa;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const SlotList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EquipSlot = styled.div<{ $hasChange: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  background: ${({ $hasChange }) =>
    $hasChange
      ? "linear-gradient(135deg, rgba(202, 138, 4, 0.12) 0%, rgba(202, 138, 4, 0.04) 100%)"
      : "rgba(255, 255, 255, 0.02)"};
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $hasChange }) =>
      $hasChange
        ? "linear-gradient(135deg, rgba(202, 138, 4, 0.18) 0%, rgba(202, 138, 4, 0.06) 100%)"
        : "rgba(255, 255, 255, 0.05)"};
    transform: translateX(2px);
  }
`;

const EquipIcon = styled.div<{ $gradeColor: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #0e0e1a;
  box-shadow: 0 0 8px ${({ $gradeColor }) => $gradeColor}40,
    inset 0 0 0 1px ${({ $gradeColor }) => $gradeColor}60;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 0 14px ${({ $gradeColor }) => $gradeColor}60,
      inset 0 0 0 1px ${({ $gradeColor }) => $gradeColor}90;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

const EquipDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
`;

const EquipNameRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
`;

const EquipName = styled.span<{ $gradeColor: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $gradeColor }) => $gradeColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 0 8px ${({ $gradeColor }) => $gradeColor}30;
`;

const RefinementText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #ffcc00;
  text-shadow: 0 0 6px rgba(255, 204, 0, 0.3);
`;

const QualityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const QualityBar = styled.div`
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  max-width: 100px;
  overflow: hidden;
`;

const QualityFill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: linear-gradient(90deg, ${({ $color }) => $color}aa, ${({ $color }) => $color});
  border-radius: 3px;
  transition: width 0.3s;
  box-shadow: 0 0 6px ${({ $color }) => $color}40;
`;

const QualityValue = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  min-width: 24px;
`;

const EffectText = styled.span`
  font-size: 11px;
  color: #6666aa;
  line-height: 1.3;
  white-space: pre-wrap;
  word-break: break-word;
`;

const EffectLines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const EffectLine = styled.span<{ $color: string }>`
  font-size: 11px;
  color: ${({ $color }) => $color};
  line-height: 1.3;
`;

const ChangeIndicator = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #fbbf24;
  text-shadow: 0 0 6px rgba(251, 191, 36, 0.3);
`;

const EmptySlot = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  font-size: 12px;
  color: #444;
  border-radius: 10px;
`;

/* Header extras */

const CharacterTitle = styled.span`
  font-size: 12px;
  color: #7b68ee;
  font-weight: 600;
`;

const StatsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
  margin-top: 8px;
`;

const StatBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
`;

const StatBadgeLabel = styled.span`
  font-size: 11px;
  color: #7777aa;
`;

const StatBadgeValue = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #ccccee;
`;

/* Engravings */

const EngravingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

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

const GemSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

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

const CardSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

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

const ArkPassiveSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

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

const ArkgridSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

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
    $changed &&
    `box-shadow: 0 0 8px rgba(74, 222, 128, 0.1);`}

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
    $positive ? "0 0 6px rgba(74,222,128,0.5)" : "0 0 6px rgba(248,113,113,0.5)"};
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

/* Changes Summary */

const ChangesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

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
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.03) 100%);
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%);
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

const RecordDate = styled.span`
  font-size: 11px;
  color: #444;
  text-align: right;
`;
