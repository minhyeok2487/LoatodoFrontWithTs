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

  const openFriendSettingForm = async (friendSetting: FriendSettings) => {
    const modalTitle = friend?.nickName + " 권한 설정";
    var modalContent = (
      <div>
        <div>
          <p>
            일일 숙제 출력 권한 :{" "}
            {selectSetting(
              friend?.friendId!!,
              friendSetting.showDayTodo,
              "showDayTodo"
            )}
          </p>
        </div>
        <div>
          <p>
            일일 숙제 체크 권한 :{" "}
            {selectSetting(
              friend?.friendId!!,
              friendSetting.checkDayTodo,
              "checkDayTodo"
            )}
          </p>
        </div>
        <div>
          <p>
            레이드 출력 권한 :{" "}
            {selectSetting(
              friend?.friendId!!,
              friendSetting.showRaid,
              "showRaid"
            )}
          </p>
        </div>
        <div>
          <p>
            레이드 체크 권한 :{" "}
            {selectSetting(
              friend?.friendId!!,
              friendSetting.checkRaid,
              "checkRaid"
            )}
          </p>
        </div>
        <div>
          <p>
            주간 숙제 출력 권한 :{" "}
            {selectSetting(
              friend?.friendId!!,
              friendSetting.showWeekTodo,
              "showWeekTodo"
            )}
          </p>
        </div>
        <div>
          <p>
            주간 숙제 체크 권한 :{" "}
            {selectSetting(
              friend?.friendId!!,
              friendSetting.checkWeekTodo,
              "checkWeekTodo"
            )}
          </p>
        </div>
        <div>
          <p>
            설정 변경 권한 :{" "}
            {selectSetting(
              friend?.friendId!!,
              friendSetting.setting,
              "setting"
            )}
          </p>
        </div>
      </div>
    );
    setModal({
      ...modal,
      openModal: true,
      modalTitle: modalTitle,
      modalContent: modalContent,
    });
  };

  const selectSetting = (
    friendId: number,
    setting: boolean,
    settingName: string
  ) => (
    <FormControlLabel
      control={
        <Switch
          id={`${friendId}_${settingName}`}
          onChange={(event, checked) =>
            updateSetting(checked, friendId, settingName)
          }
          checked={setting}
        />
      }
      label=""
    />
  );

  const updateSetting = async (
    checked: boolean,
    friendId: number,
    settingName: string
  ) => {
    const data = await friendApi.editFriendSetting(
      friendId,
      settingName,
      checked
    );
    await refetchFriends();
    await openFriendSettingForm(data);
  };
  return (
    <div className="main-raids">
      <div className="main-raids-header">
        {friend?.nickName ? (
          <>
            <div style={{ display: "flex" }}>
              <h2>[{friend?.nickName}] 깐부 현황</h2>
              <div className="btn-work" style={{ marginLeft: 10 }}>
                <button onClick={() => openFriendSettingForm(friend.toFriendSettings)}>
                  깐부 설정 수정
                </button>
              </div>
              <div
                className="btn-work"
                style={{ marginLeft: 10, border: "1px solid red" }}
              >
                <button onClick={() => toast("기능 준비 중 입니다.")}>
                  깐부 삭제
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
