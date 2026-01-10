import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MdMenu } from "@react-icons/all-files/md/MdMenu";
import { MdHome } from "@react-icons/all-files/md/MdHome";
import { MdExitToApp } from "@react-icons/all-files/md/MdExitToApp";

import ToggleThemeButton from "@layouts/common/Header/ToggleThemeButton";

interface Props {
  username: string;
  onMenuClick?: () => void;
}

const AdminHeader: FC<Props> = ({ username, onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <HeaderWrapper>
      <LeftSection>
        <MenuButton onClick={onMenuClick} aria-label="메뉴 열기">
          <MdMenu size={24} />
        </MenuButton>
        <PageTitle>관리자 대시보드</PageTitle>
      </LeftSection>

      <RightSection>
        <IconButton onClick={handleGoHome} title="메인으로">
          <MdHome size={20} />
        </IconButton>

        <ToggleThemeButton />

        <UserSection>
          <UserAvatar>{username.charAt(0).toUpperCase()}</UserAvatar>
          <UserName>{username}</UserName>
        </UserSection>

        <IconButton onClick={handleLogout} title="로그아웃" $danger>
          <MdExitToApp size={20} />
        </IconButton>
      </RightSection>
    </HeaderWrapper>
  );
};

export default AdminHeader;

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: 260px;
  height: 64px;
  background: ${({ theme }) => theme.app.bg.white};
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  transition: left 0.3s ease;

  ${({ theme }) => theme.medias.max1024} {
    left: 0;
  }

  ${({ theme }) => theme.medias.max768} {
    padding: 0 16px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.app.text.main};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray2};
  }

  ${({ theme }) => theme.medias.max1024} {
    display: flex;
  }
`;

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;

  ${({ theme }) => theme.medias.max768} {
    font-size: 16px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.app.text.light1};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme, $danger }) =>
      $danger ? "rgba(239, 68, 68, 0.1)" : theme.app.bg.gray2};
    color: ${({ $danger }) => ($danger ? "#ef4444" : "inherit")};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 24px;
  margin-left: 8px;

  ${({ theme }) => theme.medias.max768} {
    display: none;
  }
`;

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
`;

const UserName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.main};
`;
