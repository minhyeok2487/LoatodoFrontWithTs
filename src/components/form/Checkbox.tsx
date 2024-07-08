import { BsCheck } from "@react-icons/all-files/bs/BsCheck";
import type { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  onChange: (newValue: boolean) => void;
  checked: boolean;
  children: ReactNode;
}

const Checkbox = ({ onChange, checked, children }: Props) => {
  return (
    <Wrapper
      role="checkbox"
      onClick={() => {
        onChange(!checked);
      }}
    >
      <Indicator $checked={checked}>{checked && <BsCheck />}</Indicator>

      <Label>{children}</Label>
    </Wrapper>
  );
};

export default Checkbox;

const Wrapper = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const Label = styled.span`
  line-height: 1;
  font-size: 15px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const Indicator = styled.span<{ $checked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.app.border};
  font-size: 18px;
  color: ${({ theme }) => theme.app.white};
  background: ${({ $checked, theme }) =>
    $checked ? theme.app.semiBlack2 : "transparent"};

  svg {
    stroke-width: 1;
  }
`;
