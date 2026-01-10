import type { FC, ReactNode } from "react";
import styled from "styled-components";

interface Props {
  title: string;
  description?: string;
  actions?: ReactNode;
}

const AdminPageTitle: FC<Props> = ({ title, description, actions }) => {
  return (
    <Wrapper>
      <TextContent>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
      </TextContent>
      {actions && <ActionsWrapper>{actions}</ActionsWrapper>}
    </Wrapper>
  );
};

export default AdminPageTitle;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;

  ${({ theme }) => theme.medias.max768} {
    flex-direction: column;
    gap: 16px;
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;
  letter-spacing: -0.5px;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0;
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
