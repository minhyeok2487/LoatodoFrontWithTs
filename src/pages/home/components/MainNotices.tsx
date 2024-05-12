import {  useState } from "react";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Notices from "./Notices";

const MainNotices = () => {
  const [noticeGroup, setNoticeGroup] = useState("로아투두");
 
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string
  ) => {
    if (newValue !== null) {
      setNoticeGroup(newValue);
    }
  };

  return (
    <div className="main-notices">
      <div className="main-notices-header">
        <h2>소식</h2>
        <ToggleButtonGroup
          color={"primary"}
          value={noticeGroup}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="로아투두">로아투두</ToggleButton>
          <ToggleButton value="로스트아크">로스트아크</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="notice-board-container">
        {noticeGroup === "로스트아크" && (
          <Notices type="Lostark" />
        )}
        {noticeGroup === "로아투두" && (
          <Notices type="LoaTodo" />
        )}
      </div>
    </div>
  );
};

export default MainNotices;
