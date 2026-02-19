import { Link } from "react-router-dom";
import styled from "styled-components";

const Footer = () => {
  return (
    <Wrapper>
      <FooterContent>
        <Brand>LOATODO</Brand>
        <FooterLinks>
          <FooterLink to="/policy/privacy">개인정보지침</FooterLink>
          <FooterText>대표자: 이민혁</FooterText>
          <FooterText>사업자번호: 853-27-01939</FooterText>
          <FooterText>문의: repeat2487@gmail.com</FooterText>
        </FooterLinks>
      </FooterContent>
      <CopyRight>© 2024 LOATODO. All rights reserved.</CopyRight>
    </Wrapper>
  );
};

export default Footer;

const Wrapper = styled.footer`
  margin-top: 40px;
  padding: 32px 16px 48px;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.main};
  color: ${({ theme }) => theme.app.text.light1};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  ${({ theme }) => theme.medias.max600} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Brand = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 14px;
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.app.palette.blue[350]};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const FooterText = styled.span`
  color: ${({ theme }) => theme.app.text.light1};
`;

const CopyRight = styled.small`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;
