import type { FC } from "react";
import styled from "styled-components";

import type { ArmoryProfile, ArmorySkill } from "@core/types/armory";
import { getGradeColor, stripHtml } from "@core/utils/tooltipParser";

interface Props {
  skills: ArmorySkill[] | null;
  profile: ArmoryProfile | null;
}

const SkillsTab: FC<Props> = ({ skills, profile }) => {
  if (!skills || skills.length === 0) {
    return <EmptyMessage>스킬 정보가 없습니다.</EmptyMessage>;
  }

  const activeSkills = skills.filter(
    (s) =>
      !s.IsAwakening &&
      (s.Level > 1 || s.Tripods.some((t) => t.IsSelected) || s.Rune)
  );
  const awakenSkills = skills.filter((s) => s.IsAwakening);

  return (
    <Wrapper>
      {/* 스킬 포인트 헤더 */}
      <SkillHeader>
        <HeaderLeft>
          <HeaderTitle>스킬</HeaderTitle>
        </HeaderLeft>
        {profile && (
          <SkillPointInfo>
            스킬 포인트: {profile.UsingSkillPoint} / {profile.TotalSkillPoint}
          </SkillPointInfo>
        )}
      </SkillHeader>

      {/* 각성 스킬 */}
      {awakenSkills.length > 0 && (
        <Section>
          <SectionTitle>각성 스킬</SectionTitle>
          <SkillList>
            {awakenSkills.map((s, i) => (
              <SkillRow key={i} skill={s} />
            ))}
          </SkillList>
        </Section>
      )}

      {/* 사용 스킬 */}
      {activeSkills.length > 0 && (
        <Section>
          <SectionTitle>사용 스킬 ({activeSkills.length})</SectionTitle>
          <SkillList>
            {activeSkills.map((s, i) => (
              <SkillRow key={i} skill={s} />
            ))}
          </SkillList>
        </Section>
      )}
    </Wrapper>
  );
};

export default SkillsTab;

// ─── Skill Row Sub-component ───

const SkillRow: FC<{ skill: ArmorySkill }> = ({ skill }) => {
  const selectedTripods = skill.Tripods.filter((t) => t.IsSelected);
  const hasGems = skill.GemOption && skill.GemOption.length > 0;

  return (
    <SkillCard>
      <SkillMainRow>
        <SkillLeftSection>
          <SkillIcon src={skill.Icon} alt={skill.Name} />
          <SkillInfo>
            <SkillNameRow>
              <SkillName>{skill.Name}</SkillName>
              <SkillLevel>Lv.{skill.Level}</SkillLevel>
              {skill.Type && <SkillTypeBadge>{skill.Type}</SkillTypeBadge>}
            </SkillNameRow>
            {selectedTripods.length > 0 && (
              <TripodRow>
                {selectedTripods.map((tripod, i) => (
                  <TripodItem key={i}>
                    <TripodIcon src={tripod.Icon} alt={tripod.Name} />
                    <TripodText>
                      {tripod.Name}
                      <TripodLevel> Lv.{tripod.Level}</TripodLevel>
                    </TripodText>
                  </TripodItem>
                ))}
              </TripodRow>
            )}
          </SkillInfo>
        </SkillLeftSection>

        <SkillRightSection>
          {skill.Rune && (
            <RuneBadge $gradeColor={getGradeColor(skill.Rune.Grade)}>
              <RuneIcon src={skill.Rune.Icon} alt={skill.Rune.Name} />
              <RuneText>
                <RuneGrade $gradeColor={getGradeColor(skill.Rune.Grade)}>
                  {skill.Rune.Grade}
                </RuneGrade>
                <RuneName>{skill.Rune.Name}</RuneName>
              </RuneText>
            </RuneBadge>
          )}
          {hasGems && (
            <GemOptions>
              {skill.GemOption!.map((g, i) => (
                <GemOptionText key={i}>{stripHtml(g.Description)}</GemOptionText>
              ))}
            </GemOptions>
          )}
        </SkillRightSection>
      </SkillMainRow>
    </SkillCard>
  );
};

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

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;
`;

const SkillPointInfo = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;
`;

const SkillList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SkillCard = styled.div`
  padding: 10px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const SkillMainRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;

  ${({ theme }) => theme.medias.max768} {
    flex-direction: column;
  }
`;

const SkillLeftSection = styled.div`
  display: flex;
  gap: 10px;
  flex: 1;
  min-width: 0;
`;

const SkillIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: #1a1a2e;
  flex-shrink: 0;
`;

const SkillInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const SkillNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const SkillName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const SkillLevel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const SkillTypeBadge = styled.span`
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.app.border};
  color: ${({ theme }) => theme.app.text.light2};
`;

const TripodRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TripodItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TripodIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 4px;
`;

const TripodText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const TripodLevel = styled.span`
  color: ${({ theme }) => theme.app.text.light2};
`;

const SkillRightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;

  ${({ theme }) => theme.medias.max768} {
    align-items: flex-start;
    padding-top: 4px;
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const RuneBadge = styled.div<{ $gradeColor: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid ${({ $gradeColor }) => $gradeColor}44;
  background: ${({ $gradeColor }) => $gradeColor}0A;
`;

const RuneIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 3px;
`;

const RuneText = styled.div`
  display: flex;
  flex-direction: column;
`;

const RuneGrade = styled.span<{ $gradeColor: string }>`
  font-size: 10px;
  color: ${({ $gradeColor }) => $gradeColor};
`;

const RuneName = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const GemOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const GemOptionText = styled.span`
  font-size: 11px;
  color: #3b82f6;
  text-align: right;

  ${({ theme }) => theme.medias.max768} {
    text-align: left;
  }
`;
