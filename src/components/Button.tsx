import { Button as MuiButton } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import type { ReactNode } from "react";
import styled, { css } from "styled-components";

interface Props {
  fontSize?: number;
  variant?: ButtonProps["variant"];
  type?: ButtonProps["type"];
  onClick: ButtonProps["onClick"];
  children: ReactNode;
}

const Button = ({
  variant = "contained",
  fontSize = 14,
  type = "button",
  onClick,
  children,
}: Props) => {
  return (
    <StyledButton
      variant={variant}
      $fontSize={fontSize}
      type={type}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled(MuiButton)<{
  variant: ButtonProps["variant"];
  $fontSize: number;
}>`
  && {
    box-shadow: none;
  }

  padding: 8px 12px;
  min-width: unset;
  background: ${({ variant, theme }) =>
    variant === "contained" ? theme.app.palette.gray[800] : theme.app.bg.white};
  border: 1px solid
    ${({ variant, theme }) =>
      variant === "outlined" ? theme.app.border : theme.app.palette.gray[800]};
  color: ${({ variant, theme }) =>
    variant === "contained" ? theme.app.palette.gray[0] : theme.app.text.dark2};
  font-size: ${({ $fontSize }) => $fontSize}px;
  border-radius: 8px;
  line-height: 1;
  font-weight: 500;

  &:hover {
    border-color: initial;

    ${({ variant, theme }) => {
      if (variant === "contained") {
        return css`
          border-color: ${theme.app.palette.gray[650]};
          background: ${theme.app.palette.gray[650]};
        `;
      }

      if (variant === "outlined") {
        return css`
          border-color: ${theme.app.border};
          background: ${theme.app.bg.gray1};
        `;
      }

      return css``;
    }}
  }
`;
