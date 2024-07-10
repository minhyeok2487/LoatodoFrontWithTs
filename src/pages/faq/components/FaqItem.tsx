import { MdKeyboardArrowDown } from "@react-icons/all-files/md/MdKeyboardArrowDown";
import type { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  title: string;
  children: ReactNode;
}

const FaqItem = ({ title, children }: Props) => {
  return (
    <Wrapper>
      <Header>
        <TitleRow>
          <Label>Q</Label>
        </TitleRow>
        <p>{title}</p>
      </Header>
      <Body>
        <Label>A</Label>
        {children}
      </Body>
    </Wrapper>
  );
};

export default FaqItem;

const Wrapper = styled.li`
  display: flex;
  flex-direction: column;
`;

const Header = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
`;

const Label = styled.i`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.black};
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;

  p {
    color: ${({ theme }) => theme.app.text.main};
    font-size: 16px;
    font-weight: 400;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 20px 24px 24px 24px;
`;
