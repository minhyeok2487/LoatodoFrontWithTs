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

  const count = Number(countString) - 1;

  return (
    <Wrapper>
      {(() => {
        const items = [];

        for (let i = 0; i < 4; i += 1) {
          items.push(
            <Item key={i} $isFill={i < count} $fillColor={fillColor} />
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
