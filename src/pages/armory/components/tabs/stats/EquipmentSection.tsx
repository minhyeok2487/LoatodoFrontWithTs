import { useMemo, useState, type FC } from "react";
import { Dialog } from "@mui/material";
import styled from "styled-components";

import type { ArmoryEquipment } from "@core/types/armory";
import {
  getGradeColor,
  extractQuality,
  isArmorType,
  isAccessoryType,
  isBraceletType,
  isStoneType,
  isElixirType,
  isJewelType,
  stripHtml,
  extractEnhanceLevel,
  extractAccessoryStats,
  extractStoneEngravings,
  extractBraceletStats,
  extractItemTierAndLevel,
  extractAllTooltipSections,
  fontToSpan,
  type TooltipSection,
} from "@core/utils/tooltipParser";

interface Props {
  equipment: ArmoryEquipment[] | null;
}

// ─── 품질 색상 헬퍼 ───

const getQualityColor = (quality: number): string => {
  if (quality === 100) return "#F59E0B";
  if (quality >= 90) return "#A855F7";
  if (quality >= 70) return "#3B82F6";
  if (quality >= 30) return "#22C55E";
  return "#EF4444";
};

const calcAvgQuality = (items: ArmoryEquipment[]): number | null => {
  const qualities = items
    .map((item) => extractQuality(item.Tooltip))
    .filter((q): q is number => q !== null && q >= 0);
  if (qualities.length === 0) return null;
  return Math.round(qualities.reduce((a, b) => a + b, 0) / qualities.length);
};

// ─── 짧은 타입명 ───

const SHORT_TYPE: Record<string, string> = {
  "머리 방어구": "머리",
  "어깨 방어구": "어깨",
  투구: "머리",
  어깨: "어깨",
  상의: "상의",
  하의: "하의",
  장갑: "장갑",
  무기: "무기",
  목걸이: "목걸이",
  귀걸이: "귀걸이",
  반지: "반지",
  나침반: "나침반",
  부적: "부적",
};

const shortType = (type: string) => SHORT_TYPE[type] || type;

// ─── 아이템 이름에서 강화/타입 제거 → 특수 이름 ───

const extractSpecialName = (name: string, type: string): string | null => {
  const clean = stripHtml(name);
  // 이미 알려진 패턴 제거 후 남는 이름
  const withoutEnhance = clean.replace(/\+\d+\s*/, "").trim();
  // 장비 타입 키워드들
  const typeKeywords = [
    "머리 방어구",
    "어깨 방어구",
    "투구",
    "어깨",
    "상의",
    "하의",
    "장갑",
    "무기",
    "목걸이",
    "귀걸이",
    "반지",
    "팔찌",
    "어빌리티 스톤",
    "나침반",
    "부적",
    "머리장식",
    "견갑",
  ];
  // 타입 키워드가 이름에 포함되어 있으면 특수이름 없음
  if (typeKeywords.some((k) => withoutEnhance.includes(k))) return null;
  // 길이가 너무 길면 잘라서 표시
  if (withoutEnhance.length > 20) return `${withoutEnhance.slice(0, 18)}…`;
  return withoutEnhance || null;
};

// ─── Main Component ───

const EquipmentSection: FC<Props> = ({ equipment }) => {
  const [selectedItem, setSelectedItem] = useState<ArmoryEquipment | null>(
    null
  );

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
  const elixirItems = useMemo(
    () => (equipment || []).filter((e) => isElixirType(e.Type)),
    [equipment]
  );
  const jewel = useMemo(
    () => (equipment || []).filter((e) => isJewelType(e.Type)),
    [equipment]
  );

  const armorAvg = useMemo(() => calcAvgQuality(armorPieces), [armorPieces]);
  const accAvg = useMemo(() => calcAvgQuality(accessories), [accessories]);

  const hasEquipment =
    armorPieces.length > 0 ||
    accessories.length > 0 ||
    bracelet.length > 0 ||
    stone.length > 0 ||
    elixirItems.length > 0 ||
    jewel.length > 0;

  if (!hasEquipment) return null;

  return (
    <Section>
      <SectionTitle>장비</SectionTitle>
      <Divider />

      {/* 방어구 + 악세서리 2컬럼 */}
      {(armorPieces.length > 0 || accessories.length > 0) && (
        <TwoColumnGrid>
          <Column>
            {armorAvg !== null && (
              <ColumnHeader>
                <QualityLabel>품질</QualityLabel>
                <QualityAvg $quality={armorAvg}>{armorAvg}</QualityAvg>
              </ColumnHeader>
            )}
            {armorPieces.map((item, i) => (
              <ArmorRow
                key={i}
                equipment={item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </Column>
          <Column>
            {accAvg !== null && (
              <ColumnHeader>
                <QualityLabel>품질</QualityLabel>
                <QualityAvg $quality={accAvg}>{accAvg}</QualityAvg>
              </ColumnHeader>
            )}
            {accessories.map((item, i) => (
              <AccessoryRow
                key={i}
                equipment={item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </Column>
        </TwoColumnGrid>
      )}

      {/* 팔찌 + 스톤 하단 2컬럼 */}
      {(bracelet.length > 0 || stone.length > 0) && (
        <>
          <Divider />
          <TwoColumnGrid>
            <Column>
              {bracelet.map((item, i) => (
                <BraceletRow
                  key={i}
                  equipment={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </Column>
            <Column>
              {stone.map((item, i) => (
                <StoneRow
                  key={i}
                  equipment={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </Column>
          </TwoColumnGrid>
        </>
      )}

      {/* 나침반 + 부적 */}
      {elixirItems.length > 0 && (
        <>
          <Divider />
          <TwoColumnGrid>
            {elixirItems.map((item, i) => (
              <Column key={i}>
                <ElixirItemRow
                  equipment={item}
                  onClick={() => setSelectedItem(item)}
                />
              </Column>
            ))}
          </TwoColumnGrid>
        </>
      )}

      {/* 보주 풀너비 */}
      {jewel.length > 0 && (
        <>
          <Divider />
          {jewel.map((item, i) => (
            <JewelRow
              key={i}
              equipment={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </>
      )}

      {/* 상세 툴팁 모달 */}
      <EquipmentDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </Section>
  );
};

export default EquipmentSection;

// ─── Row Sub-components ───

interface RowProps {
  equipment: ArmoryEquipment;
  onClick: () => void;
}

const ArmorRow: FC<RowProps> = ({ equipment, onClick }) => {
  const quality = extractQuality(equipment.Tooltip);
  const gradeColor = getGradeColor(equipment.Grade);
  const enhance = extractEnhanceLevel(equipment.Name);
  const tierInfo = extractItemTierAndLevel(equipment.Tooltip);
  const specialName = extractSpecialName(equipment.Name, equipment.Type);

  return (
    <EquipRowWrapper onClick={onClick}>
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
          <EquipType>{shortType(equipment.Type)}</EquipType>
          {enhance !== null && <EnhanceLevel>+{enhance}</EnhanceLevel>}
          {tierInfo && <TierBadge>T{tierInfo.tier}</TierBadge>}
          {specialName && (
            <SpecialName $gradeColor={gradeColor}>{specialName}</SpecialName>
          )}
        </EquipNameRow>
        <EquipSubRow>
          {quality !== null && quality >= 0 && (
            <QualityNumber $quality={quality}>{quality}</QualityNumber>
          )}
          {tierInfo && tierInfo.itemLevel > 0 && (
            <ItemLevel>{tierInfo.itemLevel}</ItemLevel>
          )}
        </EquipSubRow>
      </EquipInfo>
    </EquipRowWrapper>
  );
};

const AccessoryRow: FC<RowProps> = ({ equipment, onClick }) => {
  const quality = extractQuality(equipment.Tooltip);
  const gradeColor = getGradeColor(equipment.Grade);
  const enhance = extractEnhanceLevel(equipment.Name);
  const tierInfo = extractItemTierAndLevel(equipment.Tooltip);
  const stats = extractAccessoryStats(equipment.Tooltip);

  return (
    <EquipRowWrapper onClick={onClick}>
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
          <EquipType>
            {shortType(equipment.Type)}
            {tierInfo && ` T${tierInfo.tier}`}
          </EquipType>
          {quality !== null && (
            <QualityCircle $quality={quality}>{quality}</QualityCircle>
          )}
          {enhance !== null && <EnhanceLevel>+{enhance}</EnhanceLevel>}
        </EquipNameRow>
        {stats.length > 0 && (
          <EffectLine>
            {stats.map((stat, i) => (
              <span key={i}>
                {i > 0 && <EffectSep>|</EffectSep>}
                <StatText>{stat}</StatText>
              </span>
            ))}
          </EffectLine>
        )}
      </EquipInfo>
    </EquipRowWrapper>
  );
};

const BraceletRow: FC<RowProps> = ({ equipment, onClick }) => {
  const gradeColor = getGradeColor(equipment.Grade);
  const stats = extractBraceletStats(equipment.Tooltip);

  return (
    <EquipRowWrapper onClick={onClick}>
      <EquipIconWrapper $gradeColor={gradeColor}>
        <EquipIcon src={equipment.Icon} alt={equipment.Name} />
      </EquipIconWrapper>
      <EquipInfo>
        <EquipNameRow>
          <EquipType>팔찌</EquipType>
        </EquipNameRow>
        {stats.length > 0 && (
          <BraceletEffectLine>
            {stats.map((stat, i) => (
              <StatText key={i}>{stat}</StatText>
            ))}
          </BraceletEffectLine>
        )}
      </EquipInfo>
    </EquipRowWrapper>
  );
};

const StoneRow: FC<RowProps> = ({ equipment, onClick }) => {
  const gradeColor = getGradeColor(equipment.Grade);
  const tierInfo = extractItemTierAndLevel(equipment.Tooltip);
  const engravings = extractStoneEngravings(equipment.Tooltip);

  return (
    <EquipRowWrapper onClick={onClick}>
      <EquipIconWrapper $gradeColor={gradeColor}>
        <EquipIcon src={equipment.Icon} alt={equipment.Name} />
      </EquipIconWrapper>
      <EquipInfo>
        <EquipNameRow>
          <EquipType>스톤{tierInfo && ` T${tierInfo.tier}`}</EquipType>
        </EquipNameRow>
        {engravings.length > 0 && (
          <StoneEffects>
            {engravings.map((eng, i) => (
              <StoneEngraving key={i} $isNegative={eng.isNegative}>
                {eng.level} {eng.name}
              </StoneEngraving>
            ))}
          </StoneEffects>
        )}
      </EquipInfo>
    </EquipRowWrapper>
  );
};

const JewelRow: FC<RowProps> = ({ equipment, onClick }) => {
  const gradeColor = getGradeColor(equipment.Grade);

  return (
    <JewelRowWrapper onClick={onClick}>
      <EquipIconWrapper $gradeColor={gradeColor}>
        <EquipIcon src={equipment.Icon} alt={equipment.Name} />
      </EquipIconWrapper>
      <EquipInfo>
        <EquipNameRow>
          <EquipType>보주</EquipType>
          <SpecialName $gradeColor={gradeColor}>
            {stripHtml(equipment.Name)}
          </SpecialName>
        </EquipNameRow>
      </EquipInfo>
    </JewelRowWrapper>
  );
};

const ElixirItemRow: FC<RowProps> = ({ equipment, onClick }) => {
  const gradeColor = getGradeColor(equipment.Grade);

  return (
    <EquipRowWrapper onClick={onClick}>
      <EquipIconWrapper $gradeColor={gradeColor}>
        <EquipIcon src={equipment.Icon} alt={equipment.Name} />
      </EquipIconWrapper>
      <EquipInfo>
        <EquipNameRow>
          <EquipType>{shortType(equipment.Type)}</EquipType>
          <SpecialName $gradeColor={gradeColor}>
            {stripHtml(equipment.Name)}
          </SpecialName>
        </EquipNameRow>
      </EquipInfo>
    </EquipRowWrapper>
  );
};

// ─── Equipment Detail Modal ───

interface ModalProps {
  item: ArmoryEquipment | null;
  onClose: () => void;
}

const EquipmentDetailModal: FC<ModalProps> = ({ item, onClose }) => {
  const sections = useMemo(
    () => (item ? extractAllTooltipSections(item.Tooltip) : []),
    [item]
  );
  const gradeColor = item ? getGradeColor(item.Grade) : "#959595";

  if (!item) return null;

  return (
    <ModalWrapper
      open
      onClose={onClose}
      transitionDuration={{ enter: 200, exit: 0 }}
    >
      <ModalContent>
        {/* 아이템 이름 헤더 */}
        <ModalItemName style={{ color: gradeColor }}>
          {stripHtml(item.Name)}
        </ModalItemName>

        {/* 아이콘 + 기본정보 헤더 */}
        <ModalHeader>
          <ModalIconBox $gradeColor={gradeColor}>
            <EquipIcon src={item.Icon} alt={item.Name} />
            {(() => {
              const q = extractQuality(item.Tooltip);
              return q !== null && q >= 0 ? (
                <QualityBar>
                  <QualityFill $quality={q} />
                </QualityBar>
              ) : null;
            })()}
          </ModalIconBox>
          <ModalHeaderInfo>
            {sections
              .filter((s): s is Extract<TooltipSection, { sectionType: "title" }> => s.sectionType === "title")
              .map((s, i) => (
                <div key={i}>
                  <ModalGradeLine
                    dangerouslySetInnerHTML={{
                      __html: fontToSpan(s.itemName),
                    }}
                  />
                  {s.tierLine && <ModalTierLine>{s.tierLine}</ModalTierLine>}
                  {s.qualityValue >= 0 && (
                    <ModalQualityRow>
                      <span>품질 </span>
                      <QualityNumber $quality={s.qualityValue}>
                        {s.qualityValue}
                      </QualityNumber>
                      <ModalQualityBar>
                        <QualityFill $quality={s.qualityValue} />
                      </ModalQualityBar>
                    </ModalQualityRow>
                  )}
                </div>
              ))}
          </ModalHeaderInfo>
        </ModalHeader>

        {/* 나머지 섹션들 */}
        {sections
          .filter((s) => s.sectionType !== "title")
          .map((section, idx) => (
            <ModalSectionRenderer key={idx} section={section} />
          ))}
      </ModalContent>
    </ModalWrapper>
  );
};

const ModalSectionRenderer: FC<{ section: TooltipSection }> = ({ section }) => {
  switch (section.sectionType) {
    case "text":
      return (
        <ModalTextBlock>
          {section.lines.map((line, i) => (
            <ModalTextLine
              key={i}
              dangerouslySetInnerHTML={{ __html: fontToSpan(line) }}
            />
          ))}
        </ModalTextBlock>
      );

    case "partbox":
      return (
        <ModalPartBox>
          <ModalPartTitle>{section.title}</ModalPartTitle>
          {section.lines.map((line, i) => (
            <ModalPartLine
              key={i}
              dangerouslySetInnerHTML={{ __html: fontToSpan(line) }}
            />
          ))}
        </ModalPartBox>
      );

    case "indent":
      return (
        <ModalIndentBlock>
          {section.label && (
            <ModalIndentLabel
              dangerouslySetInnerHTML={{ __html: fontToSpan(section.label) }}
            />
          )}
          {section.items.map((item, i) => (
            <ModalIndentItem
              key={i}
              dangerouslySetInnerHTML={{ __html: fontToSpan(item) }}
            />
          ))}
        </ModalIndentBlock>
      );

    case "progress":
      if (section.current === 0 && section.max === 0) return null;
      return (
        <ModalProgressBlock>
          {section.title && (
            <ModalProgressTitle
              dangerouslySetInnerHTML={{ __html: fontToSpan(section.title) }}
            />
          )}
          <ModalProgressBarOuter>
            <ModalProgressBarInner
              style={{
                width: section.max > 0
                  ? `${(section.current / section.max) * 100}%`
                  : "0%",
              }}
            />
          </ModalProgressBarOuter>
          <ModalProgressText>
            {section.current.toLocaleString()} / {section.max.toLocaleString()}
          </ModalProgressText>
        </ModalProgressBlock>
      );

    case "set":
      return (
        <ModalTextBlock>
          <ModalTextLine>{section.text}</ModalTextLine>
        </ModalTextBlock>
      );

    default:
      return null;
  }
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

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
`;

const QualityLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const QualityAvg = styled.span<{ $quality: number }>`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $quality }) => getQualityColor($quality)};
`;

const EquipRowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 3px 4px;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.app.bg.main};
  }
`;

const JewelRowWrapper = styled(EquipRowWrapper)``;

const EquipIconWrapper = styled.div<{ $gradeColor: string }>`
  position: relative;
  width: 40px;
  height: 40px;
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
  height: 3px;
  background: #333;
`;

const QualityFill = styled.div<{ $quality: number }>`
  height: 100%;
  width: ${({ $quality }) => $quality}%;
  background: ${({ $quality }) => getQualityColor($quality)};
`;

const EquipInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const EquipNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`;

const EquipSubRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const EquipType = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
  white-space: nowrap;
`;

const EnhanceLevel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #f59e0b;
`;

const TierBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light2};
  background: ${({ theme }) => theme.app.bg.main};
  padding: 0 4px;
  border-radius: 3px;
`;

const SpecialName = styled.span<{ $gradeColor: string }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $gradeColor }) => $gradeColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const QualityNumber = styled.span<{ $quality: number }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $quality }) => getQualityColor($quality)};
  flex-shrink: 0;
`;

const QualityCircle = styled.span<{ $quality: number }>`
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: ${({ $quality }) => getQualityColor($quality)};
  width: 22px;
  height: 16px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ItemLevel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const EffectLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  font-size: 10px;
`;

const BraceletEffectLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 6px;
  font-size: 10px;
`;

const EffectSep = styled.span`
  color: ${({ theme }) => theme.app.text.light2};
  margin: 0 2px;
`;

const StatText = styled.span`
  color: #60a5fa;
  white-space: nowrap;
`;

const StoneEffects = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const StoneEngraving = styled.span<{ $isNegative: boolean }>`
  font-size: 10px;
  color: ${({ $isNegative }) => ($isNegative ? "#EF4444" : "#3B82F6")};
`;

// ─── Modal Styled Components ───

const ModalWrapper = styled(Dialog)`
  .MuiPaper-root {
    padding: 0;
    min-width: 320px;
    max-width: 420px;
    max-height: 80vh;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(20, 20, 30, 0.97);
    backdrop-filter: blur(12px);
    color: #ddd;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
`;

const ModalContent = styled.div`
  padding: 16px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ModalItemName = styled.div`
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const ModalHeader = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 8px 0;
`;

const ModalIconBox = styled.div<{ $gradeColor: string }>`
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  border: 2px solid ${({ $gradeColor }) => $gradeColor};
  overflow: hidden;
  flex-shrink: 0;
  background: #1a1a2e;
`;

const ModalHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const ModalGradeLine = styled.div`
  font-size: 13px;
  color: #bbb;
  line-height: 1.4;
`;

const ModalTierLine = styled.div`
  font-size: 12px;
  color: #999;
`;

const ModalQualityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #999;
  margin-top: 2px;
`;

const ModalQualityBar = styled.div`
  flex: 1;
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
  max-width: 120px;
`;

const ModalTextBlock = styled.div`
  padding: 4px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const ModalTextLine = styled.div`
  font-size: 12px;
  color: #bbb;
  line-height: 1.6;

  span {
    font-weight: 500;
  }
`;

const ModalPartBox = styled.div`
  padding: 6px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const ModalPartTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #e8c77b;
  margin-bottom: 4px;
`;

const ModalPartLine = styled.div`
  font-size: 12px;
  color: #ccc;
  line-height: 1.6;
`;

const ModalIndentBlock = styled.div`
  padding: 4px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const ModalIndentLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #ddd;
  margin-bottom: 2px;
  line-height: 1.5;
`;

const ModalIndentItem = styled.div`
  font-size: 12px;
  color: #bbb;
  padding-left: 12px;
  line-height: 1.6;
`;

const ModalProgressBlock = styled.div`
  padding: 6px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const ModalProgressTitle = styled.div`
  font-size: 12px;
  color: #bbb;
  margin-bottom: 4px;
`;

const ModalProgressBarOuter = styled.div`
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
`;

const ModalProgressBarInner = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 4px;
  transition: width 0.3s;
`;

const ModalProgressText = styled.div`
  font-size: 11px;
  color: #888;
  text-align: right;
  margin-top: 2px;
`;
