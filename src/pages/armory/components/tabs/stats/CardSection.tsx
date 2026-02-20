import { useMemo, type FC } from "react";
import styled from "styled-components";

import type { ArmoryCard } from "@core/types/armory";
import { getGradeColor, stripHtml } from "@core/utils/tooltipParser";

interface Props {
  card: ArmoryCard | null;
}

const CardSection: FC<Props> = ({ card }) => {
  const cards = card?.Cards || [];
  const cardEffects = useMemo(() => {
    if (!card?.Effects) return [];
    return card.Effects.flatMap((e) => e.Items);
  }, [card]);

  if (cards.length === 0) return null;

  return (
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
                <CardEffectDesc>{stripHtml(e.Description)}</CardEffectDesc>
              </CardEffectRow>
            ))}
          </CardEffects>
        </>
      )}
    </Section>
  );
};

export default CardSection;

// ─── Styled Components ───

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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  margin: 10px 0;
`;

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
