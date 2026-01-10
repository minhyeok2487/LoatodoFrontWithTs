import type { FC, ReactNode } from "react";
import styled from "styled-components";

interface Props {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  padding?: boolean;
}

const AdminCard: FC<Props> = ({
  title,
  subtitle,
  action,
  children,
  padding = true,
}) => {
  return (
    <CardWrapper>
      {(title || action) && (
        <CardHeader>
          <HeaderContent>
            {title && <CardTitle>{title}</CardTitle>}
            {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
          </HeaderContent>
          {action && <ActionWrapper>{action}</ActionWrapper>}
        </CardHeader>
      )}
      <CardBody $padding={padding}>{children}</CardBody>
    </CardWrapper>
  );
};

export default AdminCard;

const CardWrapper = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;
`;

const CardSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0;
`;

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardBody = styled.div<{ $padding: boolean }>`
  padding: ${({ $padding }) => ($padding ? "24px" : "0")};
`;
