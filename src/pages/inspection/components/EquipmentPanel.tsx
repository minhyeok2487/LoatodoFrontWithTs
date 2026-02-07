import styled from "styled-components";

import type { EquipmentHistory } from "@core/types/inspection";

import {
  getGradeColor,
  getQualityColor,
  formatEffectText,
  formatRefinement,
  getGrindingTier,
  GRINDING_TIER_COLORS,
  ARMOR_SLOTS,
  ACCESSORY_SLOTS,
  OTHER_SLOTS,
  type EquipDiff,
} from "./profileUtils";

interface Props {
  equipMap: Map<string, EquipmentHistory[]>;
  equipDiffs: EquipDiff[];
  characterImage?: string | null;
}

const EquipmentPanel = ({ equipMap, equipDiffs, characterImage }: Props) => {
  const renderSingleEquip = (
    equip: EquipmentHistory,
    index: number,
    mode: "armor" | "accessory" | "other"
  ) => {
    const gradeColor = getGradeColor(equip.grade);
    const refinementText = formatRefinement(equip);
    const matchingDiffs = equipDiffs.filter((d) => d.type === equip.type);
    const diff = matchingDiffs.find((d) => d.current === equip) ?? null;
    const hasChange = diff && diff.changeType !== "unchanged";

    return (
      <EquipSlot key={`${equip.type}-${index}`} $hasChange={!!hasChange}>
        <EquipIcon $gradeColor={gradeColor}>
          {equip.icon ? (
            <img src={equip.icon} alt={equip.type} />
          ) : (
            <PlaceholderIcon>{equip.type[0]}</PlaceholderIcon>
          )}
        </EquipIcon>
        <EquipDetails>
          <EquipNameRow>
            <EquipName $gradeColor={gradeColor}>{equip.name}</EquipName>
            {mode === "armor" && refinementText && (
              <RefinementText>{refinementText}</RefinementText>
            )}
          </EquipNameRow>

          {equip.quality != null && equip.quality >= 0 && (
            <QualityRow>
              <QualityBar>
                <QualityFill
                  $width={equip.quality}
                  $color={getQualityColor(equip.quality)}
                />
              </QualityBar>
              <QualityValue $color={getQualityColor(equip.quality)}>
                {equip.quality}
              </QualityValue>
            </QualityRow>
          )}

          {mode === "armor" && equip.basicEffect && (
            <EffectText>{formatEffectText(equip.basicEffect)}</EffectText>
          )}
          {mode === "accessory" && equip.grindingEffect && (
            <EffectLines>
              {formatEffectText(equip.grindingEffect)
                .split("\n")
                .filter((l) => l.trim())
                .map((line, i) => (
                  <EffectLine
                    key={i}
                    $color={GRINDING_TIER_COLORS[getGrindingTier(line)]}
                  >
                    {line}
                  </EffectLine>
                ))}
            </EffectLines>
          )}
          {mode === "accessory" && equip.engravings && (
            <EffectText>{formatEffectText(equip.engravings)}</EffectText>
          )}
          {equip.type === "어빌리티 스톤" && equip.engravings && (
            <EffectText>{formatEffectText(equip.engravings)}</EffectText>
          )}
          {equip.type === "팔찌" && equip.braceletEffect && (
            <EffectText>{formatEffectText(equip.braceletEffect)}</EffectText>
          )}

          {hasChange && diff && (
            <ChangeIndicator>{diff.changes.join(", ")}</ChangeIndicator>
          )}
        </EquipDetails>
      </EquipSlot>
    );
  };

  const renderSlotGroup = (
    slotNames: string[],
    mode: "armor" | "accessory" | "other"
  ) => {
    const items: JSX.Element[] = [];
    slotNames.forEach((slotName) => {
      const equips = equipMap.get(slotName) ?? [];
      if (equips.length === 0) {
        items.push(<EmptySlot key={slotName}>{slotName}</EmptySlot>);
      } else {
        equips.forEach((equip, idx) => {
          items.push(renderSingleEquip(equip, idx, mode));
        });
      }
    });
    return items;
  };

  return (
    <EquipmentSection>
      {characterImage && <CharacterBgImage src={characterImage} alt="" />}
      <LeftEquipPanel>
        <SectionTitle>방어구 / 무기</SectionTitle>
        <SlotList>{renderSlotGroup(ARMOR_SLOTS, "armor")}</SlotList>
      </LeftEquipPanel>

      <RightEquipPanel>
        <SectionTitle>악세서리</SectionTitle>
        <SlotList>{renderSlotGroup(ACCESSORY_SLOTS, "accessory")}</SlotList>

        {OTHER_SLOTS.some((s) => equipMap.has(s)) && (
          <>
            <SectionTitle>기타</SectionTitle>
            <SlotList>{renderSlotGroup(OTHER_SLOTS, "other")}</SlotList>
          </>
        )}
      </RightEquipPanel>
    </EquipmentSection>
  );
};

export default EquipmentPanel;

const SectionTitle = styled.h5`
  font-size: 12px;
  font-weight: 600;
  color: #6666aa;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const EquipmentSection = styled.div`
  position: relative;
  display: flex;
  gap: 24px;
  padding: 20px 28px 24px;
  align-items: flex-start;
  overflow: hidden;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const CharacterBgImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 110%;
  opacity: 0.12;
  pointer-events: none;
  object-fit: contain;
  mask-image: radial-gradient(
    ellipse 70% 80% at center,
    #000 30%,
    transparent 70%
  );
  -webkit-mask-image: radial-gradient(
    ellipse 70% 80% at center,
    #000 30%,
    transparent 70%
  );
`;

const LeftEquipPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  position: relative;
  z-index: 1;
`;

const RightEquipPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  position: relative;
  z-index: 1;
`;

const SlotList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EquipSlot = styled.div<{ $hasChange: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  background: ${({ $hasChange }) =>
    $hasChange
      ? "linear-gradient(135deg, rgba(202, 138, 4, 0.12) 0%, rgba(202, 138, 4, 0.04) 100%)"
      : "rgba(255, 255, 255, 0.02)"};
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $hasChange }) =>
      $hasChange
        ? "linear-gradient(135deg, rgba(202, 138, 4, 0.18) 0%, rgba(202, 138, 4, 0.06) 100%)"
        : "rgba(255, 255, 255, 0.05)"};
    transform: translateX(2px);
  }
`;

const EquipIcon = styled.div<{ $gradeColor: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #0e0e1a;
  box-shadow: 0 0 8px ${({ $gradeColor }) => $gradeColor}40,
    inset 0 0 0 1px ${({ $gradeColor }) => $gradeColor}60;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 0 14px ${({ $gradeColor }) => $gradeColor}60,
      inset 0 0 0 1px ${({ $gradeColor }) => $gradeColor}90;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderIcon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #444;
`;

const EquipDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
`;

const EquipNameRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
`;

const EquipName = styled.span<{ $gradeColor: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $gradeColor }) => $gradeColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 0 8px ${({ $gradeColor }) => $gradeColor}30;
`;

const RefinementText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #ffcc00;
  text-shadow: 0 0 6px rgba(255, 204, 0, 0.3);
`;

const QualityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const QualityBar = styled.div`
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  max-width: 100px;
  overflow: hidden;
`;

const QualityFill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: linear-gradient(
    90deg,
    ${({ $color }) => $color}aa,
    ${({ $color }) => $color}
  );
  border-radius: 3px;
  transition: width 0.3s;
  box-shadow: 0 0 6px ${({ $color }) => $color}40;
`;

const QualityValue = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  min-width: 24px;
`;

const EffectText = styled.span`
  font-size: 11px;
  color: #6666aa;
  line-height: 1.3;
  white-space: pre-wrap;
  word-break: break-word;
`;

const EffectLines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const EffectLine = styled.span<{ $color: string }>`
  font-size: 11px;
  color: ${({ $color }) => $color};
  line-height: 1.3;
`;

const ChangeIndicator = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #fbbf24;
  text-shadow: 0 0 6px rgba(251, 191, 36, 0.3);
`;

const EmptySlot = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  font-size: 12px;
  color: #444;
  border-radius: 10px;
`;
