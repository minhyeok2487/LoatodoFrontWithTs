import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import { useRecoilState } from "recoil";

import NoticesComponent from "./NoticesComponent";

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

  /* const openDonateModal = () => {
    const modalTitle = "개발자에게 커피한잔";
    var modalContent = (
      <div className="delete-user-characters-form">
        <p style={{ fontWeight: "bold" }}>이용해주셔서 감사합니다!</p>
        <p>
          보내주신 소중한 후원금은 서버 유지 및 발전 비용(카페인)으로
          사용됩니다.
        </p>
        <ul>
          <li>카카오뱅크 3333-08-6962739</li>
          <li>예금주 : 이민혁</li>
        </ul>
      </div>
    );
    setModal({
      ...modal,
      openModal: true,
      modalTitle: modalTitle,
      modalContent: modalContent,
    });
  }; */

  return (
    <div className="main-notices">
      <div className="main-notices-header">
        <h2>소식</h2>
        {/* <div className="donation">
          <div className="donate-btn" onClick={openDonateModal}>
            개발자에게 커피 한잔
          </div>
        </div> */}
        <ToggleButtonGroup
          color="primary"
          value={noticeGroup}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="로아투두">로아투두</ToggleButton>
          <ToggleButton value="로스트아크">로스트아크</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="notice-board-container">
        {noticeGroup === "로스트아크" && <NoticesComponent type="Lostark" />}
        {noticeGroup === "로아투두" && <NoticesComponent type="LoaTodo" />}
      </div>
    </div>
  );
};

export default MainNotices;
