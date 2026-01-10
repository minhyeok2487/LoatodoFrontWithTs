import type { FC, ReactNode } from "react";
import styled from "styled-components";

type Variant = "primary" | "success" | "warning" | "error" | "gray";

interface Props {
  variant?: Variant;
  children: ReactNode;
}

const AdminBadge: FC<Props> = ({ variant = "gray", children }) => {
  return <Badge $variant={variant}>{children}</Badge>;
};

export default AdminBadge;

const variantStyles = {
  primary: {
    bg: "rgba(102, 126, 234, 0.15)",
    color: "#667eea",
  },
  success: {
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#10b981",
  },
  warning: {
    bg: "rgba(245, 158, 11, 0.15)",
    color: "#f59e0b",
  },
  error: {
    bg: "rgba(239, 68, 68, 0.15)",
    color: "#ef4444",
  },
  gray: {
    bg: "rgba(107, 114, 128, 0.15)",
    color: "#6b7280",
  },
};

const Badge = styled.span<{ $variant: Variant }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  background: ${({ $variant }) => variantStyles[$variant].bg};
  color: ${({ $variant }) => variantStyles[$variant].color};
`;
