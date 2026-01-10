import type { FC, ReactNode } from "react";
import styled from "styled-components";

interface Props {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: ReactNode;
}

const StatCard: FC<Props> = ({ icon, label, value, subtext }) => {
  return (
    <Card>
      <IconWrapper>{icon}</IconWrapper>
      <Content>
        <Label>{label}</Label>
        <Value>{value}</Value>
        {subtext && <Subtext>{subtext}</Subtext>}
      </Content>
    </Card>
  );
};

export default StatCard;

const Card = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Label = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  font-weight: 500;
`;

const Value = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  letter-spacing: -0.5px;
`;

const Subtext = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;
