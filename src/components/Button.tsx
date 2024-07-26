import { Button as MuiButton } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import type { ReactNode } from "react";
import styled, { css } from "styled-components";

interface CommonProps {
  color?: string;
  type?: ButtonProps["type"];
  fullWidth?: boolean;
  startIcon?: ButtonProps["startIcon"];
  endIcon?: ButtonProps["endIcon"];
  onClick: ButtonProps["onClick"];
  children: ReactNode;
}

interface NormalButtonProps extends CommonProps {
  variant?: ButtonProps["variant"];
  size?: "small" | "medium" | "large";
}

interface IconButtonProps extends CommonProps {
  variant?: "icon";
  size?: number;
}

type ButtonStyledProps = {
  variant: Required<ButtonProps["variant"]>;
  $isIconButton: boolean;
  $size: Required<NormalButtonProps["size"] | IconButtonProps["size"]>;
  $color?: string;
};

const Button = ({
  variant = "contained",
  size = "medium",
  color,
  type = "button",
  fullWidth,
  startIcon,
  endIcon,
  onClick,
  children,
}: NormalButtonProps | IconButtonProps) => {
  return (
    <StyledButton
      variant={variant === "icon" ? "text" : variant}
      $isIconButton={variant === "icon"}
      $size={size}
      $color={color}
      type={type}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled(MuiButton)<ButtonStyledProps>`
  && {
    box-shadow: none;
  }

  ${({ $isIconButton, $size }) =>
    $isIconButton &&
    css`
      & > svg {
        font-size: ${$size}px;
        width: ${$size}px;
        height: ${$size}px;
      }
    `}

  .MuiButton-icon {
    & > svg {
      font-size: ${({ $size }) => {
        switch ($size) {
          case "large":
            return 20;
          case "small":
            return 16;
          default: // medium
            return 18;
        }
      }}px;
    }
  }

  min-width: unset;
  padding: ${({ $isIconButton, $size, variant }) => {
    if ($isIconButton) {
      return "10px";
    }

    switch ($size) {
      case "large":
        return variant === "outlined" ? "11px 19px" : "12px 20px";
      case "small":
        return variant === "outlined" ? "2px 8px" : "3px 9px";
      default:
        return variant === "outlined" ? "3px 11px" : "4px 12px";
    }
  }};
  font-size: ${({ $size }) => {
    switch ($size) {
      case "large":
        return 16;
      case "small":
        return 12;
      default: // medium
        return 14;
    }
  }}px;
  background: ${({ $color, variant, theme }) => {
    if (variant === "contained") {
      return $color || theme.app.palette.gray[800];
    }

    if (variant === "outlined") {
      return theme.app.bg.white;
    }

    return "transparent";
  }};
  border-radius: ${({ $isIconButton, $size }) => {
    if ($isIconButton) {
      return "50%";
    }

    return $size === "large" ? "12px" : "8px";
  }};
  ${({ $color, variant, theme }) => {
    if (variant === "outlined") {
      return css`
        border: 1px solid ${$color || theme.app.border};
      `;
    }

    return css`
      border: 0;
    `;
  }}
  color: ${({ $color, variant, theme }) =>
    variant === "contained"
      ? theme.app.palette.gray[0]
      : $color || theme.app.text.dark2};
  border-style: solid;
  line-height: 1.5;
  font-weight: 500;

  &:hover {
    border-color: ${({ $color, variant, theme }) => {
      if (variant === "outlined") {
        return $color || theme.app.border;
      }

      return "transparent";
    }};
    background-color: ${({ $color, variant, theme }) => {
      if (variant === "contained") {
        return $color || theme.app.palette.gray[800];
      }

      if (variant === "outlined") {
        return theme.app.bg.white;
      }

      return "transparent";
    }};

    .MuiTouchRipple-root {
      background: ${({ variant }) =>
        variant === "text"
          ? "rgba(0, 0, 0, 0.03)"
          : "rgba(255, 255, 255, 0.2)"};
    }

    ${({ variant, theme }) => {
      if (variant === "outlined") {
        return css`
          border-color: $color || ${theme.app.border};
        `;
      }

      return css`
        border-color: transparent;
      `;
    }}
  }
`;
