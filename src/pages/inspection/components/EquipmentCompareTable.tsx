import { useMemo } from "react";
import styled from "styled-components";

import useInspectionDetail from "@core/hooks/queries/inspection/useInspectionDetail";
import type { EquipmentHistory } from "@core/types/inspection";

type ChangeType = "changed" | "upgraded" | "downgraded" | "new" | "removed" | "unchanged";

interface EquipmentRow {
  type: string;
  current: EquipmentHistory | null;
  previous: EquipmentHistory | null;
  changeType: ChangeType;
  changes: string[];
}

interface Props {
  inspectionCharacterId: number;
}

const SLOT_ORDER = [
  "무기", "투구", "상의", "하의", "장갑", "어깨",
  "목걸이", "귀걸이1", "귀걸이2", "반지1", "반지2",
  "팔찌", "어빌리티 스톤",
];

const getSlotOrder = (type: string): number => {
  const idx = SLOT_ORDER.indexOf(type);
  return idx >= 0 ? idx : SLOT_ORDER.length;
};

const compareEquipment = (
  current: EquipmentHistory,
  previous: EquipmentHistory
): { changeType: ChangeType; changes: string[] } => {
  const changes: string[] = [];

  if (current.name !== previous.name) {
    changes.push(`장비 교체: ${previous.name} → ${current.name}`);
  }

  if (current.quality != null && previous.quality != null && current.quality !== previous.quality) {
    const diff = current.quality - previous.quality;
    changes.push(`품질 ${diff > 0 ? "+" : ""}${diff} (${previous.quality} → ${current.quality})`);
  }

  if (current.refinement != null && previous.refinement != null && current.refinement !== previous.refinement) {
    changes.push(`재련 ${previous.refinement}단계 → ${current.refinement}단계`);
  }

  if (current.advancedRefinement != null && previous.advancedRefinement != null && current.advancedRefinement !== previous.advancedRefinement) {
    changes.push(`상재 ${previous.advancedRefinement}단계 → ${current.advancedRefinement}단계`);
  }

  if (current.itemLevel != null && previous.itemLevel != null && current.itemLevel !== previous.itemLevel) {
    changes.push(`아이템 레벨 ${previous.itemLevel} → ${current.itemLevel}`);
  }

  if (changes.length === 0) {
    return { changeType: "unchanged", changes };
  }

  const qualityUp = current.quality != null && previous.quality != null && current.quality > previous.quality;
  const refinementUp = current.refinement != null && previous.refinement != null && current.refinement > previous.refinement;
  const qualityDown = current.quality != null && previous.quality != null && current.quality < previous.quality;

  if (refinementUp || qualityUp) return { changeType: "upgraded", changes };
  if (qualityDown) return { changeType: "downgraded", changes };
  return { changeType: "changed", changes };
};

const EquipmentCompareTable = ({ inspectionCharacterId }: Props) => {
  const { data } = useInspectionDetail(inspectionCharacterId);

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

  const equipmentRows: EquipmentRow[] = useMemo(() => {
    const currentEquips = latestHistory?.equipments ?? [];
    const prevEquips = previousHistory?.equipments ?? [];

    if (currentEquips.length === 0) return [];

    const prevMap = new Map<string, EquipmentHistory>();
    prevEquips.forEach((e) => prevMap.set(e.type, e));

    const currentTypes = new Set(currentEquips.map((e) => e.type));

    const rows: EquipmentRow[] = currentEquips.map((equip) => {
      const prev = prevMap.get(equip.type);
      if (!prev || prevEquips.length === 0) {
        return {
          type: equip.type,
          current: equip,
          previous: null,
          changeType: prevEquips.length === 0 ? "unchanged" as ChangeType : "new" as ChangeType,
          changes: prevEquips.length === 0 ? [] : ["새로운 장비 슬롯"],
        };
      }
      const { changeType, changes } = compareEquipment(equip, prev);
      return { type: equip.type, current: equip, previous: prev, changeType, changes };
    });

    prevEquips.forEach((equip) => {
      if (!currentTypes.has(equip.type)) {
        rows.push({
          type: equip.type,
          current: null,
          previous: equip,
          changeType: "removed",
          changes: ["장비 해제"],
        });
      }
    });

    rows.sort((a, b) => getSlotOrder(a.type) - getSlotOrder(b.type));
    return rows;
  }, [latestHistory, previousHistory]);

  if (equipmentRows.length === 0) {
    return null;
  }

  const hasChanges = equipmentRows.some((r) => r.changeType !== "unchanged");

  return (
    <Wrapper>
      <HeaderRow>
        <Title>장비 현황</Title>
        {previousHistory && hasChanges && (
          <CompareInfo>{previousHistory.recordDate} 대비</CompareInfo>
        )}
      </HeaderRow>
      <DateInfo>{latestHistory?.recordDate} 기준</DateInfo>

      <EquipmentGrid>
        {equipmentRows.map((row) => (
          <EquipmentCard key={row.type} $changeType={row.changeType}>
            <SlotHeader>
              {row.current?.icon && (
                <EquipmentIcon src={row.current.icon} alt={row.type} />
              )}
              <SlotInfo>
                <SlotType>{row.type}</SlotType>
                <EquipmentName $removed={row.changeType === "removed"}>
                  {row.current?.name ?? row.previous?.name ?? "-"}
                </EquipmentName>
              </SlotInfo>
              {row.changeType === "new" && <ChangeBadge $type="new">NEW</ChangeBadge>}
              {row.changeType === "removed" && <ChangeBadge $type="removed">해제</ChangeBadge>}
              {row.changeType === "upgraded" && <ChangeBadge $type="upgraded">강화</ChangeBadge>}
              {row.changeType === "downgraded" && <ChangeBadge $type="downgraded">하락</ChangeBadge>}
            </SlotHeader>

            {row.current && (
              <StatsGrid>
                {row.current.quality != null && (
                  <StatChip>
                    <StatChipLabel>품질</StatChipLabel>
                    <StatChipValue>{row.current.quality}</StatChipValue>
                  </StatChip>
                )}
                {row.current.refinement != null && row.current.refinement > 0 && (
                  <StatChip>
                    <StatChipLabel>재련</StatChipLabel>
                    <StatChipValue>{row.current.refinement}단계</StatChipValue>
                  </StatChip>
                )}
                {row.current.advancedRefinement != null && row.current.advancedRefinement > 0 && (
                  <StatChip>
                    <StatChipLabel>상재</StatChipLabel>
                    <StatChipValue>{row.current.advancedRefinement}단계</StatChipValue>
                  </StatChip>
                )}
                {row.current.itemLevel != null && (
                  <StatChip>
                    <StatChipLabel>레벨</StatChipLabel>
                    <StatChipValue>{row.current.itemLevel}</StatChipValue>
                  </StatChip>
                )}
              </StatsGrid>
            )}

            {row.changes.length > 0 && (
              <ChangeList>
                {row.changes.map((change, i) => (
                  <ChangeItem key={i} $changeType={row.changeType}>
                    {change}
                  </ChangeItem>
                ))}
              </ChangeList>
            )}
          </EquipmentCard>
        ))}
      </EquipmentGrid>
    </Wrapper>
  );
};

export default EquipmentCompareTable;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.main};
`;

const CompareInfo = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.light2};
  padding: 2px 8px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 4px;
`;

const DateInfo = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const EquipmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
  margin-top: 4px;

  ${({ theme }) => theme.medias.max600} {
    grid-template-columns: 1fr;
  }
`;

const getCardBorder = (changeType: ChangeType) => {
  switch (changeType) {
    case "upgraded":
      return "#16a34a";
    case "downgraded":
      return "#dc2626";
    case "new":
      return "#2563eb";
    case "removed":
      return "#9ca3af";
    case "changed":
      return "#ca8a04";
    default:
      return "transparent";
  }
};

const getCardBackground = (changeType: ChangeType) => {
  switch (changeType) {
    case "upgraded":
      return "rgba(22, 163, 74, 0.04)";
    case "downgraded":
      return "rgba(220, 38, 38, 0.04)";
    case "new":
      return "rgba(37, 99, 235, 0.04)";
    case "removed":
      return "rgba(107, 114, 128, 0.04)";
    case "changed":
      return "rgba(202, 138, 4, 0.04)";
    default:
      return "transparent";
  }
};

const EquipmentCard = styled.div<{ $changeType: ChangeType }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 6px;
  border-left: 3px solid
    ${({ $changeType, theme }) => {
      const color = getCardBorder($changeType);
      return color === "transparent" ? theme.app.border : color;
    }};
  background: ${({ $changeType }) => getCardBackground($changeType)};
`;

const SlotHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EquipmentIcon = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  object-fit: cover;
`;

const SlotInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
`;

const SlotType = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light2};
`;

const EquipmentName = styled.span<{ $removed?: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
  text-decoration: ${({ $removed }) => ($removed ? "line-through" : "none")};
  opacity: ${({ $removed }) => ($removed ? 0.5 : 1)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChangeBadge = styled.span<{
  $type: "new" | "removed" | "upgraded" | "downgraded";
}>`
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 3px;
  white-space: nowrap;
  color: #fff;
  background: ${({ $type }) => {
    switch ($type) {
      case "new":
        return "#2563eb";
      case "upgraded":
        return "#16a34a";
      case "downgraded":
        return "#dc2626";
      case "removed":
      default:
        return "#9ca3af";
    }
  }};
`;

const StatsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const StatChip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 4px;
`;

const StatChipLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const StatChipValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
`;

const ChangeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ChangeItem = styled.span<{ $changeType: ChangeType }>`
  font-size: 12px;
  color: ${({ $changeType }) => {
    switch ($changeType) {
      case "upgraded":
      case "new":
        return "#16a34a";
      case "downgraded":
      case "removed":
        return "#dc2626";
      case "changed":
        return "#ca8a04";
      default:
        return "inherit";
    }
  }};
`;
