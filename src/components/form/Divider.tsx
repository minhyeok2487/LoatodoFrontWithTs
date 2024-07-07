import styled from "@emotion/styled";
import type { FC } from "react";

interface Props {
  children: string;
}

const Divider: FC<Props> = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Divider;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 30px;
  width: 100%;
  font-size: 14px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.app.border};
  }
`;
