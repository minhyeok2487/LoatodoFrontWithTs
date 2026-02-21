import { useMemo, type FC } from "react";
import styled from "styled-components";

import type {
  ArmoryResponse,
  ArkPassiveEngravingEffect,
  ArmorySkill,
} from "@core/types/armory";
import { stripHtml, getGradeColor } from "@core/utils/tooltipParser";

import EquipmentSection from "./stats/EquipmentSection";
import GemSection from "./stats/GemSection";
import CardSection from "./stats/CardSection";

interface Props {
  data: ArmoryResponse;
}

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
      .filter(Boolean) as { Type: string; Value: string }[];
  }, [profile]);

  const engravingEffects: ArkPassiveEngravingEffect[] =
    engraving?.ArkPassiveEffects || [];

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
          <Section>
            <SectionTitle>아크 패시브</SectionTitle>
            <Divider />
            <ArkPassiveGrid>
              {arkPassive.Points.map((p, i) => {
                const color = getCategoryColor(p.Name);
                return (
                  <ArkPassiveCard key={i} $color={color}>
                    <ArkPassiveLabel>
                      <ArkPassiveDot $color={color} />
                      <ArkPassiveName>{p.Name}</ArkPassiveName>
                    </ArkPassiveLabel>
                    <ArkPassiveValue>{p.Value}</ArkPassiveValue>
                  </ArkPassiveCard>
                );
              })}
            </ArkPassiveGrid>
          </Section>
        )}

        {/* 각인 */}
        {engravingEffects.length > 0 && (
          <Section>
            <SectionTitleRow>
              <SectionTitle>각인</SectionTitle>
              <EngravingSummary>
                총 {engravingEffects.length}개
              </EngravingSummary>
            </SectionTitleRow>
            <Divider />
            <EngravingList>
              {engravingEffects.map((e, i) => (
                <EngravingRow key={i}>
                  <EngravingGradeDot $color={getEngravingColor(e.Grade)} />
                  <EngravingName>{stripHtml(e.Name)}</EngravingName>
                  <EngravingLevel>+{e.Level}</EngravingLevel>
                  {e.AbilityStoneLevel !== null && e.AbilityStoneLevel > 0 && (
                    <StoneBadge>
                      <StoneDot $color={getEngravingColor(e.Grade)} />+
                      {e.AbilityStoneLevel}
                    </StoneBadge>
                  )}
                </EngravingRow>
              ))}
            </EngravingList>
          </Section>
        )}

        {/* 전투 스탯 */}
        {allStats.length > 0 && (
          <Section>
            <SectionTitle>전투 스탯</SectionTitle>
            <Divider />
            <StatGrid>
              {allStats.map((s, i) => (
                <StatItem key={i}>
                  <StatLabel>{s.Type}</StatLabel>
                  <StatValue>
                    {parseInt(s.Value, 10).toLocaleString()}
                  </StatValue>
                </StatItem>
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

const ArkPassiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const ArkPassiveCard = styled.div<{ $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 8px;
  border: 1px solid ${({ $color }) => $color}33;
  background: ${({ $color }) => $color}0A;
`;

const ArkPassiveLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ArkPassiveDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const ArkPassiveName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const ArkPassiveValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

// ─── Engravings ───

const EngravingSummary = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

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

const EngravingGradeDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const EngravingName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  flex: 1;
`;

const EngravingLevel = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const StoneBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light2};
  padding: 1px 6px;
  border-radius: 4px;
  background: ${({ theme }) => theme.app.border};
`;

const StoneDot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

// ─── Combat Stats ───

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 16px;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
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
