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
  nightmare: string;
  none: string;
}

const RaidNameParser = ({ children }: Props) => {
  const isBelowWidth500 = useIsBelowWidth(500);
  const hardText = isBelowWidth500 ? "하" : "하드";
  const normalText = isBelowWidth500 ? "노" : "노말";
  const nightmareText = isBelowWidth500 ? "나" : "나이트메어";

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
      nightmare:
        children
          .match(/(나이트메어)(?<captured>(\s*\d)+)/)
          ?.groups?.captured.trim() || "",
      none: rest,
    };

    return result;
  }, [children]);

  return (
    <Wrapper>
      <Row>{parsed.raidName}</Row>
      {(() => {
        const difficulties = [];

        if (parsed.normal) {
          difficulties.push({ text: normalText, value: parsed.normal, type: "normal" });
        }
        if (parsed.hard) {
          difficulties.push({ text: hardText, value: parsed.hard, type: "hard" });
        }
        if (parsed.nightmare) {
          difficulties.push({ text: nightmareText, value: parsed.nightmare, type: "nightmare" });
        }

        // 게이트 숫자 순서대로 정렬
        difficulties.sort((a, b) => Number(a.value) - Number(b.value));

        if (difficulties.length > 0) {
          return (
            <RowWithDifficulty>
              {difficulties.map((diff, index) => (
                <Difficulty key={index}>
                  <Label $difficulty={diff.type}>{diff.text}</Label>
                  {diff.value}
                </Difficulty>
              ))}
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

export const Label = styled.span<{ $difficulty?: string }>`
  margin-right: 2px;
  border-radius: 4px;
  text-decoration: normal !important;

  color: ${({ $difficulty, theme }) => {
    switch ($difficulty) {
      case "hard":
        return theme.app.text.red;
      case "nightmare":
        return theme.app.text.purple;
      case "normal":
      default:
        return theme.app.text.blue;
    }
  }};
`;
