import { useMemo } from "react";
import styled from "styled-components";

import useInspectionDetail from "@core/hooks/queries/inspection/useInspectionDetail";

interface Props {
  inspectionCharacterId: number;
}

const ArkgridEffectsTable = ({ inspectionCharacterId }: Props) => {
  const { data } = useInspectionDetail(inspectionCharacterId);

  const latestHistory = useMemo(() => {
    if (!data?.histories || data.histories.length === 0) return null;
    return [...data.histories].sort(
      (a, b) =>
        new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
    )[0];
  }, [data]);

  const effects = latestHistory?.arkgridEffects ?? [];

  if (effects.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <Title>아크그리드 효과</Title>
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
          {effects.map((effect, index) => (
            <tr key={index}>
              <Td>{effect.effectName}</Td>
              <Td $align="center">{effect.effectLevel}</Td>
              <Td
                $muted
                dangerouslySetInnerHTML={{
                  __html: effect.effectTooltip || "-",
                }}
              />
            </tr>
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

const Title = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.main};
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

const Td = styled.td<{ $align?: string; $muted?: boolean }>`
  padding: 8px 12px;
  font-size: 13px;
  text-align: ${({ $align }) => $align || "left"};
  color: ${({ theme, $muted }) =>
    $muted ? theme.app.text.light2 : theme.app.text.main};
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
  word-break: break-word;
`;
