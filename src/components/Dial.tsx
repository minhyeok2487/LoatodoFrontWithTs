import { MdCached } from "@react-icons/all-files/md/MdCached";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { MdFormatListBulleted } from "@react-icons/all-files/md/MdFormatListBulleted";
import { MdLaunch } from "@react-icons/all-files/md/MdLaunch";
import { MdVisibilityOff } from "@react-icons/all-files/md/MdVisibilityOff";
import { RiArrowLeftRightLine } from "@react-icons/all-files/ri/RiArrowLeftRightLine";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import { authAtom } from "@core/atoms/auth.atom";
import { isDialOpenAtom, showSortFormAtom } from "@core/atoms/todo.atom";
import useRefreshCharacters from "@core/hooks/mutations/character/useRefreshCharacters";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useFriends from "@core/hooks/queries/friend/useFriends";
import useIsGuest from "@core/hooks/useIsGuest";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

interface Props {
  isFriend?: boolean;
}

interface Button {
  name: string;
  icon: ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const Dial = ({ isFriend }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSortForm, setShowSortForm] = useAtom(showSortFormAtom);
  const [isDialOpen, setIsDialOpen] = useAtom(isDialOpenAtom);
  const auth = useAtomValue(authAtom);
  const isGuest = useIsGuest();

  const getCharacters = useCharacters({ enabled: !isFriend });
  const getFriends = useFriends();

  const refreshCharacters = useRefreshCharacters({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
      toast("캐릭터 정보가 업데이트 되었습니다.");
    },
  });

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
      ]);
    }

    return arr.concat([
      {
        name: "전체 캐릭터 보기",
        icon: <MdFormatListBulleted />,
        onClick: () => {
          navigate("/todo/all");
        },
      },
      {
        name: "출력 내용 변경",
        icon: <MdVisibilityOff />,
        onClick: () => {
          navigate("/setting");
        },
      },
      {
        name: "캐릭터 정보 업데이트",
        icon: <MdCached />,
        onClick: () => {
          if (isGuest) {
            toast.warn("테스트 계정은 이용하실 수 없습니다.");
          } else if (window.confirm("캐릭터 정보를 업데이트 하시겠습니까?")) {
            refreshCharacters.mutate();
          }
        },
      },
    ]);
  }, [isFriend, showSortForm, auth]);

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
