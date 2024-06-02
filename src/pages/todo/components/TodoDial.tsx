import "../../../styles/Dial.css";
import { useRecoilState, useSetRecoilState } from "recoil";
import { sortForm } from "../../../core/atoms/SortForm.atom";
import {
  updateCharacters,
  useCharacters,
} from "../../../core/apis/Character.api";
import { toast } from "react-toastify";
import { loading } from "../../../core/atoms/Loading.atom";
import { useFriends } from "../../../core/apis/Friend.api";
import { useNavigate } from "react-router-dom";

const TodoDial = () => {
  const { data: characters, refetch: refetchCharacters } = useCharacters();
  const { data: friends } = useFriends();
  const [showSortForm, setShowSortForm] = useRecoilState(sortForm);
  const setLoadingState = useSetRecoilState(loading);
  const navigate = useNavigate();

  const handleAction = async (name: string) => {
    if (name === "캐릭터 순서 변경") {
      setShowSortForm(!showSortForm);
    } else if (name === "전체 캐릭터 보기") {
      navigate("/todo/all");
    } else if (name === "출력 내용 변경") {
      navigate("/setting");
    } else if (name === "캐릭터 정보 업데이트") {
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
    }
  };

  const menus = [
    { name: "캐릭터 순서 변경" },
    { name: "전체 캐릭터 보기" },
    { name: "출력 내용 변경" },
    { name: "캐릭터 정보 업데이트" },
  ];

  if (characters === undefined || characters.length < 1) {
    return null;
  }

  return (
    <div className="speed-dial-menu">
      <ul className={"speed-dial-items active"}>
        {menus.map((menu) => (
          <li
            key={menu.name}
            className="speed-dial-item"
            onClick={() => handleAction(menu.name)}
          >
            {menu.name}
          </li>
        ))}
        {friends?.map((friend) => (
          <li
            key={friend.friendId}
            className="speed-dial-item"
            onClick={() => navigate(`/friends/${friend.nickName}`)}
          >
            {friend.nickName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoDial;
