import styled from "@emotion/styled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";

import { updateCharacters, useCharacters } from "@core/apis/Character.api";
import { useFriends } from "@core/apis/Friend.api";
import { loading } from "@core/atoms/Loading.atom";
import { sortForm } from "@core/atoms/SortForm.atom";

import "@styles/Dial.css";

import IconAll from "@assets/images/ico_all.png";
import IconChange from "@assets/images/ico_change.png";
import IconFriend from "@assets/images/ico_friend.png";
import IconOnoff from "@assets/images/ico_onoff.png";
import IconUpdate from "@assets/images/ico_update.png";

const TodoDial = () => {
  const { data: characters, refetch: refetchCharacters } = useCharacters();
  const { data: friends } = useFriends();
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [showSortForm, setShowSortForm] = useRecoilState(sortForm);
  const setLoadingState = useSetRecoilState(loading);
  const navigate = useNavigate();

  const handleToggleSpeedDial = () => {
    setIsSpeedDialOpen(!isSpeedDialOpen);
  };

  const menus = [
    {
      name: "캐릭터 순서 변경",
      icon: IconChange,
      onClick: () => {
        setShowSortForm(!showSortForm);
      },
    },
    {
      name: "전체 캐릭터 보기",
      icon: IconAll,
      onClick: () => {
        navigate("/todo/all");
      },
    },
    {
      name: "출력 내용 변경",
      icon: IconOnoff,
      onClick: () => {
        navigate("/setting");
      },
    },
    {
      name: "캐릭터 정보 업데이트",
      icon: IconUpdate,
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
  ];

  if (characters === undefined || characters.length < 1) {
    return null;
  }

  return (
    <Wrapper>
      <DialButton type="button" onClick={handleToggleSpeedDial}>
        {isSpeedDialOpen ? "x" : "+"}
      </DialButton>
      <DialBox isOpen={isSpeedDialOpen}>
        {menus.map((menu) => (
          <li key={menu.name}>
            <DialItem
              type="button"
              onClick={() => menu.onClick()}
              icon={menu.icon}
            >
              {menu.name}
            </DialItem>
          </li>
        ))}
        {friends?.map((friend) => (
          <li key={friend.friendId}>
            <DialItem
              type="button"
              onClick={() => navigate(`/friends/${friend.nickName}`)}
              icon={IconFriend}
            >
              {friend.nickName}
            </DialItem>
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

const DialButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: var(--fColor02);
  color: var(--background);
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 30px;
  padding-bottom: 5px;
`;

const DialBox = styled.ul<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--bg);
  padding: 12px;
  margin: 0;
  position: absolute;
  top: 56px;
  right: 0;
  transition: opacity 0.3s ease-in-out;
  border-radius: 16px 0 0 16px;
  border: 1px solid var(--border);
  max-height: 726px;
  overflow-y: auto;

  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};

  @media (max-width: 900px) {
    max-height: 479px;
  }
`;

const DialItem = styled.button<{ icon: string }>`
  color: var(--text-color);
  text-align: center;
  width: 104px;
  padding: 30px 10px 8px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  border-radius: 12px;
  word-break: auto-phrase;
  box-sizing: border-box;
  color: var(--fColor03);
  background: url(${(props) => props.icon}) no-repeat center top 9px;

  &:hover {
    background-color: var(--background);
  }
`;
