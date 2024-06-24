import styled from "@emotion/styled";
import { MdCached } from "@react-icons/all-files/md/MdCached";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { MdFormatListBulleted } from "@react-icons/all-files/md/MdFormatListBulleted";
import { MdLaunch } from "@react-icons/all-files/md/MdLaunch";
import { MdVisibilityOff } from "@react-icons/all-files/md/MdVisibilityOff";
import { RiArrowLeftRightLine } from "@react-icons/all-files/ri/RiArrowLeftRightLine";
import { useMemo, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";

import { updateCharacters, useCharacters } from "@core/apis/character.api";
import { useFriends } from "@core/apis/friend.api";
import { loading } from "@core/atoms/loading.atom";
import { sortForm } from "@core/atoms/sortForm.atom";

interface Props {
  isFriend?: boolean;
}

const TodoDial = ({ isFriend }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: characters, refetch: refetchCharacters } =
    useCharacters(isFriend);
  const { data: friends } = useFriends();

  const [isOpen, toggleIsOpen] = useReducer((state) => !state, true);
  const [showSortForm, setShowSortForm] = useRecoilState(sortForm);
  const setLoadingState = useSetRecoilState(loading);

  const menus = useMemo(() => {
    const arr = [
      {
        name: "캐릭터 순서 변경",
        icon: <RiArrowLeftRightLine />,
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
        onClick: async () => {
          try {
            setLoadingState(true);
            await updateCharacters();
            await refetchCharacters();
            toast("캐릭터 정보가 업데이트 되었습니다.");
          } catch (error) {
            console.log(error);
          } finally {
            setLoadingState(false);
          }
        },
      },
    ]);
  }, [isFriend, showSortForm]);

  if (characters === undefined || characters.length < 1) {
    return null;
  }

  return (
    <Wrapper>
      <ToggleButton type="button" onClick={toggleIsOpen} isOpen={isOpen}>
        <MdClose />
      </ToggleButton>

      <DialBox isOpen={isOpen}>
        {menus.map((menu) => (
          <li key={menu.name}>
            <DialItem type="button" onClick={() => menu.onClick()}>
              {menu.icon}
              <span>{menu.name}</span>
            </DialItem>
          </li>
        ))}

        {friends
          ?.filter(
            (friend) =>
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

export default TodoDial;

const Wrapper = styled.div`
  position: fixed;
  top: 80px;
  right: 0;
  z-index: 3;
  font-weight: bold;
`;

const ToggleButton = styled.button<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.app.text.light1};
  color: ${({ theme }) => theme.app.text.reverse};
  border-radius: 50%;
  border: none;
  transform: rotate(${({ isOpen }) => (isOpen ? 0 : 45)}deg);
  transition: transform 0.3s;
  font-size: 20px;
`;

const DialBox = styled.ul<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${({ theme }) => theme.app.bg.light};
  padding: 12px;
  margin: 0;
  position: absolute;
  top: 56px;
  right: 0;
  transition: opacity 0.3s ease-in-out;
  border-radius: 16px 0 0 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  max-height: 726px;
  overflow-y: auto;

  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};

  @media (max-width: 900px) {
    max-height: 479px;
  }
`;

const DialItem = styled.button`
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
