import { MdAttachMoney } from "@react-icons/all-files/md/MdAttachMoney";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { MdFormatListBulleted } from "@react-icons/all-files/md/MdFormatListBulleted";
import { MdLaunch } from "@react-icons/all-files/md/MdLaunch";
import { MdVisibilityOff } from "@react-icons/all-files/md/MdVisibilityOff";
import { RiArrowLeftRightLine } from "@react-icons/all-files/ri/RiArrowLeftRightLine";
import { RiLayoutMasonryLine } from "@react-icons/all-files/ri/RiLayoutMasonryLine";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { authAtom } from "@core/atoms/auth.atom";
import {
  isDialOpenAtom,
  showGridFormAtom,
  showSortFormAtom,
} from "@core/atoms/todo.atom";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useFriends from "@core/hooks/queries/friend/useFriends";
import useModalState from "@core/hooks/useModalState";

import Modal from "@components/Modal";

import Calc from "./Calc";

interface Props {
  isFriend?: boolean;
  friendUsername?: string;
}

interface Button {
  name: string;
  icon: ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const Dial = ({ isFriend, friendUsername }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSortForm, setShowSortForm] = useAtom(showSortFormAtom);
  const [showGridForm, setShowGridForm] = useAtom(showGridFormAtom);
  const [isDialOpen, setIsDialOpen] = useAtom(isDialOpenAtom);
  const auth = useAtomValue(authAtom);

  const getCharacters = useCharacters({ enabled: !isFriend });
  const getFriends = useFriends();
  const [modalState, setModalState] = useModalState<string>();

  const menus = useMemo(() => {
    const arr: Button[] = [
      {
        name: "캐릭터 순서 변경",
        icon: <RiArrowLeftRightLine />,
        isActive: showSortForm,
        onClick: () => {
          setShowSortForm(!showSortForm);
        },
      },
      {
        name: "화면 수정",
        icon: <RiLayoutMasonryLine />,
        isActive: showGridForm,
        onClick: () => {
          setShowGridForm(!showGridForm);
        },
      },
    ];

    if (isFriend) {
      return arr.concat([
        {
          name: "내 숙제",
          icon: <MdFormatListBulleted />,
          onClick: () => {
            navigate("/todo");
          },
        },
        {
          name: "경매 계산기",
          icon: <MdAttachMoney />,
          onClick: () => setModalState("경매 계산기"),
        },
      ]);
    }

    return arr.concat([
      {
        name: "캐릭터 설정 변경",
        icon: <MdVisibilityOff />,
        onClick: () => {
          navigate("/setting");
        },
      },
      {
        name: "경매 계산기",
        icon: <MdAttachMoney />,
        onClick: () => setModalState("경매 계산기"),
      },
    ]);
  }, [isFriend, showSortForm, showGridForm, auth]);

  if (!getCharacters.data || getCharacters.data.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <ToggleButton
        type="button"
        onClick={() => setIsDialOpen(!isDialOpen)}
        $isOpen={isDialOpen}
      >
        <MdClose />
      </ToggleButton>

      <DialBox $isOpen={isDialOpen}>
        {menus.map((menu) => (
          <li key={menu.name}>
            <DialItem
              type="button"
              onClick={() => menu.onClick()}
              $isActive={menu.isActive}
            >
              {menu.icon}
              <span>{menu.name}</span>
            </DialItem>
          </li>
        ))}

        {getFriends.data
          ?.filter(
            (friend) =>
              friend.areWeFriend === "깐부" &&
              location.pathname !==
                `/friends/${encodeURIComponent(friend.nickName)}`
          )
          .sort((a, b) => a.ordering - b.ordering) // Sort by ordering
          .map((friend) => (
            <li key={friend.friendId}>
              <FriendDialItem
                onClick={() => navigate(`/friends/${friend.nickName}`)}
              >
                <MdLaunch />
                <span>{friend.nickName}</span>
              </FriendDialItem>
            </li>
          ))}
      </DialBox>
      {modalState && (
        <Modal title={`${modalState}`} isOpen onClose={() => setModalState()}>
          <Calc />
        </Modal>
      )}
    </Wrapper>
  );
};

export default Dial;

const Wrapper = styled.div`
  position: fixed;
  top: 80px;
  right: 0;
  z-index: 3;
  font-weight: bold;
`;

const ToggleButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.app.text.light1};
  color: ${({ theme }) => theme.app.text.reverse};
  border-radius: 50%;
  border: none;
  transform: rotate(${({ $isOpen }) => ($isOpen ? 0 : 45)}deg);
  transition: transform 0.3s;
  font-size: 20px;
`;

const DialBox = styled.ul<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  padding: 12px;
  margin: 0;
  position: absolute;
  top: 56px;
  right: 0;
  transition: opacity 0.3s ease-in-out;
  border-radius: 16px 0 0 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  max-height: 585px;
  overflow-y: auto;

  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};

  @media (max-width: 900px) {
    max-height: 479px;
  }
`;

const DialItem = styled.button<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 8px 10px;
  width: 104px;
  color: ${({ theme }) => theme.app.text.main};
  transition: background-color 0.3s;
  font-size: 14px;
  line-height: 1.2;
  border-radius: 12px;
  color: ${({ theme }) => theme.app.text.light2};
  overflow-x: hidden;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.app.bg.main : "transparent"};

  svg {
    font-size: 18px;
  }

  span {
    width: 100%;
    word-break: auto-phrase;
  }

  &:hover {
    background-color: ${({ theme }) => theme.app.bg.main};
  }
`;

const FriendDialItem = styled(DialItem)`
  color: ${({ theme }) => theme.app.text.main};

  svg {
    color: ${({ theme }) => theme.app.text.black};
  }
`;
