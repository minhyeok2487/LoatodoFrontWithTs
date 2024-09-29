import { Button as MuiButton } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import type { HTMLAttributeAnchorTarget, ReactNode } from "react";
import styled, { css } from "styled-components";
import type { RuleSet } from "styled-components";

interface CommonProps {
  css?: RuleSet;
  color?: string;
  href?: ButtonProps["href"];
  rel?: ButtonProps["rel"];
  target?: HTMLAttributeAnchorTarget;
  type?: ButtonProps["type"];
  fullWidth?: ButtonProps["fullWidth"];
  startIcon?: ButtonProps["startIcon"];
  endIcon?: ButtonProps["endIcon"];
  onClick?: ButtonProps["onClick"];
  disabled?: ButtonProps["disabled"];
  ariaLabel?: ButtonProps["aria-label"];
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

const Button = ({
  css,
  href,
  rel,
  target,
  variant = "contained",
  size,
  color,
  type = "button",
  fullWidth,
  startIcon,
  endIcon,
  disabled,
  onClick,
  ariaLabel,
  children,
}: NormalButtonProps | IconButtonProps) => {
  return (
    <StyledButton
      // mui props
      variant={variant === "icon" ? "text" : variant}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      // button props
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      // 링크 관련
      href={href}
      rel={rel}
      target={target}
      // styled props
      $customStyle={css}
      $isIconButton={variant === "icon"}
      $size={size}
      $color={color}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

type StyledButtonProps = {
  variant: Required<ButtonProps["variant"]>;
  target?: HTMLAttributeAnchorTarget;
  $customStyle?: RuleSet;
  $isIconButton: boolean;
  $size: Required<NormalButtonProps["size"] | IconButtonProps["size"]>;
  $color?: string;
};

const buttonCss = ({ variant, $color }: StyledButtonProps) => css`
  background: ${({ theme }) => {
    if (variant === "contained") {
      return $color || theme.app.palette.gray[800];
    }

    return "transparent";
  }};
  border: ${({ theme }) => {
    if (variant === "outlined") {
      return `1px solid ${$color || theme.app.border}`;
    }

    return 0;
  }};
`;

const StyledButton = styled(MuiButton)<StyledButtonProps>`
  && {
    transition: unset;
    overflow: hidden;
    min-width: unset;
    box-shadow: none;
    padding: ${({ variant, $isIconButton, $size }) => {
      if ($isIconButton) {
        return "10px";
      }

      switch ($size) {
        case "large":
          return variant === "outlined" ? "6px 15px" : "7px 16px";
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
        default:
          return 14;
      }
    }}px;
    color: ${({ theme, variant, $color, $isIconButton }) => {
      if (variant === "contained") {
        return theme.app.palette.gray[0];
      }

      if (theme.currentTheme === "light") {
        // 라이트 모드일 때는 color 적용
        return $color || theme.app.text.dark2;
      }

      // 다크모드일 때는 아이콘 버튼만 color 적용
      return $isIconButton
        ? $color || theme.app.palette.gray[0]
        : theme.app.palette.gray[0];
    }};
    border-radius: ${({ $size, $isIconButton }) => {
      if ($isIconButton) {
        return "50%";
      }

      return $size === "large" ? "6px" : "6px";
    }};
    border-style: solid;
    line-height: 1.5;
    font-weight: 500;

    ${(props) => buttonCss(props)}
    ${({ $customStyle }) => $customStyle}

    ${({ $isIconButton, $size }) => {
      return (
        $isIconButton &&
        typeof $size === "number" &&
        css`
          & > svg {
            font-size: ${$size}px;
            width: ${$size}px;
            height: ${$size}px;
          }
        `
      );
    }}

    &.MuiButton-icon {
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

    &.Mui-disabled {
      opacity: 0.7;
      pointer-events: initial;
      cursor: not-allowed;
    }

    .MuiTouchRipple-root {
      border-radius: 0;
    }

    &:hover {
      ${(props) => buttonCss(props)}
      ${({ $customStyle }) => $customStyle}

      .MuiTouchRipple-root {
        background: ${({ theme, variant }) => {
          if (theme.currentTheme === "light" && variant !== "contained") {
            return "rgba(0, 0, 0, 0.05)";
          }

          return "rgba(255, 255, 255, 0.15)";
        }};
      }
    }
  }
`;
