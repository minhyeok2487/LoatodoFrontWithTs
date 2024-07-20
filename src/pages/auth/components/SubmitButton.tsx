import type { FC } from "react";
import styled from "styled-components";

interface Props {
  children: string;
}

const SubmitButton: FC<Props> = ({ children }) => {
  return <Wrapper type="submit">{children}</Wrapper>;
};

export default SubmitButton;

export const Wrapper = styled.button`
  width: 100%;
  height: 50px;
  border-radius: 20px;
  background: ${({ theme }) => theme.app.palette.gray[800]};
  color: ${({ theme }) => theme.app.palette.gray[0]};
`;
