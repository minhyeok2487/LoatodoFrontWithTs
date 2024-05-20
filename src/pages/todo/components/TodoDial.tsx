import { useState } from "react";
import "../../../styles/Dial.css";
import { useRecoilState } from "recoil";
import { sortForm } from "../../../core/atoms/SortForm.atom";
import {
  updateCharacters,
  useCharacters,
} from "../../../core/apis/Character.api";
import { toast } from "react-toastify";

const TodoDial = () => {
  const { refetch: refetchCharacters } = useCharacters();
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [showSortForm, setShowSortForm] = useRecoilState(sortForm);
  const handleToggleSpeedDial = () => {
    setIsSpeedDialOpen(!isSpeedDialOpen);
  };

  const handleAction = async (name: string) => {
    try {
      if (name === "캐릭터 순서 변경") {
        setShowSortForm(!showSortForm);
      } else if (name === "출력 내용 변경") {
        window.location.href = "/setting";
      } else if (name === "캐릭터 정보 업데이트") {
        try {
          await updateCharacters();
          await refetchCharacters();
          toast("캐릭터 정보가 업데이트 되었습니다.");
        } catch (error) {
          console.log(error);
        }
      } else if (name === "등록 캐릭터 삭제") {
        // openDeleteUserCharactersForm();
      } else if (name === "중복 캐릭터 삭제") {
        // response = await call("/member/duplicate", "DELETE", null);
        // setCharacters(response);
        // showMessage("중복된 캐릭터를 삭제하였습니다.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSpeedDialOpen(!isSpeedDialOpen);
    }
  };

  const menus = [
    { name: "캐릭터 순서 변경" },
    { name: "출력 내용 변경" },
    { name: "캐릭터 정보 업데이트" },
    // { name: "등록 캐릭터 삭제" },
    // { name: "중복 캐릭터 삭제" },
  ];
  return (
    <div className="speed-dial-menu">
      <button className="speed-dial-button" onClick={handleToggleSpeedDial}>
        {isSpeedDialOpen ? "x" : "+"}
      </button>
      <ul className={`speed-dial-items ${isSpeedDialOpen ? "active" : ""}`}>
        {menus.map((menu) => (
          <li
            key={menu.name}
            className="speed-dial-item"
            onClick={() => handleAction(menu.name)}
          >
            {menu.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoDial;
