import { useMemo } from "react";
import styled from "styled-components";

import useIsBelowWidth from "@core/hooks/useIsBelowWidth";

interface Props {
  children: string;
}

interface Parsed {
  raidName: string;
  hard: string;
  normal: string;
  none: string;
}

const RaidNameParser = ({ children }: Props) => {
  const isBelowWidth500 = useIsBelowWidth(500);
  const hardText = isBelowWidth500 ? "하" : "하드";
  const normalText = isBelowWidth500 ? "노" : "노말";

  const parsed = useMemo(() => {
    const [raidName, rest] = children.split("<br />");

    const result: Parsed = {
      raidName,
      normal:
        children
          .match(/(노말)(?<captured>(\s*\d)+)/)
          ?.groups?.captured.trim() || "",
      hard:
        children
          .match(/(하드)(?<captured>(\s*\d)+)/)
          ?.groups?.captured.trim() || "",
      none: rest,
    };

    return result;
  }, [children]);

  return (
    <Wrapper>
      <Row>{parsed.raidName}</Row>
      {(() => {
        if (parsed.hard && parsed.normal) {
          if (parsed.hard < parsed.normal) {
            return (
              <RowWithDifficulty>
                <Difficulty>
                  <Label $isHard>{hardText}</Label>
                  {parsed.hard}
                </Difficulty>
                <Difficulty>
                  <Label>{normalText}</Label>
                  {parsed.normal}
                </Difficulty>
              </RowWithDifficulty>
            );
          }
          return (
            <RowWithDifficulty>
              <Difficulty>
                <Label>{normalText}</Label>
                {parsed.normal}
              </Difficulty>
              <Difficulty>
                <Label $isHard>{hardText}</Label>
                {parsed.hard}
              </Difficulty>
            </RowWithDifficulty>
          );
        }

        if (parsed.hard) {
          return (
            <RowWithDifficulty>
              <Difficulty>
                <Label $isHard>{hardText}</Label>
                {parsed.hard}
              </Difficulty>
            </RowWithDifficulty>
          );
        }

        if (parsed.normal) {
          return (
            <RowWithDifficulty>
              <Difficulty>
                <Label>{normalText}</Label>
                {parsed.normal}
              </Difficulty>
            </RowWithDifficulty>
          );
        }

        return <Row>{parsed.none}</Row>;
      })()}
    </Wrapper>
  );
};

export default RaidNameParser;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  font-size: 14px;
  gap: 2px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const RowWithDifficulty = styled(Row)`
  align-items: flex-start;

  ${({ theme }) => theme.medias.max400} {
    font-size: 12px;
  }
`;

const Difficulty = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & + & {
    margin-left: 3px;
  }
`;

export const Label = styled.span<{ $isHard?: boolean }>`
  margin-right: 2px;
  border-radius: 4px;
  text-decoration: normal !important;

  color: ${({ $isHard, theme }) =>
    $isHard ? theme.app.text.red : theme.app.text.blue};
`;
