import type { FC } from "react";
import styled from "styled-components";

import type { ArmorySkill } from "@core/types/armory";
import { getGradeColor, stripHtml } from "@core/utils/tooltipParser";

interface Props {
  skills: ArmorySkill[] | null;
}

const SkillsTab: FC<Props> = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return <EmptyMessage>스킬 정보가 없습니다.</EmptyMessage>;
  }

  const activeSkills = skills.filter(
    (s) => s.Level > 1 || s.Tripods.some((t) => t.IsSelected) || s.Rune
  );
  const awakenSkills = skills.filter((s) => s.IsAwakening);

  const renderSkill = (skill: ArmorySkill, index: number) => (
    <SkillCard key={index}>
      <SkillHeader>
        <SkillIcon src={skill.Icon} alt={skill.Name} />
        <SkillInfo>
          <SkillName>{skill.Name}</SkillName>
          <SkillMeta>
            <SkillLevel>Lv.{skill.Level}</SkillLevel>
            {skill.Type && <SkillType>{skill.Type}</SkillType>}
          </SkillMeta>
        </SkillInfo>
        {skill.Rune && (
          <RuneBadge $gradeColor={getGradeColor(skill.Rune.Grade)}>
            <RuneIcon src={skill.Rune.Icon} alt={skill.Rune.Name} />
            <RuneName>{skill.Rune.Name}</RuneName>
          </RuneBadge>
        )}
      </SkillHeader>

      {skill.Tripods.filter((t) => t.IsSelected).length > 0 && (
        <TripodList>
          {skill.Tripods.filter((t) => t.IsSelected).map((tripod, i) => (
            <TripodItem key={i}>
              <TripodIcon src={tripod.Icon} alt={tripod.Name} />
              <TripodInfo>
                <TripodName>
                  {tripod.Name}
                  <TripodLevel>Lv.{tripod.Level}</TripodLevel>
                </TripodName>
              </TripodInfo>
            </TripodItem>
          ))}
        </TripodList>
      )}

      {skill.GemOption && skill.GemOption.length > 0 && (
        <GemOptions>
          {skill.GemOption.map((g, i) => (
            <GemOptionText key={i}>{stripHtml(g.Description)}</GemOptionText>
          ))}
        </GemOptions>
      )}
    </SkillCard>
  );

  return (
    <Wrapper>
      {awakenSkills.length > 0 && (
        <Section>
          <SectionTitle>각성 스킬</SectionTitle>
          <SkillGrid>
            {awakenSkills.map((s, i) => renderSkill(s, i))}
          </SkillGrid>
        </Section>
      )}

      {activeSkills.length > 0 && (
        <Section>
          <SectionTitle>
            사용 스킬 ({activeSkills.length})
          </SectionTitle>
          <SkillGrid>
            {activeSkills.map((s, i) => renderSkill(s, i))}
          </SkillGrid>
        </Section>
      )}
    </Wrapper>
  );
};

export default SkillsTab;

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

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 10px;

  ${({ theme }) => theme.medias.max768} {
    grid-template-columns: 1fr;
  }
`;

const SkillCard = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const SkillName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const SkillMeta = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const SkillLevel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const SkillType = styled.span`
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.app.border};
  color: ${({ theme }) => theme.app.text.light2};
`;

const RuneBadge = styled.div<{ $gradeColor: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid ${({ $gradeColor }) => $gradeColor};
  flex-shrink: 0;
`;

const RuneIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 3px;
`;

const RuneName = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const TripodList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const TripodItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TripodIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 4px;
`;

const TripodInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TripodName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const TripodLevel = styled.span`
  margin-left: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const GemOptions = styled.div`
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const GemOptionText = styled.span`
  font-size: 11px;
  color: #3B82F6;
`;
