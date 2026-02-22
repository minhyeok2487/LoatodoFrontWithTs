import { useMemo, type FC } from "react";
import { Tooltip } from "@mui/material";
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
  getAccessoryEffectGrade,
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

const extractSpecialName = (name: string): string | null => {
  const clean = stripHtml(name);
  const withoutEnhance = clean.replace(/\+\d+\s*/, "").trim();
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
  if (typeKeywords.some((k) => withoutEnhance.includes(k))) return null;
  if (withoutEnhance.length > 20) return `${withoutEnhance.slice(0, 18)}…`;
  return withoutEnhance || null;
};

// ─── 호버 툴팁 래퍼 ───

const buildTooltipTitle = (item: ArmoryEquipment) => {
  const sections = extractAllTooltipSections(item.Tooltip);
  const gradeColor = getGradeColor(item.Grade);
  const quality = extractQuality(item.Tooltip);

  return (
    <TooltipContent>
      <TooltipItemName style={{ color: gradeColor }}>
        {stripHtml(item.Name)}
      </TooltipItemName>

      <TooltipHeader>
        <TooltipIconBox $gradeColor={gradeColor}>
          <EquipIcon src={item.Icon} alt={item.Name} />
          {quality !== null && quality >= 0 && (
            <QualityBar>
              <QualityFill $quality={quality} />
            </QualityBar>
          )}
        </TooltipIconBox>
        <TooltipHeaderInfo>
          {sections
            .filter(
              (s): s is Extract<TooltipSection, { sectionType: "title" }> =>
                s.sectionType === "title"
            )
            .map((s, i) => (
              <div key={i}>
                <TtGradeLine
                  dangerouslySetInnerHTML={{
                    __html: fontToSpan(s.itemName),
                  }}
                />
                {s.tierLine && <TtTierLine>{s.tierLine}</TtTierLine>}
                {s.qualityValue >= 0 && (
                  <TtQualityRow>
                    <span>품질 </span>
                    <QualityNumber $quality={s.qualityValue}>
                      {s.qualityValue}
                    </QualityNumber>
                    <TtQualityBar>
                      <QualityFill $quality={s.qualityValue} />
                    </TtQualityBar>
                  </TtQualityRow>
                )}
              </div>
            ))}
        </TooltipHeaderInfo>
      </TooltipHeader>

      {sections
        .filter((s) => s.sectionType !== "title")
        .map((section, idx) => (
          <TtSectionRenderer key={idx} section={section} />
        ))}
    </TooltipContent>
  );
};

const tooltipSx = {
  maxWidth: 400,
  p: 0,
  bgcolor: "transparent",
  "& .MuiTooltip-arrow": { display: "none" },
};

// ─── Main Component ───

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

      {(armorPieces.length > 0 ||
        accessories.length > 0 ||
        bracelet.length > 0 ||
        stone.length > 0) && (
        <TwoColumnGrid>
          <Column>
            {armorAvg !== null && (
              <ColumnHeader>
                <QualityLabel>품질</QualityLabel>
                <QualityAvg $quality={armorAvg}>{armorAvg}</QualityAvg>
              </ColumnHeader>
            )}
            {armorPieces.map((item, i) => (
              <ArmorRow key={i} equipment={item} />
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
              <AccessoryRow key={i} equipment={item} />
            ))}
            {bracelet.length > 0 && (
              <>
                <ThinDivider />
                {bracelet.map((item, i) => (
                  <BraceletRow key={i} equipment={item} />
                ))}
              </>
            )}
            {stone.length > 0 && (
              <>
                <ThinDivider />
                {stone.map((item, i) => (
                  <StoneRow key={i} equipment={item} />
                ))}
              </>
            )}
          </Column>
        </TwoColumnGrid>
      )}

      {(elixirItems.length > 0 || jewel.length > 0) && (
        <>
          <Divider />
          <BottomRow>
            {elixirItems.map((item, i) => (
              <ElixirItemRow key={`elixir-${i}`} equipment={item} />
            ))}
            {jewel.map((item, i) => (
              <JewelRow key={`jewel-${i}`} equipment={item} />
            ))}
          </BottomRow>
        </>
      )}
    </Section>
  );
};

export default EquipmentSection;

// ─── Row Sub-components ───

interface RowProps {
  equipment: ArmoryEquipment;
}

const ArmorRow: FC<RowProps> = ({ equipment }) => {
  const quality = extractQuality(equipment.Tooltip);
  const gradeColor = getGradeColor(equipment.Grade);
  const enhance = extractEnhanceLevel(equipment.Name);
  const tierInfo = extractItemTierAndLevel(equipment.Tooltip);
  const specialName = extractSpecialName(equipment.Name);

  return (
    <Tooltip title={buildTooltipTitle(equipment)} placement="left" arrow={false} enterDelay={200} leaveDelay={0} componentsProps={{ tooltip: { sx: tooltipSx } }}>
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
    </Tooltip>
  );
};

const AccessoryRow: FC<RowProps> = ({ equipment }) => {
  const quality = extractQuality(equipment.Tooltip);
  const gradeColor = getGradeColor(equipment.Grade);
  const enhance = extractEnhanceLevel(equipment.Name);
  const tierInfo = extractItemTierAndLevel(equipment.Tooltip);
  const stats = extractAccessoryStats(equipment.Tooltip);

  return (
    <Tooltip title={buildTooltipTitle(equipment)} placement="left" arrow={false} enterDelay={200} leaveDelay={0} componentsProps={{ tooltip: { sx: tooltipSx } }}>
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
              {stats.map((stat, i) => {
                const grade = getAccessoryEffectGrade(equipment.Type, stat);
                return (
                  <span key={i}>
                    {i > 0 && <EffectSep>|</EffectSep>}
                    {grade && <GradeBadge $grade={grade}>{grade}</GradeBadge>}
                    <StatText>{stat}</StatText>
                  </span>
                );
              })}
            </EffectLine>
          )}
        </EquipInfo>
      </EquipRowWrapper>
    </Tooltip>
  );
};

const BraceletRow: FC<RowProps> = ({ equipment }) => {
  const gradeColor = getGradeColor(equipment.Grade);
  const stats = extractBraceletStats(equipment.Tooltip);

  return (
    <Tooltip title={buildTooltipTitle(equipment)} placement="left" arrow={false} enterDelay={200} leaveDelay={0} componentsProps={{ tooltip: { sx: tooltipSx } }}>
      <EquipRowWrapper>
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
    </Tooltip>
  );
};

const StoneRow: FC<RowProps> = ({ equipment }) => {
  const gradeColor = getGradeColor(equipment.Grade);
  const tierInfo = extractItemTierAndLevel(equipment.Tooltip);
  const engravings = extractStoneEngravings(equipment.Tooltip);

  return (
    <Tooltip title={buildTooltipTitle(equipment)} placement="left" arrow={false} enterDelay={200} leaveDelay={0} componentsProps={{ tooltip: { sx: tooltipSx } }}>
      <EquipRowWrapper>
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
    </Tooltip>
  );
};

const JewelRow: FC<RowProps> = ({ equipment }) => {
  const gradeColor = getGradeColor(equipment.Grade);

  return (
    <Tooltip title={buildTooltipTitle(equipment)} placement="left" arrow={false} enterDelay={200} leaveDelay={0} componentsProps={{ tooltip: { sx: tooltipSx } }}>
      <EquipRowWrapper>
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
      </EquipRowWrapper>
    </Tooltip>
  );
};

const ElixirItemRow: FC<RowProps> = ({ equipment }) => {
  const gradeColor = getGradeColor(equipment.Grade);

  return (
    <Tooltip title={buildTooltipTitle(equipment)} placement="left" arrow={false} enterDelay={200} leaveDelay={0} componentsProps={{ tooltip: { sx: tooltipSx } }}>
      <EquipRowWrapper>
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
    </Tooltip>
  );
};

// ─── Tooltip Section Renderer ───

const TtSectionRenderer: FC<{ section: TooltipSection }> = ({ section }) => {
  switch (section.sectionType) {
    case "text":
      return (
        <TtTextBlock>
          {section.lines.map((line, i) => (
            <TtTextLine
              key={i}
              dangerouslySetInnerHTML={{ __html: fontToSpan(line) }}
            />
          ))}
        </TtTextBlock>
      );

    case "partbox":
      return (
        <TtPartBox>
          <TtPartTitle>{section.title}</TtPartTitle>
          {section.lines.map((line, i) => (
            <TtPartLine
              key={i}
              dangerouslySetInnerHTML={{ __html: fontToSpan(line) }}
            />
          ))}
        </TtPartBox>
      );

    case "indent":
      return (
        <TtIndentBlock>
          {section.label && (
            <TtIndentLabel
              dangerouslySetInnerHTML={{ __html: fontToSpan(section.label) }}
            />
          )}
          {section.items.map((item, i) => (
            <TtIndentItem
              key={i}
              dangerouslySetInnerHTML={{ __html: fontToSpan(item) }}
            />
          ))}
        </TtIndentBlock>
      );

    case "progress":
      if (section.current === 0 && section.max === 0) return null;
      return (
        <TtProgressBlock>
          {section.title && (
            <TtProgressTitle
              dangerouslySetInnerHTML={{ __html: fontToSpan(section.title) }}
            />
          )}
          <TtProgressBarOuter>
            <TtProgressBarInner
              style={{
                width:
                  section.max > 0
                    ? `${(section.current / section.max) * 100}%`
                    : "0%",
              }}
            />
          </TtProgressBarOuter>
          <TtProgressText>
            {section.current.toLocaleString()} / {section.max.toLocaleString()}
          </TtProgressText>
        </TtProgressBlock>
      );

    case "set":
      return (
        <TtTextBlock>
          <TtTextLine>{section.text}</TtTextLine>
        </TtTextBlock>
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

const ThinDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  margin: 4px 0;
`;

const BottomRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
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

const EffectSep = styled.span`
  color: ${({ theme }) => theme.app.text.light2};
  margin: 0 2px;
`;

const gradeBgColor = (grade: string): string => {
  if (grade === "상") return "#F59E0B";
  if (grade === "중") return "#A855F7";
  return "#3B82F6";
};

const GradeBadge = styled.span<{ $grade: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $grade }) => gradeBgColor($grade)};
  color: #fff;
  font-weight: 700;
  font-size: 9px;
  width: 16px;
  height: 14px;
  border-radius: 2px;
  margin-right: 3px;
  flex-shrink: 0;
`;

const StatText = styled.span`
  color: ${({ theme }) => theme.app.text.dark1};
  white-space: nowrap;
`;

const BraceletEffectLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 6px;
  font-size: 10px;
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

// ─── Hover Tooltip Styled Components ───

const TooltipContent = styled.div`
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(20, 20, 30, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #ddd;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  max-height: 70vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const TooltipItemName = styled.div`
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const TooltipHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 6px 0;
`;

const TooltipIconBox = styled.div<{ $gradeColor: string }>`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 6px;
  border: 2px solid ${({ $gradeColor }) => $gradeColor};
  overflow: hidden;
  flex-shrink: 0;
  background: #1a1a2e;
`;

const TooltipHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
`;

const TtGradeLine = styled.div`
  font-size: 12px;
  color: #bbb;
  line-height: 1.4;
`;

const TtTierLine = styled.div`
  font-size: 11px;
  color: #999;
`;

const TtQualityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #999;
  margin-top: 2px;
`;

const TtQualityBar = styled.div`
  flex: 1;
  height: 5px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
  max-width: 100px;
`;

const TtTextBlock = styled.div`
  padding: 3px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const TtTextLine = styled.div`
  font-size: 11px;
  color: #bbb;
  line-height: 1.5;

  span {
    font-weight: 500;
  }
`;

const TtPartBox = styled.div`
  padding: 4px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const TtPartTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #e8c77b;
  margin-bottom: 3px;
`;

const TtPartLine = styled.div`
  font-size: 11px;
  color: #ccc;
  line-height: 1.5;
`;

const TtIndentBlock = styled.div`
  padding: 3px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const TtIndentLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #ddd;
  margin-bottom: 2px;
  line-height: 1.4;
`;

const TtIndentItem = styled.div`
  font-size: 11px;
  color: #bbb;
  padding-left: 10px;
  line-height: 1.5;
`;

const TtProgressBlock = styled.div`
  padding: 4px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const TtProgressTitle = styled.div`
  font-size: 11px;
  color: #bbb;
  margin-bottom: 3px;
`;

const TtProgressBarOuter = styled.div`
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
`;

const TtProgressBarInner = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 3px;
  transition: width 0.3s;
`;

const TtProgressText = styled.div`
  font-size: 10px;
  color: #888;
  text-align: right;
  margin-top: 1px;
`;
