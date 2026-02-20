import { useMemo, type FC } from "react";
import styled from "styled-components";

import type { ArmoryEquipment } from "@core/types/armory";
import {
  getGradeColor,
  extractQuality,
  isArmorType,
  isAccessoryType,
  isBraceletType,
  isStoneType,
  isJewelType,
  stripHtml,
  extractEnhanceLevel,
  extractAccessoryEffects,
  extractStoneEngravings,
  extractBraceletEffects,
} from "@core/utils/tooltipParser";

interface Props {
  equipment: ArmoryEquipment[] | null;
}

const EquipmentSection: FC<Props> = ({ equipment }) => {
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

  const hasEquipment =
    armorPieces.length > 0 ||
    accessories.length > 0 ||
    bracelet.length > 0 ||
    stone.length > 0 ||
    jewel.length > 0;

  if (!hasEquipment) return null;

  return (
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
  );
};

export default EquipmentSection;

// ─── Row Sub-components ───

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
