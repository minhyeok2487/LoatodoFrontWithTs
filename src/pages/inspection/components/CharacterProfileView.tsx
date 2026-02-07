import { useMemo } from "react";
import styled from "styled-components";

import useInspectionDetail from "@core/hooks/queries/inspection/useInspectionDetail";
import type {
  InspectionCharacter,
  EquipmentHistory,
  ArkgridEffect,
} from "@core/types/inspection";

interface Props {
  character: InspectionCharacter;
  onClose: () => void;
}

const GRADE_COLORS: Record<string, string> = {
  고대: "#E3C7A1",
  유물: "#FA5D00",
  전설: "#F99200",
  영웅: "#8045DD",
  희귀: "#2AB1F6",
  고급: "#91FE02",
  일반: "#CCCCCC",
};

const getGradeColor = (grade?: string | null): string =>
  (grade && GRADE_COLORS[grade]) || "#666";

const getQualityColor = (quality: number): string => {
  if (quality === 100) return "#FF6600";
  if (quality >= 90) return "#9B59B6";
  if (quality >= 70) return "#2E86C1";
  if (quality >= 30) return "#27AE60";
  return "#F1C40F";
};

const ARMOR_SLOTS = ["투구", "어깨", "상의", "하의", "장갑", "무기"];
const ACCESSORY_SLOTS = ["목걸이", "귀걸이1", "귀걸이2", "반지1", "반지2"];
const OTHER_SLOTS = ["어빌리티 스톤", "팔찌"];

const formatRefinement = (equip: EquipmentHistory): string => {
  let text = "";
  if (equip.refinement != null && equip.refinement > 0) {
    text += `+${equip.refinement}강`;
  }
  if (equip.advancedRefinement != null && equip.advancedRefinement > 0) {
    text += ` (+상재${equip.advancedRefinement})`;
  }
  return text;
};

type EquipChangeType = "upgraded" | "downgraded" | "changed" | "new" | "removed" | "unchanged";

interface EquipDiff {
  type: string;
  current: EquipmentHistory | null;
  previous: EquipmentHistory | null;
  changeType: EquipChangeType;
  changes: string[];
}

const CharacterProfileView = ({ character, onClose }: Props) => {
  const { data } = useInspectionDetail(character.id);

  const { latestHistory, previousHistory } = useMemo(() => {
    if (!data?.histories || data.histories.length === 0)
      return { latestHistory: null, previousHistory: null };
    const sorted = [...data.histories].sort(
      (a, b) =>
        new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
    );
    return {
      latestHistory: sorted[0],
      previousHistory: sorted.length > 1 ? sorted[1] : null,
    };
  }, [data]);

  const equipMap = useMemo(() => {
    const map = new Map<string, EquipmentHistory>();
    (latestHistory?.equipments ?? []).forEach((e) => map.set(e.type, e));
    return map;
  }, [latestHistory]);

  const equipDiffs = useMemo((): EquipDiff[] => {
    const currentEquips = latestHistory?.equipments ?? [];
    const prevEquips = previousHistory?.equipments ?? [];
    if (currentEquips.length === 0) return [];

    const prevMap = new Map<string, EquipmentHistory>();
    prevEquips.forEach((e) => prevMap.set(e.type, e));

    return currentEquips.map((equip) => {
      const prev = prevMap.get(equip.type);
      if (!prev || prevEquips.length === 0) {
        return {
          type: equip.type,
          current: equip,
          previous: null,
          changeType: "unchanged" as EquipChangeType,
          changes: [],
        };
      }
      const changes: string[] = [];
      if (equip.name !== prev.name) changes.push("장비 교체");
      if (equip.quality != null && prev.quality != null && equip.quality !== prev.quality) {
        const diff = equip.quality - prev.quality;
        changes.push(`품질 ${diff > 0 ? "+" : ""}${diff}`);
      }
      if (equip.refinement != null && prev.refinement != null && equip.refinement !== prev.refinement) {
        changes.push(`재련 ${prev.refinement} → ${equip.refinement}`);
      }
      if (equip.advancedRefinement != null && prev.advancedRefinement != null && equip.advancedRefinement !== prev.advancedRefinement) {
        changes.push(`상재 ${prev.advancedRefinement} → ${equip.advancedRefinement}`);
      }
      const changeType: EquipChangeType = changes.length === 0 ? "unchanged" : "changed";
      return { type: equip.type, current: equip, previous: prev, changeType, changes };
    });
  }, [latestHistory, previousHistory]);

  const changedDiffs = equipDiffs.filter((d) => d.changeType !== "unchanged");

  const { currentEffects, prevEffectsMap } = useMemo(() => {
    const current = latestHistory?.arkgridEffects ?? [];
    const prevMap = new Map<string, ArkgridEffect>();
    (previousHistory?.arkgridEffects ?? []).forEach((e) =>
      prevMap.set(e.effectName, e)
    );
    return { currentEffects: current, prevEffectsMap: prevMap };
  }, [latestHistory, previousHistory]);

  const renderEquipSlot = (slotName: string) => {
    const equip = equipMap.get(slotName);
    if (!equip) return <EmptySlot key={slotName}>{slotName}</EmptySlot>;

    const gradeColor = getGradeColor(equip.grade);
    const refinementText = formatRefinement(equip);
    const diff = equipDiffs.find((d) => d.type === slotName);
    const hasChange = diff && diff.changeType !== "unchanged";

    return (
      <EquipSlot key={slotName} $hasChange={!!hasChange}>
        <EquipIcon $gradeColor={gradeColor}>
          {equip.icon ? (
            <img src={equip.icon} alt={slotName} />
          ) : (
            <PlaceholderIcon>{slotName[0]}</PlaceholderIcon>
          )}
        </EquipIcon>

        <EquipDetails>
          <EquipNameRow>
            <EquipName $gradeColor={gradeColor}>
              {equip.name}
            </EquipName>
            {refinementText && (
              <RefinementText>{refinementText}</RefinementText>
            )}
          </EquipNameRow>

          {equip.quality != null && (
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

          {equip.basicEffect && (
            <EffectText>{equip.basicEffect}</EffectText>
          )}

          {hasChange && diff && (
            <ChangeIndicator>
              {diff.changes.join(", ")}
            </ChangeIndicator>
          )}
        </EquipDetails>
      </EquipSlot>
    );
  };

  const renderAccessorySlot = (slotName: string) => {
    const equip = equipMap.get(slotName);
    if (!equip) return <EmptySlot key={slotName}>{slotName}</EmptySlot>;

    const gradeColor = getGradeColor(equip.grade);
    const diff = equipDiffs.find((d) => d.type === slotName);
    const hasChange = diff && diff.changeType !== "unchanged";

    return (
      <EquipSlot key={slotName} $hasChange={!!hasChange}>
        <EquipIcon $gradeColor={gradeColor}>
          {equip.icon ? (
            <img src={equip.icon} alt={slotName} />
          ) : (
            <PlaceholderIcon>{slotName[0]}</PlaceholderIcon>
          )}
        </EquipIcon>
        <EquipDetails>
          <EquipNameRow>
            <EquipName $gradeColor={gradeColor}>{equip.name}</EquipName>
          </EquipNameRow>
          {equip.quality != null && (
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
          {equip.grindingEffect && (
            <EffectText>{equip.grindingEffect}</EffectText>
          )}
          {equip.engravings && <EffectText>{equip.engravings}</EffectText>}
          {hasChange && diff && (
            <ChangeIndicator>{diff.changes.join(", ")}</ChangeIndicator>
          )}
        </EquipDetails>
      </EquipSlot>
    );
  };

  const renderOtherSlot = (slotName: string) => {
    const equip = equipMap.get(slotName);
    if (!equip) return null;

    const gradeColor = getGradeColor(equip.grade);

    return (
      <EquipSlot key={slotName} $hasChange={false}>
        <EquipIcon $gradeColor={gradeColor}>
          {equip.icon ? (
            <img src={equip.icon} alt={slotName} />
          ) : (
            <PlaceholderIcon>{slotName[0]}</PlaceholderIcon>
          )}
        </EquipIcon>
        <EquipDetails>
          <EquipNameRow>
            <EquipName $gradeColor={gradeColor}>{equip.name}</EquipName>
          </EquipNameRow>
          {slotName === "어빌리티 스톤" && equip.engravings && (
            <EffectText>{equip.engravings}</EffectText>
          )}
          {slotName === "팔찌" && equip.braceletEffect && (
            <EffectText>{equip.braceletEffect}</EffectText>
          )}
        </EquipDetails>
      </EquipSlot>
    );
  };

  return (
    <ProfileWrapper>
      {/* Header */}
      <ProfileHeader>
        <HeaderLeft>
          {character.characterImage && (
            <CharacterAvatar
              src={character.characterImage}
              alt={character.characterName}
            />
          )}
          <HeaderInfo>
            <CharacterNameLarge>{character.characterName}</CharacterNameLarge>
            <CharacterMeta>
              {character.serverName} / {character.characterClassName}
            </CharacterMeta>
          </HeaderInfo>
        </HeaderLeft>

        <HeaderStats>
          <HeaderStatItem>
            <HeaderStatLabel>아이템 Lv</HeaderStatLabel>
            <HeaderStatValue>
              {character.itemLevel.toLocaleString()}
            </HeaderStatValue>
          </HeaderStatItem>
          <HeaderStatItem>
            <HeaderStatLabel>전투력</HeaderStatLabel>
            <HeaderStatValue>
              {character.combatPower.toLocaleString()}
            </HeaderStatValue>
          </HeaderStatItem>
          {character.previousCombatPower !== null && (
            <HeaderStatItem>
              <HeaderStatLabel>전일 대비</HeaderStatLabel>
              <HeaderStatChange $isPositive={character.combatPowerChange > 0}>
                {character.combatPowerChange > 0 ? "+" : ""}
                {character.combatPowerChange.toLocaleString()}
              </HeaderStatChange>
            </HeaderStatItem>
          )}
        </HeaderStats>

        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ProfileHeader>

      {/* Main Content */}
      <ProfileBody>
        {/* Equipment Panel */}
        {(latestHistory?.equipments ?? []).length > 0 && (
          <EquipmentPanel>
            <SectionTitle>방어구 / 무기</SectionTitle>
            <SlotList>
              {ARMOR_SLOTS.map((slot) => renderEquipSlot(slot))}
            </SlotList>

            <SectionTitle>악세서리</SectionTitle>
            <SlotList>
              {ACCESSORY_SLOTS.map((slot) => renderAccessorySlot(slot))}
            </SlotList>

            {OTHER_SLOTS.some((s) => equipMap.has(s)) && (
              <>
                <SectionTitle>기타</SectionTitle>
                <SlotList>
                  {OTHER_SLOTS.map((slot) => renderOtherSlot(slot))}
                </SlotList>
              </>
            )}
          </EquipmentPanel>
        )}

        {/* Right Panel: Arkgrid + Changes */}
        <RightPanel>
          {/* Arkgrid Effects */}
          {currentEffects.length > 0 && (
            <ArkgridSection>
              <SectionTitle>아크 그리드</SectionTitle>
              <ArkgridGrid>
                {currentEffects.map((effect, idx) => {
                  const prev = prevEffectsMap.get(effect.effectName);
                  const levelChanged =
                    prev && prev.effectLevel !== effect.effectLevel;
                  const isNew = !prev && previousHistory != null;

                  return (
                    <ArkgridItem key={idx} $changed={!!levelChanged || !!isNew}>
                      <ArkgridName>{effect.effectName}</ArkgridName>
                      <ArkgridLevel>
                        Lv.{effect.effectLevel}
                        {levelChanged && prev && (
                          <ArkgridDiff
                            $positive={effect.effectLevel > prev.effectLevel}
                          >
                            {effect.effectLevel > prev.effectLevel ? " ↑" : " ↓"}
                          </ArkgridDiff>
                        )}
                        {isNew && <ArkgridNewBadge>NEW</ArkgridNewBadge>}
                      </ArkgridLevel>
                    </ArkgridItem>
                  );
                })}
              </ArkgridGrid>
            </ArkgridSection>
          )}

          {/* Changes Summary */}
          <ChangesSection>
            <SectionTitle>전일 대비 변화</SectionTitle>
            {changedDiffs.length > 0 ? (
              <ChangesList>
                {changedDiffs.map((diff) => (
                  <ChangeEntry key={diff.type}>
                    <ChangeSlotName>{diff.type}</ChangeSlotName>
                    <ChangeDetail>
                      {diff.changes.join(", ")}
                    </ChangeDetail>
                  </ChangeEntry>
                ))}
              </ChangesList>
            ) : (
              <NoChanges>전일 대비 변동 없음</NoChanges>
            )}
          </ChangesSection>

          {latestHistory && (
            <RecordDate>
              {latestHistory.recordDate} 기준
            </RecordDate>
          )}
        </RightPanel>
      </ProfileBody>
    </ProfileWrapper>
  );
};

export default CharacterProfileView;

/* ===== Styled Components ===== */

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #1a1a2e;
  border-radius: 10px;
  overflow: hidden;
  color: #e0e0e0;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
  border-bottom: 1px solid #2a2a4a;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
`;

const CharacterAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #3a3a5a;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CharacterNameLarge = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
`;

const CharacterMeta = styled.span`
  font-size: 13px;
  color: #8888aa;
`;

const HeaderStats = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const HeaderStatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const HeaderStatLabel = styled.span`
  font-size: 11px;
  color: #8888aa;
`;

const HeaderStatValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;

const HeaderStatChange = styled.span<{ $isPositive: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $isPositive }) => ($isPositive ? "#16a34a" : "#dc2626")};
`;

const CloseButton = styled.button`
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #8888aa;
  background: transparent;
  border: 1px solid #3a3a5a;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    border-color: #5a5a7a;
  }
`;

const ProfileBody = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px 24px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const EquipmentPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`;

const SectionTitle = styled.h5`
  font-size: 14px;
  font-weight: 700;
  color: #aaaacc;
  margin: 0;
  padding-bottom: 4px;
  border-bottom: 1px solid #2a2a4a;
`;

const SlotList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const EquipSlot = styled.div<{ $hasChange: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px;
  background: ${({ $hasChange }) =>
    $hasChange ? "rgba(202, 138, 4, 0.08)" : "rgba(255, 255, 255, 0.03)"};
  border-radius: 6px;
  border-left: 3px solid
    ${({ $hasChange }) => ($hasChange ? "#ca8a04" : "transparent")};
`;

const EquipIcon = styled.div<{ $gradeColor: string }>`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 2px solid ${({ $gradeColor }) => $gradeColor};
  overflow: hidden;
  flex-shrink: 0;
  background: #0e0e1a;

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
  color: #555;
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
`;

const RefinementText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #ffcc00;
`;

const QualityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const QualityBar = styled.div`
  flex: 1;
  height: 4px;
  background: #2a2a4a;
  border-radius: 2px;
  max-width: 100px;
  overflow: hidden;
`;

const QualityFill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  border-radius: 2px;
  transition: width 0.3s;
`;

const QualityValue = styled.span<{ $color: string }>`
  font-size: 12px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  min-width: 24px;
`;

const EffectText = styled.span`
  font-size: 11px;
  color: #7777aa;
  line-height: 1.3;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ChangeIndicator = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #ca8a04;
`;

const EmptySlot = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: 12px;
  color: #555;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
`;

/* Arkgrid */

const ArkgridSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ArkgridGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 6px;
`;

const ArkgridItem = styled.div<{ $changed: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: ${({ $changed }) =>
    $changed ? "rgba(22, 163, 74, 0.1)" : "rgba(255, 255, 255, 0.03)"};
  border-radius: 4px;
  border-left: 2px solid
    ${({ $changed }) => ($changed ? "#16a34a" : "transparent")};
`;

const ArkgridName = styled.span`
  font-size: 12px;
  color: #ccccee;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArkgridLevel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 2px;
`;

const ArkgridDiff = styled.span<{ $positive: boolean }>`
  font-size: 11px;
  color: ${({ $positive }) => ($positive ? "#16a34a" : "#dc2626")};
`;

const ArkgridNewBadge = styled.span`
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: #16a34a;
  padding: 1px 4px;
  border-radius: 2px;
  margin-left: 4px;
`;

/* Changes Summary */

const ChangesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ChangesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChangeEntry = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(202, 138, 4, 0.08);
  border-radius: 4px;
  border-left: 2px solid #ca8a04;
`;

const ChangeSlotName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #ccccee;
  white-space: nowrap;
`;

const ChangeDetail = styled.span`
  font-size: 12px;
  color: #ca8a04;
`;

const NoChanges = styled.div`
  padding: 12px;
  font-size: 13px;
  color: #666;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
`;

const RecordDate = styled.span`
  font-size: 11px;
  color: #555;
  text-align: right;
`;
