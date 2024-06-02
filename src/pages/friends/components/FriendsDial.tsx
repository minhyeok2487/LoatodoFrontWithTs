import "../../../styles/Dial.css";
import { useRecoilState } from "recoil";
import { sortForm } from "../../../core/atoms/SortForm.atom";
import { useNavigate } from "react-router-dom";
import { useFriends } from "../../../core/apis/Friend.api";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const FriendsDial = () => {
  const [showSortForm, setShowSortForm] = useRecoilState(sortForm);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const { data: friends } = useFriends();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleSpeedDial = () => {
    setIsSpeedDialOpen(!isSpeedDialOpen);
  };

  const handleAction = async (name: string) => {
    if (name === "캐릭터 순서 변경") {
      setShowSortForm(!showSortForm);
    } else if (name === "출력 유무 변경") {
    }
  };

  const menus = [{ name: "캐릭터 순서 변경" }];

  return (
    <div className="speed-dial-menu">
      <button className="speed-dial-button" onClick={handleToggleSpeedDial}>
        {isSpeedDialOpen ? "+" : "x"}
      </button>
      <ul className={`speed-dial-items ${isSpeedDialOpen ? "" : "active"}`}>
        {menus.map((menu) => (
          <li
            key={menu.name}
            className="speed-dial-item"
            onClick={() => handleAction(menu.name)}
          >
            {menu.name}
          </li>
        ))}
        <li
          className="speed-dial-item mine"
          onClick={() => navigate("/todo")}
        >
          내 숙제
        </li>
        {friends?.map(
          (friend) =>
            location.pathname !==
              `/friends/${encodeURIComponent(friend.nickName)}` && (
              <li
                key={friend.friendId}
                className="speed-dial-item friend"
                onClick={() => navigate(`/friends/${friend.nickName}`)}
              >
                {friend.nickName}
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default FriendsDial;
