import { useMemo, useState, type FC } from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";

import type {
  ArmoryResponse,
  ArmoryArkPassive,
  ArkPassiveEngravingEffect,
  ArkPassiveEffect,
  ArmorySkill,
} from "@core/types/armory";
import {
  stripHtml,
  getGradeColor,
  parseTooltip,
} from "@core/utils/tooltipParser";

import { ENGRAVING_ICONS } from "@core/constants/engravingIcons";

import EquipmentSection from "./stats/EquipmentSection";
import GemSection from "./stats/GemSection";
import CardSection from "./stats/CardSection";
import {
  parseEffectDescription,
  CATEGORY_COLORS,
  CATEGORY_ORDER,
} from "./ArkPassiveTab";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip);

const COMBAT_STAT_NAMES = ["치명", "특화", "제압", "신속", "인내", "숙련"];

interface Props {
  data: ArmoryResponse;
}

const parseRankLevel = (tooltip: string): string => {
  // Tooltip is a JSON string with Element_xxx structure
  const parsed = parseTooltip(tooltip);
  if (parsed) {
    // Walk all elements, collect text, search for rank/level pattern
    const texts: string[] = [];
    const collectText = (val: unknown): void => {
      if (typeof val === "string") {
        texts.push(stripHtml(val));
      } else if (typeof val === "object" && val !== null) {
        Object.values(val).forEach(collectText);
      }
    };
    Object.values(parsed).forEach((el) => collectText(el));
    const combined = texts.join(" ");
    const match = combined.match(/(\d+)\s*랭크\s*(\d+)\s*레벨/);
    if (match) return `${match[1]}랭크 ${match[2]}레벨`;
  }
  // Fallback: try plain text
  const text = stripHtml(tooltip);
  const match = text.match(/(\d+)\s*랭크\s*(\d+)\s*레벨/);
  if (match) return `${match[1]}랭크 ${match[2]}레벨`;
  return "";
};

/** HTML 색상 태그를 inline style span으로 변환 */
const fontToSpan = (html: string): string =>
  html
    .replace(/<\/?textformat[^>]*>/gi, "")
    .replace(/<font\s+color='([^']+)'>(.*?)<\/font>/gi, '<span style="color:$1">$2</span>')
    .replace(/<\/?font[^>]*>/gi, "")
    .trim();

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

const ArkPassiveSection: FC<{
  arkPassive: ArmoryArkPassive;
  groupedEffects: { name: string; effects: ArkPassiveEffect[] }[];
}> = ({ arkPassive, groupedEffects }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Section>
      <ArkHeaderRow onClick={() => setExpanded((v) => !v)}>
        <SectionTitle>아크 패시브 포인트</SectionTitle>
        <ArkChevron $expanded={expanded}>›</ArkChevron>
      </ArkHeaderRow>
      <ArkPointsRow>
        {arkPassive.Points.map((p, i) => {
          const colors = CATEGORY_COLORS[p.Name] || {
            main: "#959595",
            bg: "rgba(149, 149, 149, 0.08)",
          };
          return (
            <ArkPointItem key={i}>
              <ArkCategoryBadge $color={colors.main}>
                {p.Name}
              </ArkCategoryBadge>
              <ArkPointValue>{p.Value}</ArkPointValue>
            </ArkPointItem>
          );
        })}
      </ArkPointsRow>

      <ArkCollapsible $expanded={expanded}>
        <ArkCollapsibleInner>
          {groupedEffects.map((group) => {
            const colors = CATEGORY_COLORS[group.name] || {
              main: "#959595",
              bg: "rgba(149, 149, 149, 0.08)",
            };
            return (
              <ArkGroupSection key={group.name}>
                <ArkGroupHeader $color={colors.main} $bg={colors.bg}>
                  {group.name} ({group.effects.length})
                </ArkGroupHeader>
                <ArkEffectList>
                  {group.effects.map((effect, i) => {
                    const parsed = parseEffectDescription(effect.Description);
                    return (
                      <ArkEffectItem key={i}>
                        {effect.Icon && (
                          <ArkEffectIcon
                            src={effect.Icon}
                            alt={parsed?.skillName}
                          />
                        )}
                        <ArkEffectInfo>
                          {parsed?.tier && (
                            <ArkTierBadge $color={colors.main}>
                              T{parsed.tier.replace("티어", "")}
                            </ArkTierBadge>
                          )}
                          {parsed?.level && (
                            <ArkLevelText>Lv.{parsed.level}</ArkLevelText>
                          )}
                          <ArkEffectName>
                            {parsed?.skillName ||
                              stripHtml(effect.Description || "")}
                          </ArkEffectName>
                        </ArkEffectInfo>
                      </ArkEffectItem>
                    );
                  })}
                </ArkEffectList>
              </ArkGroupSection>
            );
          })}
        </ArkCollapsibleInner>
      </ArkCollapsible>
    </Section>
  );
};

const OverviewTab: FC<Props> = ({ data }) => {
  const {
    ArmoryEquipment: equipment,
    ArmoryGem: gem,
    ArmoryCard: card,
    ArmoryProfile: profile,
    ArmoryEngraving: engraving,
    ArkPassive: arkPassive,
    ArmorySkills: skills,
  } = data;

  const allStats = useMemo(() => {
    if (!profile?.Stats) return [];
    const order = [
      "공격력",
      "최대 생명력",
      "치명",
      "특화",
      "제압",
      "신속",
      "인내",
      "숙련",
    ];
    return order
      .map((type) => profile.Stats.find((s) => s.Type === type))
      .filter(Boolean) as { Type: string; Value: string; Tooltip: string[] }[];
  }, [profile]);

  const heroStats = useMemo(
    () => allStats.filter((s) => s.Type === "공격력" || s.Type === "최대 생명력"),
    [allStats]
  );

  const combatStats = useMemo(
    () => allStats.filter((s) => COMBAT_STAT_NAMES.includes(s.Type)),
    [allStats]
  );

  const mainStatBadge = useMemo(() => {
    if (combatStats.length === 0) return "";
    const sorted = [...combatStats].sort(
      (a, b) => parseInt(b.Value, 10) - parseInt(a.Value, 10)
    );
    return sorted.slice(0, 2).map((s) => s.Type).join("/");
  }, [combatStats]);

  const radarData = useMemo(() => {
    const values = COMBAT_STAT_NAMES.map((name) => {
      const stat = combatStats.find((s) => s.Type === name);
      return stat ? parseInt(stat.Value, 10) : 0;
    });
    return {
      labels: COMBAT_STAT_NAMES,
      datasets: [
        {
          data: values,
          backgroundColor: "rgba(59, 130, 246, 0.15)",
          borderColor: "rgba(59, 130, 246, 0.7)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(59, 130, 246, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 1,
          pointRadius: 3,
          fill: true,
        },
      ],
    };
  }, [combatStats]);

  const radarOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          display: false,
        },
        pointLabels: {
          font: {
            family: "Pretendard",
            size: 12,
            weight: 600 as const,
          },
          color: "#888",
        },
        grid: {
          color: "rgba(150, 150, 150, 0.15)",
        },
        angleLines: {
          color: "rgba(150, 150, 150, 0.15)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(20, 20, 30, 0.95)",
        titleFont: { family: "Pretendard", size: 13 },
        bodyFont: { family: "Pretendard", size: 12 },
        callbacks: {
          label: (ctx: any) => ` ${ctx.parsed.r.toLocaleString()}`,
        },
      },
    },
  }), []);

  const engravingEffects: ArkPassiveEngravingEffect[] =
    engraving?.ArkPassiveEffects || [];


  const groupedEffects = useMemo(() => {
    if (!arkPassive?.Effects || arkPassive.Effects.length === 0) return [];

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
  }, [arkPassive]);

  const activeSkills = useMemo(() => {
    if (!skills) return [];
    return skills.filter(
      (s) =>
        !s.IsAwakening &&
        (s.Level > 1 || s.Tripods.some((t) => t.IsSelected) || s.Rune)
    );
  }, [skills]);

  return (
    <Container>
      <LeftColumn>
        {/* 프로필 */}
        {profile && (
          <ProfileCard>
            {profile.CharacterImage && (
              <ProfileBgImage
                src={profile.CharacterImage}
                alt={profile.CharacterName}
              />
            )}
            <ProfileOverlay />
            <ProfileBadgeRow>
              <ProfileBadge>{profile.ServerName}</ProfileBadge>
              <ProfileBadge>{profile.CharacterClassName}</ProfileBadge>
            </ProfileBadgeRow>
            <ProfileBottomInfo>
              <ProfileCharName>{profile.CharacterName}</ProfileCharName>
              {profile.Title && (
                <ProfileTitle>{profile.Title}</ProfileTitle>
              )}
              <ProfilePills>
                <ProfilePill>아이템 {profile.ItemAvgLevel}</ProfilePill>
                {profile.CombatPower && (
                  <ProfilePill>
                    전투력{" "}
                    {Number(
                      profile.CombatPower.replace(/,/g, "")
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </ProfilePill>
                )}
              </ProfilePills>
              <ProfileDivider />
              <ProfileInfoRow>
                <ProfileInfoLabel>캐릭터 레벨</ProfileInfoLabel>
                <ProfileInfoValue>Lv.{profile.CharacterLevel}</ProfileInfoValue>
              </ProfileInfoRow>
              <ProfileInfoRow>
                <ProfileInfoLabel>원정대 레벨</ProfileInfoLabel>
                <ProfileInfoValue>
                  Lv.{profile.ExpeditionLevel}
                </ProfileInfoValue>
              </ProfileInfoRow>
              {profile.TownName && (
                <ProfileInfoRow>
                  <ProfileInfoLabel>영지</ProfileInfoLabel>
                  <ProfileInfoValue>
                    {profile.TownName} Lv.{profile.TownLevel}
                  </ProfileInfoValue>
                </ProfileInfoRow>
              )}
              {profile.GuildName && (
                <ProfileInfoRow>
                  <ProfileInfoLabel>길드</ProfileInfoLabel>
                  <ProfileInfoValue>{profile.GuildName}</ProfileInfoValue>
                </ProfileInfoRow>
              )}
              {profile.PvpGradeName && (
                <ProfileInfoRow>
                  <ProfileInfoLabel>PVP</ProfileInfoLabel>
                  <ProfileInfoValue>{profile.PvpGradeName}</ProfileInfoValue>
                </ProfileInfoRow>
              )}
            </ProfileBottomInfo>
          </ProfileCard>
        )}

        {/* 아크 패시브 */}
        {arkPassive && arkPassive.IsArkPassive && (
          <ArkPassiveSection
            groupedEffects={groupedEffects}
            arkPassive={arkPassive}
          />
        )}

        {/* 각인 */}
        {engravingEffects.length > 0 && (
          <Section>
            <SectionTitleRow>
              <SectionTitle>각인</SectionTitle>
              <EngravingLevelBadges>
                {engravingEffects.map((e, i) => (
                  <EngravingLevelBadge
                    key={i}
                    $color={getEngravingColor(e.Grade)}
                    $isFull={e.Level >= 4}
                  >
                    {e.Level}
                  </EngravingLevelBadge>
                ))}
              </EngravingLevelBadges>
            </SectionTitleRow>
            <Divider />
            <EngravingList>
              {engravingEffects.map((e, i) => {
                const name = stripHtml(e.Name);
                const maxLevel = 4;
                const isFull = e.Level >= maxLevel;
                return (
                  <EngravingRowWrap key={i}>
                    <EngravingRow $isFull={isFull}>
                      {ENGRAVING_ICONS[name] && (
                        <EngravingIcon src={ENGRAVING_ICONS[name]} alt={name} />
                      )}
                      <EngravingName>{name}</EngravingName>
                      <EngravingRight>
                        {e.AbilityStoneLevel !== null &&
                          e.AbilityStoneLevel > 0 && (
                            <StoneBadge>
                              <StoneIcon>◆</StoneIcon>
                              <span>X {e.AbilityStoneLevel}</span>
                            </StoneBadge>
                          )}
                        <EngravingDots>
                          {Array.from({ length: maxLevel }, (_, di) => (
                            <EngravingDot
                              key={di}
                              $filled={di < e.Level}
                              $color={getEngravingColor(e.Grade)}
                            />
                          ))}
                        </EngravingDots>
                      </EngravingRight>
                    </EngravingRow>
                    {e.Description && (
                      <EngravingTooltip>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: fontToSpan(e.Description),
                          }}
                        />
                      </EngravingTooltip>
                    )}
                  </EngravingRowWrap>
                );
              })}
            </EngravingList>
          </Section>
        )}

        {/* 전투 스탯 */}
        {allStats.length > 0 && (
          <Section>
            <SectionTitleRow>
              <SectionTitle>전투 스탯</SectionTitle>
              {mainStatBadge && (
                <MainStatBadge>{mainStatBadge}</MainStatBadge>
              )}
            </SectionTitleRow>
            <Divider />

            {/* 공격력 / 최대 생명력 카드 */}
            {heroStats.length > 0 && (
              <StatHeroRow>
                {heroStats.map((s, i) => (
                  <StatHeroCard key={i}>
                    <StatHeroLabel>{s.Type}</StatHeroLabel>
                    <StatHeroValue>
                      {parseInt(s.Value, 10).toLocaleString()}
                    </StatHeroValue>
                    {s.Tooltip && s.Tooltip.length > 0 && (
                      <StatTooltip>
                        {s.Tooltip.map((line, li) => {
                          const cleaned = fontToSpan(line);
                          return cleaned ? (
                            <StatTooltipLine
                              key={li}
                              dangerouslySetInnerHTML={{ __html: cleaned }}
                            />
                          ) : null;
                        })}
                      </StatTooltip>
                    )}
                  </StatHeroCard>
                ))}
              </StatHeroRow>
            )}

            {/* 레이더 차트 */}
            {combatStats.length > 0 && (
              <RadarChartWrap>
                <Radar data={radarData} options={radarOptions} />
              </RadarChartWrap>
            )}

            {/* 6대 스탯 수치 목록 */}
            <StatGrid>
              {combatStats.map((s, i) => (
                <StatItemWrap key={i}>
                  <StatItem>
                    <StatLabel>{s.Type}</StatLabel>
                    <StatValue>
                      {parseInt(s.Value, 10).toLocaleString()}
                    </StatValue>
                  </StatItem>
                  {s.Tooltip && s.Tooltip.length > 0 && (
                    <StatTooltip>
                      {s.Tooltip.map((line, li) => {
                        const cleaned = fontToSpan(line);
                        return cleaned ? (
                          <StatTooltipLine
                            key={li}
                            dangerouslySetInnerHTML={{ __html: cleaned }}
                          />
                        ) : null;
                      })}
                    </StatTooltip>
                  )}
                </StatItemWrap>
              ))}
            </StatGrid>
          </Section>
        )}
      </LeftColumn>

      <RightColumn>
        <GemSection gem={gem} />
        <EquipmentSection equipment={equipment} />

        {/* 스킬 (컴팩트) */}
        {activeSkills.length > 0 && (
          <Section>
            <SectionTitle>스킬</SectionTitle>
            <Divider />
            <CompactSkillGrid>
              {activeSkills.map((skill, i) => (
                <CompactSkillRow key={i}>
                  <CompactSkillIcon src={skill.Icon} alt={skill.Name} />
                  <CompactSkillInfo>
                    <CompactSkillName>{skill.Name}</CompactSkillName>
                    <CompactSkillSub>
                      Lv.{skill.Level}
                      {skill.Rune && ` ${skill.Rune.Name}`}
                    </CompactSkillSub>
                  </CompactSkillInfo>
                </CompactSkillRow>
              ))}
            </CompactSkillGrid>
          </Section>
        )}

        <CardSection card={card} />
      </RightColumn>
    </Container>
  );
};

export default OverviewTab;

// ─── Styled Components ───

// ─── Profile ───

const ProfileCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 9 / 16;
`;

const ProfileBgImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
`;

const ProfileOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 40%,
    rgba(0, 0, 0, 0.85) 75%
  );
`;

const ProfileBadgeRow = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
  z-index: 1;
`;

const ProfileBadge = styled.span`
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ProfileBottomInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 6px;
`;

const ProfileCharName = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
`;

const ProfileTitle = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const ProfilePills = styled.div`
  display: flex;
  gap: 6px;
`;

const ProfileDivider = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin: 4px 0;
`;

const ProfilePill = styled.span`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

const ProfileInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);

  &:last-child {
    border-bottom: none;
  }
`;

const ProfileInfoLabel = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const ProfileInfoValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
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

// ─── Ark Passive ───

const ArkCollapsible = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $expanded }) => ($expanded ? "1fr" : "0fr")};
  transition: grid-template-rows 0.3s ease;
`;

const ArkCollapsibleInner = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ArkHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 10px;
`;

const ArkChevron = styled.span<{ $expanded: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.light2};
  transition: transform 0.3s ease;
  transform: rotate(${({ $expanded }) => ($expanded ? "90deg" : "0deg")});
  user-select: none;
`;

const ArkPointsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const ArkPointItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ArkCategoryBadge = styled.span<{ $color: string }>`
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid ${({ $color }) => $color}66;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => $color}0D;
`;

const ArkPointValue = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const ArkGroupSection = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.app.border};
  margin-top: 8px;
`;

const ArkGroupHeader = styled.div<{ $color: string; $bg: string }>`
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;

const ArkEffectList = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.app.bg.white};
`;

const ArkEffectItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ArkEffectIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #1a1a2e;
  flex-shrink: 0;
`;

const ArkEffectInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const ArkTierBadge = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  background: ${({ $color }) => $color}1A;
  color: ${({ $color }) => $color};
`;

const ArkLevelText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light2};
`;

const ArkEffectName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

// ─── Engravings ───

const EngravingLevelBadges = styled.div`
  display: flex;
  gap: 4px;
`;

const EngravingLevelBadge = styled.span<{
  $color: string;
  $isFull: boolean;
}>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  color: #fff;
  background: ${({ $isFull, $color }) =>
    $isFull
      ? `linear-gradient(
          150deg,
          rgba(255, 255, 255, 0.45) 0%,
          ${$color} 25%,
          ${$color}BB 65%,
          ${$color}55 100%
        )`
      : `linear-gradient(
          150deg,
          rgba(255, 255, 255, 0.2) 0%,
          #555 25%,
          #3a3a44 65%,
          #252530 100%
        )`};
  filter: drop-shadow(
    0 1px 3px
      ${({ $isFull, $color }) => ($isFull ? `${$color}99` : "rgba(0,0,0,0.4)")}
  );
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
`;

const EngravingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const EngravingIcon = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const EngravingRowWrap = styled.div`
  position: relative;

  &:hover > div:last-child {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const EngravingTooltip = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  z-index: 10;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(20, 20, 30, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  font-size: 12px;
  line-height: 1.6;
  color: #ddd;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.15s ease;
  pointer-events: none;

  font {
    font-weight: 600;
  }
`;

const EngravingRow = styled.div<{ $isFull: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  background: ${({ $isFull }) =>
    $isFull ? "rgba(220, 106, 44, 0.12)" : "transparent"};
`;

const EngravingName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EngravingRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const StoneBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light2};
`;

const StoneIcon = styled.span`
  color: #5bcefa;
  font-size: 10px;
`;

const EngravingDots = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const EngravingDot = styled.span<{ $filled: boolean; $color: string }>`
  width: 12px;
  height: 12px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: ${({ $filled, $color }) => ($filled ? $color : `${$color}33`)};
`;

// ─── Combat Stats ───

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 16px;
`;

const StatItemWrap = styled.div`
  position: relative;

  &:hover > div:last-child {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
`;

const StatTooltip = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 10;
  width: max-content;
  max-width: 400px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(20, 20, 30, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.15s ease;
  pointer-events: none;
`;

const StatTooltipLine = styled.div`
  font-size: 12px;
  line-height: 1.6;
  color: #ddd;

  span {
    font-weight: 600;
  }
`;

const StatLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const StatValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  font-variant-numeric: tabular-nums;
`;

const MainStatBadge = styled.span`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(59, 130, 246, 1);
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
`;

const StatHeroRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
`;

const StatHeroCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.main};
  border: 1px solid ${({ theme }) => theme.app.border};

  &:hover > div:last-child {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const StatHeroLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light2};
`;

const StatHeroValue = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.app.text.dark1};
  font-variant-numeric: tabular-nums;
`;

const RadarChartWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 4px 0 8px;
  max-width: 260px;
  margin: 0 auto;
`;

// ─── Compact Skills ───

const CompactSkillGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;

  ${({ theme }) => theme.medias.max768} {
    grid-template-columns: 1fr;
  }
`;

const CompactSkillRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CompactSkillIcon = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: #1a1a2e;
  flex-shrink: 0;
`;

const CompactSkillInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const CompactSkillName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CompactSkillSub = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
`;
