import styled from "@emotion/styled";

interface Props {
  flex: number;
  pb?: number;
}

export default styled.div<Props>`
  flex: ${({ flex }) => flex || 1};
  padding: 24px;
  background: ${({ theme }) => theme.app.bg.light};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;

  ${({ theme }) => theme.medias.max900} {
    padding: 20px;
  }
`;
