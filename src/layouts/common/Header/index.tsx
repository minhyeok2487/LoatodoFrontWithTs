import { MdClose } from "@react-icons/all-files/md/MdClose";
import { MdMenu } from "@react-icons/all-files/md/MdMenu";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import type { To } from "react-router-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import { authAtom } from "@core/atoms/auth.atom";
import useResetCharacters from "@core/hooks/mutations/member/useResetCharacters";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useIsGuest from "@core/hooks/useIsGuest";
import useModalState from "@core/hooks/useModalState";
import useOutsideClick from "@core/hooks/useOutsideClick";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Logo, * as LogoStyledComponents from "@components/Logo";
import Modal from "@components/Modal";

import LoadingBar from "./LoadingBar";
import NotificationButton from "./NotificationButton";
import ToggleThemeButton from "./ToggleThemeButton";

const leftMenues: Array<{
  to: To;
  title: string;
}> = [
  {
    to: "/post",
    title: "커뮤니티(베타)",
  },
  { to: "/todo", title: "숙제" },
  { to: "/friends", title: "깐부" },
  {
    to: "/schedule",
    title: "일정",
  },
  {
    to: "/cube",
    title: "큐브 계산기",
  },
  {
    to: "https://docs.loatodo.com",
    title: "가이드",
  },
  {
    to: "/comments",
    title: "(구)방명록",
  },
];

const Header = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAtomValue(authAtom);
  const isGuest = useIsGuest();

  const [resetModal, toggleResetModal] = useModalState<boolean>();
  const [pcMenuOpen, setPcMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileMenuRef = useOutsideClick<HTMLDivElement>(() => {
    setMobileMenuOpen(false);
  });
  const pcMenuRef = useOutsideClick<HTMLDivElement>(() => {
    setPcMenuOpen(false);
  });

  const getCharacters = useCharacters();
  const resetCharacters = useResetCharacters({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getMyInformation(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });

      toast.success("등록된 캐릭터가 정상적으로 삭제되었습니다.");
      toggleResetModal();
      navigate("/");
    },
  });

  const otherMenu = useMemo(() => {
    return (
      <>
        {getCharacters.data && getCharacters.data.length > 0 && (
          <>
            <li>
              <Link to="/member/apikey">
                <span>API Key 변경</span>
              </Link>
            </li>
            <li>
              <button type="button" onClick={() => toggleResetModal(true)}>
                <span>등록 캐릭터 삭제</span>
              </button>
            </li>
          </>
        )}

        <li>
          <button type="button" onClick={() => navigate("/logout")}>
            <span>로그아웃</span>
          </button>
        </li>
      </>
    );
  }, [getCharacters.data]);

  return (
    <Wrapper>
      <LoadingBar />

      <Modal
        title="등록 캐릭터 삭제"
        isOpen={!!resetModal}
        onClose={toggleResetModal}
        buttons={[
          {
            label: "확인",
            onClick: resetCharacters.mutate,
          },
          {
            label: "취소",
            onClick: () => toggleResetModal(),
          },
        ]}
      >
        정말로 등록된 캐릭터를 삭제하시겠습니까?
        <br />
        등록된 캐릭터, 숙제, 깐부 데이터가 삭제됩니다.
        <br />
        코멘트 데이터는 유지됩니다.
      </Modal>

      <LeftGroup>
        <Logo isDarkMode />
        <LeftMenuBox>
          {leftMenues.map((item) => {
            return (
              <li key={item.title}>
                <LeftMenuItem
                  to={item.to}
                  $isActive={
                    location.pathname ===
                    (typeof item.to === "string" ? item.to : item.to.pathname)
                  }
                  target={item.title === "가이드" ? "_blank" : undefined}
                >
                  {item.title}
                </LeftMenuItem>
              </li>
            );
          })}
        </LeftMenuBox>
      </LeftGroup>

      <RightGroup>
        <ToggleThemeButton />
        <NotificationButton />
        {!isGuest ? (
          <AbsoluteMenuWrapper ref={pcMenuRef} $forMobile={false}>
            <Username type="button" onClick={() => setPcMenuOpen(!pcMenuOpen)}>
              {auth.username}
            </Username>

            {pcMenuOpen && <MenuBox>{otherMenu}</MenuBox>}
          </AbsoluteMenuWrapper>
        ) : (
          <LoginButton to="/login">로그인</LoginButton>
        )}

        <AbsoluteMenuWrapper ref={mobileMenuRef} $forMobile>
          <MobileMenuButton
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <MdClose /> : <MdMenu />}
          </MobileMenuButton>

          {mobileMenuOpen && (
            <MenuBox>
              {leftMenues.map((item) => (
                <li key={item.title}>
                  <Link to={item.to}>
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
              <li>
                {!isGuest ? (
                  <UserMenuInDrawer>
                    <dt>{auth.username}</dt>
                    <dl>
                      <ul>{otherMenu}</ul>
                    </dl>
                  </UserMenuInDrawer>
                ) : (
                  <Link to="/login">로그인</Link>
                )}
              </li>
            </MenuBox>
          )}
        </AbsoluteMenuWrapper>
      </RightGroup>
    </Wrapper>
  );
};

export default Header;

const Wrapper = styled.header`
  z-index: 4;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 32px;
  width: 100%;
  height: 60px;
  box-shadow: 0px 0px 20px 7px rgba(0, 0, 0, 0.03);
  background: ${({ theme }) => theme.app.palette.gray[800]};

  ${({ theme }) => theme.medias.max1280} {
    padding: 0 16px;
  }
`;

const LeftGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 32px;

  ${LogoStyledComponents.Wrapper} {
    width: 140px;
  }
`;

const LeftMenuBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
  color: ${({ theme }) => theme.app.palette.gray[0]};

  ${({ theme }) => theme.medias.max900} {
    display: none;
  }
`;

const LeftMenuItem = styled(NavLink)<{ $isActive: boolean }>`
  line-height: 1px;
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 500)};
  border-bottom: 1px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.app.palette.gray[0] : "transparent"};
  font-size: 18px;

  &:hover {
    border-bottom: 1px solid ${({ theme }) => theme.app.palette.gray[0]};
  }
`;

const RightGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

const AbsoluteMenuWrapper = styled.div<{ $forMobile: boolean }>`
  position: relative;

  ${({ $forMobile, theme }) =>
    $forMobile
      ? `
        display:none;

        ${theme.medias.max900}{
          display: block;
        }
      `
      : `
        display:block;

        ${theme.medias.max900}{
          display: none;
        }
      `}
`;

const Username = styled.button`
  padding: 5px;
  color: ${({ theme }) => theme.app.palette.gray[0]};
`;

const MenuBox = styled.ul`
  z-index: 99;
  padding: 5px 24px;
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateY(calc(100% + 30px));
  display: flex;
  flex-direction: column;
  align-items: center;
  width: max-content;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.app.border};

  & li a,
  & li button {
    display: block;
    padding: 7px 0;
    width: 100%;
    color: ${({ theme }) => theme.app.text.dark2};
    line-height: 22px;
    text-align: center;

    &:hover {
      span {
        border-bottom: 1px solid ${({ theme }) => theme.app.text.dark2};
      }
    }
  }
`;

const LoginButton = styled(Link)`
  padding: 0.5rem 0.2rem;
  color: ${({ theme }) => theme.app.palette.gray[0]};

  ${({ theme }) => theme.medias.max900} {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: ${({ theme }) => theme.app.palette.gray[0]};

  ${({ theme }) => theme.medias.max900} {
    display: flex;
  }
`;

const UserMenuInDrawer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.app.border};

  dt {
    margin-bottom: 10px;
  }
`;
