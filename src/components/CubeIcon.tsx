import styled from "styled-components";

import palette from "@core/constants/palette";

interface Props {
  cubeTicketKey: string;
}

const CubeIcon = ({ cubeTicketKey }: Props) => {
  const countString = cubeTicketKey.match(/\d+/);
  const fillColor =
    cubeTicketKey.includes("ban") || cubeTicketKey.includes("금제")
      ? palette.yellow[450]
      : palette.red[200];

  if (countString === null) {
    return null;
  }

  return (
    <Wrapper>
      {(() => {
        const items = new Array(4);
        const count = Number(countString);

        // 금제 등급별 채울 위치 정의
        const fillMap: Record<number, number[]> = {
          1: [],
          2: [0],
          3: [0, 1],
          4: [0, 2, 3],
          5: [0, 1, 2, 3],
        };

        const fillIndexes = fillMap[count] ?? [];

        for (let i = 0; i < 4; i += 1) {
          items[i] = (
            <Item
              key={i}
              $isFill={fillIndexes.includes(i)}
              $fillColor={fillColor}
            />
          );
        }

        return items;
      })()}
    </Wrapper>
  );
};

export default CubeIcon;

const Wrapper = styled.div`
  width: 16px;
  height: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 1px 0 0 1px;
`;

const Item = styled.div<{ $isFill: boolean; $fillColor: string }>`
  margin: -1px 0 0 -1px;
  aspect-ratio: 1;
  background: ${({ theme, $isFill, $fillColor }) =>
    $isFill ? $fillColor : theme.app.bg.gray2};
  border: 1px solid ${({ theme }) => theme.app.palette.gray[500]};
`;
