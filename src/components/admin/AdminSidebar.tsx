import type { FC } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { MdDashboard } from "@react-icons/all-files/md/MdDashboard";
import { MdPeople } from "@react-icons/all-files/md/MdPeople";
import { MdPerson } from "@react-icons/all-files/md/MdPerson";
import { MdFavorite } from "@react-icons/all-files/md/MdFavorite";
import { MdComment } from "@react-icons/all-files/md/MdComment";
import { MdGroup } from "@react-icons/all-files/md/MdGroup";
import { MdNotifications } from "@react-icons/all-files/md/MdNotifications";
import { MdVideogameAsset } from "@react-icons/all-files/md/MdVideogameAsset";
import { MdClose } from "@react-icons/all-files/md/MdClose";

interface MenuItem {
  to: string;
  icon: typeof MdDashboard;
  label: string;
  exact?: boolean;
}

const menuItems: MenuItem[] = [
  { to: "/admin", icon: MdDashboard, label: "대시보드", exact: true },
  { to: "/admin/members", icon: MdPeople, label: "회원 관리" },
  { to: "/admin/characters", icon: MdPerson, label: "캐릭터 관리" },
  { to: "/admin/content", icon: MdVideogameAsset, label: "콘텐츠 관리" },
  { to: "/admin/donations", icon: MdFavorite, label: "후원 관리" },
  { to: "/admin/comments", icon: MdComment, label: "댓글 관리" },
  { to: "/admin/friends", icon: MdGroup, label: "깐부 관리" },
  { to: "/admin/notifications", icon: MdNotifications, label: "알림 관리" },
];

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar: FC<Props> = ({ isOpen = false, onClose }) => {
  return (
    <>
      {isOpen && <Overlay onClick={onClose} />}
      <SidebarWrapper $isOpen={isOpen}>
        <LogoSection>
          <Logo>
            <LogoIcon>L</LogoIcon>
            <LogoText>LoaTodo Admin</LogoText>
          </Logo>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </LogoSection>

        <NavSection>
          <NavLabel>메뉴</NavLabel>
          <MenuList>
            {menuItems.map((item) => (
              <MenuItem key={item.to}>
                <MenuLink to={item.to} end={item.exact} onClick={onClose}>
                  <MenuIcon>
                    <item.icon size={20} />
                  </MenuIcon>
                  <span>{item.label}</span>
                </MenuLink>
              </MenuItem>
            ))}
          </MenuList>
        </NavSection>

        <BottomSection>
          <VersionText>v1.0.0</VersionText>
        </BottomSection>
      </SidebarWrapper>
    </>
  );
};

export default AdminSidebar;

const Overlay = styled.div`
  display: none;

  ${({ theme }) => theme.medias.max1024} {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    backdrop-filter: blur(2px);
  }
`;

const SidebarWrapper = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  background: ${({ theme }) => theme.app.bg.white};
  border-right: 1px solid ${({ theme }) => theme.app.border};
  display: flex;
  flex-direction: column;
  z-index: 999;

  ${({ theme }) => theme.medias.max1024} {
    transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "-100%")});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${({ $isOpen }) =>
      $isOpen ? "4px 0 24px rgba(0, 0, 0, 0.15)" : "none"};
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
`;

const LogoText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const CloseButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.app.text.light1};
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
    color: ${({ theme }) => theme.app.text.main};
  }

  ${({ theme }) => theme.medias.max1024} {
    display: flex;
  }
`;

const NavSection = styled.nav`
  flex: 1;
  padding: 20px 12px;
  overflow-y: auto;
`;

const NavLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.app.text.light2};
  padding: 0 12px;
  margin: 0 0 12px 0;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuItem = styled.li``;

const MenuIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: transparent;
  transition: all 0.2s;
`;

const MenuLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px;
  padding-right: 16px;
  color: ${({ theme }) => theme.app.text.light1};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.app.text.main};
    background: ${({ theme }) => theme.app.bg.gray1};

    ${MenuIcon} {
      background: ${({ theme }) => theme.app.bg.gray2};
    }
  }

  &.active {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);

    ${MenuIcon} {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }
  }
`;

const BottomSection = styled.div`
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const VersionText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
  margin: 0;
  text-align: center;
`;
