import { Tooltip } from "@mui/material";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { MdMenu } from "@react-icons/all-files/md/MdMenu";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import type { To } from "react-router-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import { authAtom } from "@core/atoms/auth.atom";
import { showWideAtom } from "@core/atoms/todo.atom";
import useResetCharacters from "@core/hooks/mutations/member/useResetCharacters";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useIsGuest from "@core/hooks/useIsGuest";
import useModalState from "@core/hooks/useModalState";
import useOutsideClick from "@core/hooks/useOutsideClick";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import DonationModal from "@components/DonationModal";
import Logo, * as LogoStyledComponents from "@components/Logo";
import Modal from "@components/Modal";

import LoadingBar from "./LoadingBar";
import NotificationButton from "./NotificationButton";
import ToggleBackGround from "./ToggleBackGround";
import ToggleThemeButton from "./ToggleThemeButton";

const leftMenues: Array<{
  to: To;
  title: string;
  span?: boolean;
}> = [
  {
    to: "/post",
    title: "커뮤니티",
  },
  { to: "/todo", title: "숙제" },
  { to: "/friends", title: "깐부" },
  {
    to: "/schedule",
    title: "일정",
    span: true,
  },
  {
    to: "/cube",
    title: "큐브 계산기",
  },
  {
    to: "https://docs.loatodo.com",
    title: "가이드",
  },
  // {
  //   to: "/logs",
  //   title: "타임라인",
  // },
];

const Header = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAtomValue(authAtom);
  const isGuest = useIsGuest();
  const currentDateTime = new Date();

  const [resetModal, toggleResetModal] = useModalState<boolean>();
  const [pcMenuOpen, setPcMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [donationModal, setDonationModal] = useModalState<boolean>();
  const [showWide, setShowWide] = useAtom(showWideAtom);

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

      toast.success("등록된 데이터가 정상적으로 삭제되었어요.");
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
                <span>API KEY 변경</span>
              </Link>
            </li>
            <li>
              <button type="button" onClick={() => toggleResetModal(true)}>
                <span>등록 데이터 삭제</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setShowWide(!showWide)}>
                <span>{showWide ? "좁게 보기" : "넓게 보기"}</span>
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
  }, [getCharacters.data, showWide]);

  const remainingDays = auth.adsDate
    ? Math.ceil(
        (new Date(auth.adsDate).getTime() - currentDateTime.getTime()) /
          (1000 * 3600 * 24)
      )
    : 0;

  return (
    <Wrapper>
      <LoadingBar />

      <Modal
        title="등록 데이터 삭제"
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
        <StyledModal>
          정말로 등록된 <strong>데이터를 전부 삭제</strong> 하시겠어요?
          <br />
          등록했던 캐릭터, 숙제, 깐부 데이터가 모두 삭제돼요.
          <br />
          <span>코멘트 데이터는 유지됩니다.</span>
        </StyledModal>
      </Modal>

      <Modal
        title="로아투두 후원하기"
        isOpen={!!donationModal}
        onClose={setDonationModal}
      >
        <DonationModal />
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
                  {item.span ? (
                    <LabelBeta>
                      {item.title} <span>BETA</span>
                    </LabelBeta>
                  ) : (
                    item.title
                  )}
                </LeftMenuItem>
              </li>
            );
          })}
        </LeftMenuBox>
      </LeftGroup>

      <RightGroup>
        <ToggleBackGround />
        {auth.adsDate != null && new Date(auth.adsDate) > currentDateTime ? (
          <Tooltip title={`광고제거 ON - 남은 기간 ${remainingDays}일`}>
            <DonationButtonGroup>
              <Dot color="green" />
              <button type="button" onClick={() => setDonationModal(true)}>
                후원하기
              </button>
            </DonationButtonGroup>
          </Tooltip>
        ) : (
          <DonationButtonGroup>
            <Dot color="red" />
            <button type="button" onClick={() => setDonationModal(true)}>
              후원하기
            </button>
          </DonationButtonGroup>
        )}
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

const Dot = styled.span<{ color: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  margin-right: 8px;
`;

const DonationButtonGroup = styled.span`
  color: ${({ theme }) => theme.app.palette.gray[0]};
  font-weight: bold;
`;

const LabelBeta = styled.div`
  position: relative;
  span {
    position: absolute;
    right: -20px;
    top: -15px;
    font-size: 11px;
  }
`;

const StyledModal = styled.div`
  color: ${({ theme }) => theme.app.text.black};
  strong {
    color: #ff5a5a;
  }
  span {
    color: ${({ theme }) => theme.app.text.light2};
    font-size: 14px;
  }
`;
