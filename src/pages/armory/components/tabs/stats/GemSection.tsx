import { useState, useMemo, type FC } from "react";
import styled from "styled-components";

import type { ArmoryGem } from "@core/types/armory";
import { getGradeColor } from "@core/utils/tooltipParser";

interface Props {
  gem: ArmoryGem | null;
}

const GemSection: FC<Props> = ({ gem }) => {
  const [expanded, setExpanded] = useState(false);
  const gems = gem?.Gems || [];
  const gemEffects = gem?.Effects?.Skills || [];

  const sortedGems = useMemo(
    () => [...gems].sort((a, b) => b.Level - a.Level),
    [gems]
  );

  const classifyGem = (slotOrName: { Slot: number; Name: string }) => {
    const effect = gemEffects.find((e) => e.GemSlot === slotOrName.Slot);
    const descText = (effect?.Description || []).join(" ");
    if (descText.includes("재사용 대기시간")) return "cooldown";
    if (descText.includes("피해")) return "damage";
    const name = slotOrName.Name || "";
    if (name.includes("겁화") || name.includes("광휘")) return "cooldown";
    if (name.includes("작열") || name.includes("홍염")) return "damage";
    return "cooldown";
  };

  const { cooldownGems, damageGems } = useMemo(() => {
    const cd: typeof sortedGems = [];
    const dmg: typeof sortedGems = [];
    sortedGems.forEach((g) => {
      if (classifyGem(g) === "damage") dmg.push(g);
      else cd.push(g);
    });
    return { cooldownGems: cd, damageGems: dmg };
  }, [sortedGems, gemEffects]);

  const summary = useMemo(() => {
    if (gems.length === 0) return null;

    const avgLevel = Math.round(
      gems.reduce((sum, g) => sum + g.Level, 0) / gems.length
    );

    let cooldown = 0;
    let damage = 0;
    let totalBaseAtk = 0;

    gems.forEach((g) => {
      const effect = gemEffects.find((e) => e.GemSlot === g.Slot);
      const name = g.Name || "";
      const descriptions = effect?.Description || [];
      const descText = descriptions.join(" ");

      // 쿨타임 vs 데미지 분류 (Description 우선, 이름은 폴백)
      if (descText.includes("재사용 대기시간")) {
        cooldown += 1;
      } else if (descText.includes("피해")) {
        damage += 1;
      } else if (name.includes("겁화") || name.includes("광휘")) {
        cooldown += 1;
      } else if (name.includes("작열") || name.includes("홍염")) {
        damage += 1;
      }

      // 기본 공격력 % 합산
      const atkMatch = descText.match(/기본 공격력\s+([\d.]+)%/);
      if (atkMatch) {
        totalBaseAtk += parseFloat(atkMatch[1]);
      }
    });

    return { avgLevel, cooldown, damage, totalBaseAtk };
  }, [gems, gemEffects]);

  if (gems.length === 0) return null;

  return (
    <Section>
      <HeaderRow onClick={() => setExpanded((v) => !v)}>
        <SectionTitle>보석</SectionTitle>
        <Chevron $expanded={expanded}>›</Chevron>
      </HeaderRow>

      {summary && (
        <SummaryRow>
          <SummaryLeft>평균 {summary.avgLevel}</SummaryLeft>
          <SummaryRight>
            {summary.cooldown > 0 && (
              <SummaryItem>쿨타임 {summary.cooldown}</SummaryItem>
            )}
            {summary.damage > 0 && (
              <SummaryItem>데미지 {summary.damage}</SummaryItem>
            )}
            {summary.totalBaseAtk > 0 && (
              <SummaryItem>
                기본 공격력 {summary.totalBaseAtk.toFixed(2)}% 증가
              </SummaryItem>
            )}
          </SummaryRight>
        </SummaryRow>
      )}

      <Divider />

      <GemGrid>
        {sortedGems.map((g, i) => (
          <GemItemCard key={i}>
            <GemIconWrapper $gradeColor={getGradeColor(g.Grade)}>
              <GemIcon src={g.Icon} alt={g.Name} />
              <GemLevelBadge>{g.Level}광</GemLevelBadge>
            </GemIconWrapper>
          </GemItemCard>
        ))}
      </GemGrid>

      <Collapsible $expanded={expanded}>
        <CollapsibleInner>
          <DetailDivider />
          <DetailColumns>
            {damageGems.length > 0 && (
              <DetailColumn>
                <ColumnHeader>데미지 {damageGems.length}</ColumnHeader>
                <DetailList>
                  {damageGems.map((g, i) => {
                    const effect = gemEffects.find(
                      (e) => e.GemSlot === g.Slot
                    );
                    return (
                      <DetailItem key={i}>
                        <DetailIconWrapper
                          $gradeColor={getGradeColor(g.Grade)}
                        >
                          <DetailIcon src={g.Icon} alt={g.Name} />
                          <DetailLevelBadge>
                            {g.Level}광
                          </DetailLevelBadge>
                        </DetailIconWrapper>
                        <DetailInfo>
                          <DetailSkillName>
                            {effect ? effect.Name : g.Name}
                          </DetailSkillName>
                          <DetailDescription>
                            {effect
                              ? effect.Description.join(", ")
                              : ""}
                          </DetailDescription>
                        </DetailInfo>
                      </DetailItem>
                    );
                  })}
                </DetailList>
              </DetailColumn>
            )}
            {cooldownGems.length > 0 && (
              <DetailColumn>
                <ColumnHeader>쿨타임 {cooldownGems.length}</ColumnHeader>
                <DetailList>
                  {cooldownGems.map((g, i) => {
                    const effect = gemEffects.find(
                      (e) => e.GemSlot === g.Slot
                    );
                    return (
                      <DetailItem key={i}>
                        <DetailIconWrapper
                          $gradeColor={getGradeColor(g.Grade)}
                        >
                          <DetailIcon src={g.Icon} alt={g.Name} />
                          <DetailLevelBadge>
                            {g.Level}광
                          </DetailLevelBadge>
                        </DetailIconWrapper>
                        <DetailInfo>
                          <DetailSkillName>
                            {effect ? effect.Name : g.Name}
                          </DetailSkillName>
                          <DetailDescription>
                            {effect
                              ? effect.Description.join(", ")
                              : ""}
                          </DetailDescription>
                        </DetailInfo>
                      </DetailItem>
                    );
                  })}
                </DetailList>
              </DetailColumn>
            )}
          </DetailColumns>
        </CollapsibleInner>
      </Collapsible>
    </Section>
  );
};

export default GemSection;

// ─── Styled Components ───

const Section = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 6px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;
`;

const Chevron = styled.span<{ $expanded: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.light2};
  transition: transform 0.3s ease;
  transform: rotate(${({ $expanded }) => ($expanded ? "90deg" : "0deg")});
  user-select: none;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const SummaryLeft = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const SummaryRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;

const SummaryItem = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};

  &:not(:last-child)::after {
    content: "|";
    margin: 0 6px;
    color: ${({ theme }) => theme.app.border};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  margin: 10px 0;
`;

const GemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
  gap: 6px;
`;

const GemItemCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GemIconWrapper = styled.div<{ $gradeColor: string }>`
  position: relative;
  width: 64px;
  height: 64px;
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
  font-size: 11px;
  font-weight: 700;
  padding: 0 3px;
  border-radius: 3px;
`;

// ─── Collapsible Detail ───

const Collapsible = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $expanded }) => ($expanded ? "1fr" : "0fr")};
  transition: grid-template-rows 0.3s ease;
`;

const CollapsibleInner = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const DetailDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  margin: 10px 0 8px;
`;

const DetailColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const DetailColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ColumnHeader = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  margin-bottom: 2px;
`;

const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DetailIconWrapper = styled.div<{ $gradeColor: string }>`
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid ${({ $gradeColor }) => $gradeColor};
  overflow: hidden;
  background: #1a1a2e;
`;

const DetailIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const DetailLevelBadge = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 0 3px;
  border-radius: 3px 0 0 0;
  line-height: 1.4;
`;

const DetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const DetailSkillName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const DetailDescription = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
  line-height: 1.4;
`;
