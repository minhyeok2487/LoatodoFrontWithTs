import { useMemo, type FC } from "react";
import styled from "styled-components";

import type {
  ArmoryEquipment,
  ArmoryResponse,
  ArkPassiveEngravingEffect,
  GemItem,
  GemSkillEffect,
  CardItem,
  CardEffectItem,
} from "@core/types/armory";
import {
  getGradeColor,
  extractQuality,
  isArmorType,
  isAccessoryType,
  isBraceletType,
  isStoneType,
  isJewelType,
  stripHtml,
  extractGemSummary,
  extractEnhanceLevel,
  extractAccessoryEffects,
  extractStoneEngravings,
  extractBraceletEffects,
} from "@core/utils/tooltipParser";

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

const StatsTab: FC<Props> = ({ data }) => {
  const {
    ArmoryEquipment: equipment,
    ArmoryGem: gem,
    ArmoryCard: card,
    ArmoryProfile: profile,
    ArmoryEngraving: engraving,
    ArkPassive: arkPassive,
  } = data;

  const armorPieces = useMemo(
    () => (equipment || []).filter((e) => isArmorType(e.Type)),
    [equipment]
  );
  const accessories = useMemo(
    () => (equipment || []).filter((e) => isAccessoryType(e.Type)),
    [equipment]
  );
  const bracelet = useMemo(
    () => (equipment || []).filter((e) => isBraceletType(e.Type)),
    [equipment]
  );
  const stone = useMemo(
    () => (equipment || []).filter((e) => isStoneType(e.Type)),
    [equipment]
  );
  const jewel = useMemo(
    () => (equipment || []).filter((e) => isJewelType(e.Type)),
    [equipment]
  );

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

  const gems: GemItem[] = gem?.Gems || [];
  const gemEffects: GemSkillEffect[] = gem?.Effects?.Skills || [];

  const gemSummary = useMemo(
    () => (gems.length > 0 ? extractGemSummary(gems) : ""),
    [gems]
  );

  const cards: CardItem[] = card?.Cards || [];
  const cardEffects: CardEffectItem[] = useMemo(() => {
    if (!card?.Effects) return [];
    return card.Effects.flatMap((e) => e.Items);
  }, [card]);

  const engravingLevelSummary = useMemo(() => {
    if (engravingEffects.length === 0) return "";
    return engravingEffects.map((e) => e.Level).join(" ");
  }, [engravingEffects]);

  return (
    <Container>
      <LeftColumn>
        {/* 장비 섹션 */}
        {(armorPieces.length > 0 ||
          accessories.length > 0 ||
          bracelet.length > 0 ||
          stone.length > 0) && (
          <Section>
            <SectionTitle>장비</SectionTitle>
            <Divider />

            {armorPieces.length > 0 && (
              <EquipList>
                {armorPieces.map((item, i) => (
                  <ArmorRow key={i} equipment={item} />
                ))}
              </EquipList>
            )}

            {accessories.length > 0 && (
              <>
                <Divider />
                <EquipList>
                  {accessories.map((item, i) => (
                    <AccessoryRow key={i} equipment={item} />
                  ))}
                </EquipList>
              </>
            )}

            {bracelet.length > 0 && (
              <>
                <Divider />
                <EquipList>
                  {bracelet.map((item, i) => (
                    <BraceletRow key={i} equipment={item} />
                  ))}
                </EquipList>
              </>
            )}

            {stone.length > 0 && (
              <>
                <Divider />
                <EquipList>
                  {stone.map((item, i) => (
                    <StoneRow key={i} equipment={item} />
                  ))}
                </EquipList>
              </>
            )}

            {jewel.length > 0 && (
              <>
                <Divider />
                <EquipList>
                  {jewel.map((item, i) => (
                    <JewelRow key={i} equipment={item} />
                  ))}
                </EquipList>
              </>
            )}
          </Section>
        )}

        {/* 보석 */}
        {gems.length > 0 && (
          <Section>
            <SectionTitleRow>
              <SectionTitle>보석</SectionTitle>
              {gemSummary && <SectionBadge>{gemSummary}</SectionBadge>}
            </SectionTitleRow>
            <Divider />
            <GemGrid>
              {gems
                .sort((a, b) => b.Level - a.Level)
                .map((g, i) => {
                  const effect = gemEffects.find((e) => e.GemSlot === g.Slot);
                  return (
                    <GemItemCard key={i}>
                      <GemIconWrapper $gradeColor={getGradeColor(g.Grade)}>
                        <GemIcon src={g.Icon} alt={g.Name} />
                        <GemLevelBadge>{g.Level}</GemLevelBadge>
                      </GemIconWrapper>
                      <GemName>
                        {effect ? effect.Name : stripHtml(g.Name)}
                      </GemName>
                    </GemItemCard>
                  );
                })}
            </GemGrid>
          </Section>
        )}

        {/* 카드 */}
        {cards.length > 0 && (
          <Section>
            <SectionTitle>카드</SectionTitle>
            <Divider />
            <CardGrid>
              {cards.map((c, i) => (
                <CardItemCard key={i}>
                  <CardIconWrapper $gradeColor={getGradeColor(c.Grade)}>
                    <CardIcon src={c.Icon} alt={c.Name} />
                  </CardIconWrapper>
                  <CardAwake>
                    {Array.from({ length: c.AwakeTotal }).map((_, j) => (
                      <AwakeDot key={j} $active={j < c.AwakeCount} />
                    ))}
                  </CardAwake>
                  <CardName>{c.Name}</CardName>
                </CardItemCard>
              ))}
            </CardGrid>
            {cardEffects.length > 0 && (
              <>
                <Divider />
                <CardEffects>
                  {cardEffects.map((e, i) => (
                    <CardEffectRow key={i}>
                      <CardEffectName>{e.Name}</CardEffectName>
                      <CardEffectDesc>
                        {stripHtml(e.Description)}
                      </CardEffectDesc>
                    </CardEffectRow>
                  ))}
                </CardEffects>
              </>
            )}
          </Section>
        )}
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

// ─── Sub-components ───

const ArmorRow: FC<{ equipment: ArmoryEquipment }> = ({ equipment }) => {
  const quality = extractQuality(equipment.Tooltip);
  const gradeColor = getGradeColor(equipment.Grade);
  const enhance = extractEnhanceLevel(equipment.Name);

  return (
    <EquipRowWrapper>
      <EquipIconWrapper $gradeColor={gradeColor}>
        <EquipIcon src={equipment.Icon} alt={equipment.Name} />
        {quality !== null && quality >= 0 && (
          <QualityBar>
            <QualityFill $quality={quality} />
          </QualityBar>
        )}
      </EquipIconWrapper>
      <EquipInfo>
        <EquipNameRow>
          <EquipType>{equipment.Type}</EquipType>
          {enhance !== null && <EnhanceLevel>+{enhance}</EnhanceLevel>}
          <EquipName $gradeColor={gradeColor}>
            {stripHtml(equipment.Name)}
          </EquipName>
        </EquipNameRow>
      </EquipInfo>
      {quality !== null && quality >= 0 && (
        <QualityNumber $quality={quality}>{quality}</QualityNumber>
      )}
    </EquipRowWrapper>
  );
};

const AccessoryRow: FC<{ equipment: ArmoryEquipment }> = ({ equipment }) => {
  const quality = extractQuality(equipment.Tooltip);
  const gradeColor = getGradeColor(equipment.Grade);
  const enhance = extractEnhanceLevel(equipment.Name);
  const effects = extractAccessoryEffects(equipment.Tooltip);

  return (
    <EquipRowWrapper>
      <EquipIconWrapper $gradeColor={gradeColor}>
        <EquipIcon src={equipment.Icon} alt={equipment.Name} />
        {quality !== null && quality >= 0 && (
          <QualityBar>
            <QualityFill $quality={quality} />
          </QualityBar>
        )}
      </EquipIconWrapper>
      <EquipInfo>
        <EquipNameRow>
          <GradeBadge $gradeColor={gradeColor}>{equipment.Grade}</GradeBadge>
          <EquipType>{equipment.Type}</EquipType>
          {quality !== null && (
            <QualityNumber $quality={quality}>{quality}</QualityNumber>
          )}
          {enhance !== null && <EnhanceLevel>+{enhance}</EnhanceLevel>}
        </EquipNameRow>
        {effects.length > 0 && (
          <EffectRow>
            {effects.map((eff, i) => (
              <EffectBadge key={i} $grade={eff.grade}>
                {eff.grade === "상" || eff.grade === "최상" ? "▲" : "▼"}{" "}
                {eff.grade} {eff.name}
              </EffectBadge>
            ))}
          </EffectRow>
        )}
      </EquipInfo>
    </EquipRowWrapper>
  );
};

const BraceletRow: FC<{ equipment: ArmoryEquipment }> = ({ equipment }) => {
  const gradeColor = getGradeColor(equipment.Grade);
  const enhance = extractEnhanceLevel(equipment.Name);
  const effects = extractBraceletEffects(equipment.Tooltip);

  return (
    <EquipRowWrapper>
      <EquipIconWrapper $gradeColor={gradeColor}>
        <EquipIcon src={equipment.Icon} alt={equipment.Name} />
      </EquipIconWrapper>
      <EquipInfo>
        <EquipNameRow>
          <GradeBadge $gradeColor={gradeColor}>{equipment.Grade}</GradeBadge>
          <EquipType>팔찌</EquipType>
          {enhance !== null && <EnhanceLevel>+{enhance}</EnhanceLevel>}
        </EquipNameRow>
        {effects.length > 0 && (
          <EffectRow>
            {effects.map((eff, i) => (
              <EffectBadge key={i} $grade={eff.grade}>
                {eff.grade === "상" || eff.grade === "최상" ? "▲" : "▼"}{" "}
                {eff.grade} {eff.name}
              </EffectBadge>
            ))}
          </EffectRow>
        )}
      </EquipInfo>
    </EquipRowWrapper>
  );
};

const StoneRow: FC<{ equipment: ArmoryEquipment }> = ({ equipment }) => {
  const gradeColor = getGradeColor(equipment.Grade);
  const engravings = extractStoneEngravings(equipment.Tooltip);

  return (
    <EquipRowWrapper>
      <EquipIconWrapper $gradeColor={gradeColor}>
        <EquipIcon src={equipment.Icon} alt={equipment.Name} />
      </EquipIconWrapper>
      <EquipInfo>
        <EquipNameRow>
          <GradeBadge $gradeColor={gradeColor}>{equipment.Grade}</GradeBadge>
          <EquipType>어빌리티 스톤</EquipType>
        </EquipNameRow>
        {engravings.length > 0 && (
          <EffectRow>
            {engravings.map((eng, i) => (
              <StoneEngraving key={i} $isNegative={eng.isNegative}>
                Lv.{eng.level} {eng.name}
              </StoneEngraving>
            ))}
          </EffectRow>
        )}
      </EquipInfo>
    </EquipRowWrapper>
  );
};

const JewelRow: FC<{ equipment: ArmoryEquipment }> = ({ equipment }) => {
  const gradeColor = getGradeColor(equipment.Grade);

  return (
    <EquipRowWrapper>
      <EquipIconWrapper $gradeColor={gradeColor}>
        <EquipIcon src={equipment.Icon} alt={equipment.Name} />
      </EquipIconWrapper>
      <EquipInfo>
        <EquipNameRow>
          <EquipType>보주</EquipType>
          <EquipName $gradeColor={gradeColor}>
            {stripHtml(equipment.Name)}
          </EquipName>
        </EquipNameRow>
      </EquipInfo>
    </EquipRowWrapper>
  );
};

const getCategoryColor = (name: string): string => {
  if (name.includes("진화")) return "#22C55E";
  if (name.includes("깨달음")) return "#3B82F6";
  if (name.includes("도약")) return "#A855F7";
  return "#959595";
};

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

const SectionBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light2};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  margin: 10px 0;
`;

// ─── Equipment Styles ───

const EquipList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const EquipRowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EquipIconWrapper = styled.div<{ $gradeColor: string }>`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 6px;
  border: 2px solid ${({ $gradeColor }) => $gradeColor};
  overflow: hidden;
  flex-shrink: 0;
  background: #1a1a2e;
`;

const EquipIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const QualityBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #333;
`;

const QualityFill = styled.div<{ $quality: number }>`
  height: 100%;
  width: ${({ $quality }) => $quality}%;
  background: ${({ $quality }) => {
    if ($quality === 100) return "#F59E0B";
    if ($quality >= 90) return "#A855F7";
    if ($quality >= 70) return "#3B82F6";
    if ($quality >= 30) return "#22C55E";
    return "#EF4444";
  }};
`;

const EquipInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
`;

const EquipNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const EquipType = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
  white-space: nowrap;
`;

const EquipName = styled.span<{ $gradeColor: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $gradeColor }) => $gradeColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EnhanceLevel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #f59e0b;
`;

const GradeBadge = styled.span<{ $gradeColor: string }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $gradeColor }) => $gradeColor};
`;

const QualityNumber = styled.span<{ $quality: number }>`
  font-size: 12px;
  font-weight: 700;
  color: ${({ $quality }) => {
    if ($quality === 100) return "#F59E0B";
    if ($quality >= 90) return "#A855F7";
    if ($quality >= 70) return "#3B82F6";
    if ($quality >= 30) return "#22C55E";
    return "#EF4444";
  }};
  flex-shrink: 0;
`;

const EffectRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const EffectBadge = styled.span<{ $grade: string }>`
  font-size: 11px;
  color: ${({ $grade }) =>
    $grade === "상" || $grade === "최상" ? "#22C55E" : "#EF4444"};
`;

const StoneEngraving = styled.span<{ $isNegative: boolean }>`
  font-size: 11px;
  color: ${({ $isNegative }) => ($isNegative ? "#EF4444" : "#3B82F6")};
`;

// ─── Gem Styles ───

const GemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  gap: 8px;
`;

const GemItemCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;

const GemIconWrapper = styled.div<{ $gradeColor: string }>`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 6px;
  border: 2px solid ${({ $gradeColor }) => $gradeColor};
  overflow: hidden;
  background: #1a1a2e;
`;

const GemIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const GemLevelBadge = styled.span`
  position: absolute;
  bottom: 1px;
  right: 1px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 0 3px;
  border-radius: 3px;
`;

const GemName = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.app.text.light2};
  text-align: center;
  word-break: keep-all;
  line-height: 1.2;
`;

// ─── Card Styles ───

const CardGrid = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const CardItemCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 60px;
`;

const CardIconWrapper = styled.div<{ $gradeColor: string }>`
  width: 52px;
  height: 68px;
  border-radius: 4px;
  border: 2px solid ${({ $gradeColor }) => $gradeColor};
  overflow: hidden;
  background: #1a1a2e;
`;

const CardIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardAwake = styled.div`
  display: flex;
  gap: 2px;
`;

const AwakeDot = styled.div<{ $active: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#F59E0B" : "#555")};
`;

const CardName = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.app.text.dark1};
  text-align: center;
  word-break: keep-all;
  line-height: 1.2;
`;

const CardEffects = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardEffectRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const CardEffectName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  white-space: nowrap;
`;

const CardEffectDesc = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

// ─── Right Column Styles ───

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

// ─── Combat Stat Styles ───

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

// ─── Engraving Styles ───

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

// ─── Ark Passive Styles ───

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
