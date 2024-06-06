import { FC } from "react";
import { calculateRaidStatus } from "../../../core/func/todo.fun";
import { CharacterType } from "../../../core/types/Character.type";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormControlLabel, SelectChangeEvent, Switch } from "@mui/material";
import { FriendSettings, FriendType } from "../../../core/types/Friend.type";
import { useRecoilState } from "recoil";
import { ModalType, modalState } from "../../../core/atoms/Modal.atom";
import * as friendApi from "../../../core/apis/Friend.api";

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
                <button>
                  깐부 설정 수정
                </button>
              </div>
            </div>
            <div className="btn-work">
              <button onClick={() => handleRowClick(friend?.nickName)}>
                숙제 바로가기
              </button>
            </div>
          </>
        ) : (
          <>
            <h2> 레이드 별 현황</h2>
            <div className="btn-work">
              <button onClick={() => (window.location.href = "/todo")}>
                숙제 바로가기
              </button>
            </div>
          </>
        )}
      </div>
      <div className="main-raids-content">
        {raidStatus.map((raid, index) => {
          const backgroundImageUrl = `RaidImages/${raid.name}.JPG`;
          return (
            <div
              key={index}
              className="radis-content-box"
              style={{
                backgroundImage: `linear-gradient(
                rgba(0, 0, 0, 0.3),
                rgba(0, 0, 0, 0.3)
              ), url(${backgroundImageUrl})`,
              }}
            >
              <p className="raid-name">{raid.name}</p>
              <p className="radi-score">
                <em>{raid.count}</em> / {raid.totalCount}
              </p>
              <p className="radi-summary">
                <span>
                  서폿 <em>{raid.supportCount}</em>
                </span>
                <span> / </span>
                <span>
                  딜러 <em>{raid.dealerCount}</em>
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
