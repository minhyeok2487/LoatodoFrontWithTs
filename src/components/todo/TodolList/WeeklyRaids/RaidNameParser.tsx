import styled from "@emotion/styled";
import { useMemo } from "react";

import useWindowSize from "@core/hooks/useWindowSize";

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
  const { width } = useWindowSize();
  const hardText = width < 500 ? "하" : "하드";
  const normalText = width < 500 ? "노" : "노말";

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
                  <Label isHard>{hardText}</Label>
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
                <Label isHard>{hardText}</Label>
                {parsed.hard}
              </Difficulty>
            </RowWithDifficulty>
          );
        }

        if (parsed.hard) {
          return (
            <RowWithDifficulty>
              <Difficulty>
                <Label isHard>{hardText}</Label>
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
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const RowWithDifficulty = styled(Row)`
  align-items: flex-start;
  margin: 2px 0 0;

  ${({ theme }) => theme.medias.max400} {
    flex-direction: column;
    gap: 4px;
  }
`;

const Difficulty = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & + & {
    margin-left: 6px;

    ${({ theme }) => theme.medias.max400} {
      margin-left: 0;
    }
  }
`;

export const Label = styled.span<{ isHard?: boolean }>`
  margin-right: 3px;
  border-radius: 4px;
  text-decoration: normal !important;
  
  color: ${({ isHard, theme }) => (isHard ? theme.app.red : theme.app.blue4)};
`;
