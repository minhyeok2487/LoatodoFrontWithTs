import type { FC, ReactNode } from "react";
import styled from "styled-components";

import * as LogoStyledComponents from "@components/Logo";
import * as DividerStyledComponents from "@components/form/Divider";

interface Props {
  children: ReactNode;
}

const Box: FC<Props> = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Box;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 45px;
  padding: 40px 85px 80px;
  width: 100%;
  min-width: 300px;
  max-width: 570px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  border-radius: 16px;

  ${({ theme }) => theme.medias.max500} {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 0;
    margin-top: 60px;
    padding: 24px 24px 60px;
    border: 0;

    ${LogoStyledComponents.Wrapper} {
      width: 250px;
      margin-bottom: 40px;
    }

    ${DividerStyledComponents.Wrapper} {
      padding: 30px 0;
    }
  }
`;
