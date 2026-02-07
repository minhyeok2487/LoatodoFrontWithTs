import { useMemo } from "react";
import styled from "styled-components";

import useInspectionDetail from "@core/hooks/queries/inspection/useInspectionDetail";
import type { ArkgridEffect } from "@core/types/inspection";

type ChangeType = "increased" | "decreased" | "new" | "removed" | "unchanged";

interface EffectRow {
  effectName: string;
  effectLevel: number;
  effectTooltip: string;
  changeType: ChangeType;
  prevLevel?: number;
}

interface Props {
  inspectionCharacterId: number;
}

const ArkgridEffectsTable = ({ inspectionCharacterId }: Props) => {
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

  const effectRows: EffectRow[] = useMemo(() => {
    const currentEffects = latestHistory?.arkgridEffects ?? [];
    const prevEffects = previousHistory?.arkgridEffects ?? [];

    if (prevEffects.length === 0) {
      return currentEffects.map((e) => ({
        effectName: e.effectName,
        effectLevel: e.effectLevel,
        effectTooltip: e.effectTooltip,
        changeType: "unchanged" as ChangeType,
      }));
    }

    const prevMap = new Map<string, ArkgridEffect>();
    prevEffects.forEach((e) => prevMap.set(e.effectName, e));

    const currentNames = new Set(currentEffects.map((e) => e.effectName));

    const rows: EffectRow[] = currentEffects.map((e) => {
      const prev = prevMap.get(e.effectName);
      if (!prev) {
        return {
          effectName: e.effectName,
          effectLevel: e.effectLevel,
          effectTooltip: e.effectTooltip,
          changeType: "new" as ChangeType,
        };
      }
      let changeType: ChangeType = "unchanged";
      if (e.effectLevel > prev.effectLevel) changeType = "increased";
      else if (e.effectLevel < prev.effectLevel) changeType = "decreased";
      return {
        effectName: e.effectName,
        effectLevel: e.effectLevel,
        effectTooltip: e.effectTooltip,
        changeType,
        prevLevel: prev.effectLevel !== e.effectLevel ? prev.effectLevel : undefined,
      };
    });

    prevEffects.forEach((e) => {
      if (!currentNames.has(e.effectName)) {
        rows.push({
          effectName: e.effectName,
          effectLevel: e.effectLevel,
          effectTooltip: e.effectTooltip,
          changeType: "removed",
        });
      }
    });

    return rows;
  }, [latestHistory, previousHistory]);

  if (effectRows.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <HeaderRow>
        <Title>아크그리드 효과</Title>
        {previousHistory && (
          <CompareInfo>
            {previousHistory.recordDate} 대비
          </CompareInfo>
        )}
      </HeaderRow>
      <DateInfo>{latestHistory?.recordDate} 기준</DateInfo>

      <Table>
        <thead>
          <tr>
            <Th>효과명</Th>
            <Th $align="center">레벨</Th>
            <Th>설명</Th>
          </tr>
        </thead>
        <tbody>
          {effectRows.map((row, index) => (
            <TableRow key={index} $changeType={row.changeType}>
              <Td>
                <EffectNameCell>
                  {row.changeType === "removed" ? (
                    <RemovedText>{row.effectName}</RemovedText>
                  ) : (
                    row.effectName
                  )}
                  {row.changeType === "new" && <NewBadge>NEW</NewBadge>}
                </EffectNameCell>
              </Td>
              <Td $align="center">
                {row.changeType === "removed" ? (
                  <RemovedText>Lv.{row.effectLevel}</RemovedText>
                ) : (
                  <LevelCell>
                    {row.prevLevel !== undefined && (
                      <>
                        <PrevLevel>Lv.{row.prevLevel}</PrevLevel>
                        <Arrow $type={row.changeType}>→</Arrow>
                      </>
                    )}
                    <span>Lv.{row.effectLevel}</span>
                    {row.changeType === "increased" && (
                      <ChangeIndicator $type="increased">↑</ChangeIndicator>
                    )}
                    {row.changeType === "decreased" && (
                      <ChangeIndicator $type="decreased">↓</ChangeIndicator>
                    )}
                  </LevelCell>
                )}
              </Td>
              <Td
                $muted
                dangerouslySetInnerHTML={{
                  __html:
                    row.changeType === "removed"
                      ? `<s style="opacity:0.5">${row.effectTooltip || "-"}</s>`
                      : row.effectTooltip || "-",
                }}
              />
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default ArkgridEffectsTable;

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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 4px;
`;

const Th = styled.th<{ $align?: string }>`
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  text-align: ${({ $align }) => $align || "left"};
  color: ${({ theme }) => theme.app.text.light1};
  border-bottom: 2px solid ${({ theme }) => theme.app.border};
`;

const getRowBackground = (changeType: ChangeType) => {
  switch (changeType) {
    case "increased":
      return "rgba(22, 163, 74, 0.05)";
    case "decreased":
      return "rgba(220, 38, 38, 0.05)";
    case "new":
      return "rgba(22, 163, 74, 0.08)";
    case "removed":
      return "rgba(107, 114, 128, 0.05)";
    default:
      return "transparent";
  }
};

const TableRow = styled.tr<{ $changeType: ChangeType }>`
  background: ${({ $changeType }) => getRowBackground($changeType)};
`;

const Td = styled.td<{ $align?: string; $muted?: boolean }>`
  padding: 8px 12px;
  font-size: 13px;
  text-align: ${({ $align }) => $align || "left"};
  color: ${({ theme, $muted }) =>
    $muted ? theme.app.text.light2 : theme.app.text.main};
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
  word-break: break-word;
`;

const EffectNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NewBadge = styled.span`
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: #16a34a;
  border-radius: 3px;
  white-space: nowrap;
`;

const RemovedText = styled.span`
  text-decoration: line-through;
  opacity: 0.5;
`;

const LevelCell = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const PrevLevel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const Arrow = styled.span<{ $type: ChangeType }>`
  font-size: 12px;
  color: ${({ $type }) =>
    $type === "increased" ? "#16a34a" : $type === "decreased" ? "#dc2626" : "inherit"};
`;

const ChangeIndicator = styled.span<{ $type: "increased" | "decreased" }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $type }) => ($type === "increased" ? "#16a34a" : "#dc2626")};
`;
