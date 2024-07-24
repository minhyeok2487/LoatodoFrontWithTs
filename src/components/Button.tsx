import { Button as MuiButton } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import type { ReactNode } from "react";
import styled, { css } from "styled-components";

interface Props {
  variant?: ButtonProps["variant"];
  size?: "small" | "medium" | "large";
  color?: string;
  type?: ButtonProps["type"];
  onClick: ButtonProps["onClick"];
  children: ReactNode;
}

const Button = ({
  variant = "contained",
  size = "medium",
  color,
  type = "button",
  onClick,
  children,
}: Props) => {
  return (
    <StyledButton
      variant={variant}
      $size={size}
      $color={color}
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
  $size: Required<Props["size"]>;
  $color?: string;
}>`
  && {
    box-shadow: none;
  }

  padding: 8px 12px;
  min-width: unset;
  background: ${({ variant, theme }) => {
    if (variant === "contained") {
      return theme.app.palette.gray[800];
    }

    if (variant === "outlined") {
      return theme.app.bg.white;
    }

    return undefined;
  }};
  border: 1px solid
    ${({ variant, theme }) => {
      if (variant === "contained") {
        return theme.app.palette.gray[800];
      }

      if (variant === "outlined") {
        return theme.app.border;
      }

      return "transparent";
    }};
  color: ${({ variant, theme }) =>
    variant === "contained" ? theme.app.palette.gray[0] : theme.app.text.dark2};
  font-size: ${({ $size }) => {
    switch ($size) {
      case "large":
        return 16;
      case "small":
        return 13;
      default: // medium
        return 14;
    }
  }}px;
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

      return css`
        border-color: transparent;
      `;
    }}
  }
`;
