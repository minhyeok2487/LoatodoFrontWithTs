import { FormControlLabel, SelectChangeEvent, Switch } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

import * as friendApi from "@core/apis/Friend.api";
import { ModalType, modalState } from "@core/atoms/Modal.atom";
import { calculateRaidStatus } from "@core/func/todo.fun";
import { CharacterType } from "@core/types/Character.type";
import { FriendSettings, FriendType } from "@core/types/Friend.type";

interface Props {
  characters?: CharacterType[];
  friend?: FriendType;
}

const MainRaids: FC<Props> = ({ characters, friend }) => {
  const navigate = useNavigate();
  const [modal, setModal] = useRecoilState<ModalType>(modalState);
  const { refetch: refetchFriends } = friendApi.useFriends();

  if (characters === undefined) {
    return null;
  }

  const raidStatus = calculateRaidStatus(characters);

  const handleRowClick = (nickName: string) => {
    const link = `/friends/${nickName}`;
    navigate(link);
  };

  return (
    <div className="main-raids">
      <div className="main-raids-header">
        {friend?.nickName ? (
          <>
            <div style={{ display: "flex" }}>
              <h2>[{friend?.nickName}] 깐부 현황</h2>
              <div className="btn-work" style={{ marginLeft: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    // 구현 예정
                  }}
                >
                  깐부 설정 수정
                </button>
              </div>
            </div>
            <div className="btn-work">
              <button
                type="button"
                onClick={() => handleRowClick(friend?.nickName)}
              >
                숙제 바로가기
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>내 레이드 별 현황</h2>
            <div className="btn-work">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/todo";
                }}
              >
                숙제 바로가기
              </button>
            </div>
          </>
        )}
      </div>
      <div className="main-raids-content">
        {raidStatus.map((raid, index) => {
          const backgroundImageUrl = `raid-images/${raid.name}.jpg`;
          return (
            <div
              key={index}
              className="radis-content-box"
              style={{
                backgroundImage: `linear-gradient(
                rgba(0, 0, 0, 0.4),
                rgba(0, 0, 0, 0.4)
              ), url(${backgroundImageUrl})`,
              }}
            >
              <p className="raid-name">{raid.name}</p>
              <p className="radi-score">
                {raid.count} / {raid.totalCount}
              </p>
              <p className="radi-summary">
                <span>
                  딜 <em>{raid.dealerCount}</em>
                </span>
                <span> </span>
                <span>
                  폿 <em>{raid.supportCount}</em>
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainRaids;
