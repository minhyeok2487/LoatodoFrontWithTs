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
  ProfileStat,
} from "@core/types/armory";
import {
  getGradeColor,
  extractQuality,
  isArmorType,
  isAccessoryType,
  isBraceletType,
  isStoneType,
  stripHtml,
} from "@core/utils/tooltipParser";

interface Props {
  data: ArmoryResponse;
}

const StatsTab: FC<Props> = ({ data }) => {
  const { ArmoryEquipment: equipment, ArmoryGem: gem, ArmoryCard: card, ArmoryProfile: profile, ArmoryEngraving: engraving, ArkPassive: arkPassive } = data;

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

  const cards: CardItem[] = card?.Cards || [];
  const cardEffects: CardEffectItem[] = useMemo(() => {
    if (!card?.Effects) return [];
    return card.Effects.flatMap((e) => e.Items);
  }, [card]);

  return (
    <Container>
      <LeftColumn>
        {/* 장비 */}
        {armorPieces.length > 0 && (
          <Section>
            <SectionTitle>장비</SectionTitle>
            <EquipmentGrid>
              {armorPieces.map((item, i) => (
                <EquipmentItem key={i} equipment={item} />
              ))}
            </EquipmentGrid>
          </Section>
        )}

        {/* 악세서리 */}
        {accessories.length > 0 && (
          <Section>
            <SectionTitle>악세서리</SectionTitle>
            <EquipmentGrid>
              {accessories.map((item, i) => (
                <EquipmentItem key={i} equipment={item} />
              ))}
            </EquipmentGrid>
          </Section>
        )}

        {/* 팔찌 & 어빌리티 스톤 */}
        {(bracelet.length > 0 || stone.length > 0) && (
          <Section>
            <Row>
              {bracelet.map((item, i) => (
                <HalfSection key={`b-${i}`}>
                  <SectionTitle>팔찌</SectionTitle>
                  <EquipmentItem equipment={item} />
                </HalfSection>
              ))}
              {stone.map((item, i) => (
                <HalfSection key={`s-${i}`}>
                  <SectionTitle>어빌리티 스톤</SectionTitle>
                  <EquipmentItem equipment={item} />
                </HalfSection>
              ))}
            </Row>
          </Section>
        )}

        {/* 보석 */}
        {gems.length > 0 && (
          <Section>
            <SectionTitle>보석</SectionTitle>
            <GemGrid>
              {gems
                .sort((a, b) => b.Level - a.Level)
                .map((g, i) => (
                  <GemItemCard key={i}>
                    <GemIcon
                      src={g.Icon}
                      alt={g.Name}
                      $gradeColor={getGradeColor(g.Grade)}
                    />
                    <GemLevel>{g.Level}</GemLevel>
                    <GemEffect>
                      {gemEffects.find((e) => e.GemSlot === g.Slot)?.Description?.[0]
                        ? stripHtml(
                            gemEffects.find((e) => e.GemSlot === g.Slot)!
                              .Description[0]
                          )
                        : ""}
                    </GemEffect>
                  </GemItemCard>
                ))}
            </GemGrid>
          </Section>
        )}

        {/* 카드 */}
        {cards.length > 0 && (
          <Section>
            <SectionTitle>카드</SectionTitle>
            <CardGrid>
              {cards.map((c, i) => (
                <CardItemCard key={i}>
                  <CardIcon
                    src={c.Icon}
                    alt={c.Name}
                    $gradeColor={getGradeColor(c.Grade)}
                  />
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
              <CardEffects>
                {cardEffects.map((e, i) => (
                  <CardEffectRow key={i}>
                    <CardEffectName>{e.Name}</CardEffectName>
                    <CardEffectDesc>{stripHtml(e.Description)}</CardEffectDesc>
                  </CardEffectRow>
                ))}
              </CardEffects>
            )}
          </Section>
        )}
      </LeftColumn>

      <RightColumn>
        {/* 전투력 */}
        {profile?.CombatPower && (
          <Section>
            <SectionTitle>전투력</SectionTitle>
            <CombatPowerValue>
              {Number(profile.CombatPower.replace(/,/g, "")).toLocaleString()}
            </CombatPowerValue>
          </Section>
        )}

        {/* 기본 특성 */}
        {basicStats.length > 0 && (
          <Section>
            <SectionTitle>기본 특성</SectionTitle>
            <StatList>
              {basicStats.map((s, i) => (
                <StatRow key={i}>
                  <StatLabel>{s.Type}</StatLabel>
                  <StatValue>
                    {parseInt(s.Value, 10).toLocaleString()}
                  </StatValue>
                </StatRow>
              ))}
            </StatList>
          </Section>
        )}

        {/* 전투 특성 */}
        {combatStats.length > 0 && (
          <Section>
            <SectionTitle>전투 특성</SectionTitle>
            <StatList>
              {combatStats.map((s, i) => (
                <StatRow key={i}>
                  <StatLabel>{s.Type}</StatLabel>
                  <StatValue>{parseInt(s.Value, 10).toLocaleString()}</StatValue>
                </StatRow>
              ))}
            </StatList>
          </Section>
        )}

        {/* 각인 */}
        {engravingEffects.length > 0 && (
          <Section>
            <SectionTitle>각인</SectionTitle>
            <EngravingList>
              {engravingEffects.map((e, i) => (
                <EngravingRow key={i}>
                  <EngravingDiamonds>
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Diamond key={j} $active={j < e.Level} $grade={e.Grade} />
                    ))}
                  </EngravingDiamonds>
                  <EngravingName $grade={e.Grade}>
                    {stripHtml(e.Name)}
                  </EngravingName>
                  <EngravingLevel>Lv.{e.Level}</EngravingLevel>
                </EngravingRow>
              ))}
            </EngravingList>
          </Section>
        )}

        {/* 아크패시브 요약 */}
        {arkPassive && arkPassive.IsArkPassive && (
          <Section>
            <SectionTitle>아크패시브</SectionTitle>
            <ArkPassiveSummary>
              {arkPassive.Points.map((p, i) => (
                <ArkPassivePointRow key={i}>
                  <ArkPassivePointName>{p.Name}</ArkPassivePointName>
                  <ArkPassivePointValue>{p.Value}</ArkPassivePointValue>
                </ArkPassivePointRow>
              ))}
            </ArkPassiveSummary>
          </Section>
        )}
      </RightColumn>
    </Container>
  );
};

export default StatsTab;

// ─── Equipment Sub-component ───
const EquipmentItem: FC<{ equipment: ArmoryEquipment }> = ({ equipment }) => {
  const quality = extractQuality(equipment.Tooltip);
  const gradeColor = getGradeColor(equipment.Grade);

  return (
    <EquipRow>
      <EquipIconWrapper $gradeColor={gradeColor}>
        <EquipIcon src={equipment.Icon} alt={equipment.Name} />
        {quality !== null && quality >= 0 && (
          <QualityBar>
            <QualityFill $quality={quality} />
            <QualityText>{quality}</QualityText>
          </QualityBar>
        )}
      </EquipIconWrapper>
      <EquipInfo>
        <EquipName $gradeColor={gradeColor}>
          {stripHtml(equipment.Name)}
        </EquipName>
        <EquipType>{equipment.Type}</EquipType>
      </EquipInfo>
    </EquipRow>
  );
};

// ─── Styled Components ───
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
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
  border-radius: 12px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  margin-bottom: 12px;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;

  ${({ theme }) => theme.medias.max768} {
    flex-direction: column;
  }
`;

const HalfSection = styled.div`
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

// ─── Equipment Styles ───
const EquipmentGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EquipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EquipIconWrapper = styled.div<{ $gradeColor: string }>`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 8px;
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
  height: 6px;
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

const QualityText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8px;
  font-weight: 700;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
`;

const EquipInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const EquipName = styled.span<{ $gradeColor: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $gradeColor }) => $gradeColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EquipType = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
`;

// ─── Gem Styles ───
const GemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 8px;
`;

const GemItemCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const GemIcon = styled.img<{ $gradeColor: string }>`
  width: 44px;
  height: 44px;
  border-radius: 6px;
  border: 2px solid ${({ $gradeColor }) => $gradeColor};
  background: #1a1a2e;
`;

const GemLevel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const GemEffect = styled.span`
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
  width: 64px;
`;

const CardIcon = styled.img<{ $gradeColor: string }>`
  width: 56px;
  height: 72px;
  border-radius: 4px;
  border: 2px solid ${({ $gradeColor }) => $gradeColor};
  object-fit: cover;
  background: #1a1a2e;
`;

const CardAwake = styled.div`
  display: flex;
  gap: 2px;
`;

const AwakeDot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
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
  margin-top: 12px;
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

// ─── Stats Styles ───
const CombatPowerValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #F59E0B;
`;

const StatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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

const EngravingDiamonds = styled.div`
  display: flex;
  gap: 2px;
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

const Diamond = styled.div<{ $active: boolean; $grade: string }>`
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  background: ${({ $active, $grade }) =>
    $active ? getEngravingColor($grade) : "#444"};
`;

const EngravingName = styled.span<{ $grade: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $grade }) => getEngravingColor($grade)};
  flex: 1;
`;

const EngravingLevel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

// ─── Ark Passive Styles ───
const ArkPassiveSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ArkPassivePointRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ArkPassivePointName = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const ArkPassivePointValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;
