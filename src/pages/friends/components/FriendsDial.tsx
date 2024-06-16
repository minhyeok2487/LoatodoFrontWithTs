import styled from "@emotion/styled";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import { useFriends } from "@core/apis/Friend.api";
import { sortForm } from "@core/atoms/SortForm.atom";

import IconAll from "@assets/images/ico_all.png";
import IconChange from "@assets/images/ico_change.png";
import IconFriend from "@assets/images/ico_friend.png";

const FriendsDial = () => {
  const [showSortForm, setShowSortForm] = useRecoilState(sortForm);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(true);
  const { data: friends } = useFriends();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleSpeedDial = () => {
    setIsSpeedDialOpen(!isSpeedDialOpen);
  };

  const handleAction = async (name: string) => {
    if (name === "캐릭터 순서 변경") {
      setShowSortForm(!showSortForm);
    } /* else if (name === "출력 유무 변경") {
    } */
  };

  const menus = [{ name: "캐릭터 순서 변경", icon: IconChange }];

  return (
    <Wrapper>
      <DialButton type="button" onClick={handleToggleSpeedDial}>
        {isSpeedDialOpen ? "x" : "+"}
      </DialButton>
      <DialBox isOpen={isSpeedDialOpen}>
        {menus.map((menu) => (
          <li key={menu.name}>
            <DialItem onClick={() => handleAction(menu.name)} icon={menu.icon}>
              {menu.name}
            </DialItem>
          </li>
        ))}
        <li>
          <DialItem onClick={() => navigate("/todo")} icon={IconAll}>
            내 숙제
          </DialItem>
        </li>
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
                icon={IconFriend}
              >
                {friend.nickName}
              </FriendDialItem>
            </li>
          ))}
      </DialBox>
    </Wrapper>
  );
};

export default FriendsDial;

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

const FriendDialItem = styled(DialItem)`
  &:first-child {
    border-top: 1px solid var(--border);
  }
`;
