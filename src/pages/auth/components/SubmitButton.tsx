import styled from "@emotion/styled";
import type { FC } from "react";

interface Props {
  children: string;
}

const SubmitButton: FC<Props> = ({ children }) => {
  return <Wrapper type="submit">{children}</Wrapper>;
};

export default SubmitButton;

const Wrapper = styled.button`
  width: 100%;
  height: 50px;
  border-radius: 20px;
  background: ${({ theme }) => theme.app.semiBlack1};
  color: ${({ theme }) => theme.app.white};
`;
