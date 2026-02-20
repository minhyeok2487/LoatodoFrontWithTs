import { useMemo, type FC } from "react";
import styled from "styled-components";

import type { ArmoryGem } from "@core/types/armory";
import {
  getGradeColor,
  stripHtml,
  extractGemSummary,
} from "@core/utils/tooltipParser";

interface Props {
  gem: ArmoryGem | null;
}

const GemSection: FC<Props> = ({ gem }) => {
  const gems = gem?.Gems || [];
  const gemEffects = gem?.Effects?.Skills || [];

  const gemSummary = useMemo(
    () => (gems.length > 0 ? extractGemSummary(gems) : ""),
    [gems]
  );

  if (gems.length === 0) return null;

  return (
    <Section>
      <SectionTitleRow>
        <SectionTitle>보석</SectionTitle>
        {gemSummary && <SectionBadge>{gemSummary}</SectionBadge>}
      </SectionTitleRow>
      <Divider />
      <GemGrid>
        {[...gems]
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

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;
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
