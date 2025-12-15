import styled from "styled-components";

interface Props {
  $flex: number;
}

export default styled.div<Props>`
  flex: ${({ $flex }) => $flex || 1};
  padding: 20px 24px 24px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  overflow: hidden;

  ${({ theme }) => theme.medias.max1280} {
    flex: unset;
    width: 100%;
    padding: 20px;
  }
`;
