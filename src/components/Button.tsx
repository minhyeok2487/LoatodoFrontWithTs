import styled from "@emotion/styled";
import { FC } from "react";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

interface Props {
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}
const DefaultButton: FC<Props> = ({ type = "button", onClick, children }) => {
  return (
    <Wrapper type={type} onClick={onClick}>
      {children}
    </Wrapper>
  );
};

export default DefaultButton;

const Wrapper = styled.button`
  padding: 0 12px;
  line-height: 30px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};
  color: ${({ theme }) => theme.app.text.dark2};
  font-size: 14px;

  &:hover {
    background: ${({ theme }) => theme.app.border};
  }
`;
