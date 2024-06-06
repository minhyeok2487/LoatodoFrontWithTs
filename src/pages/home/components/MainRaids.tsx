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
      {/* 퍼블 테스트 추가 */}
      <div className="tblList">
          <table>
            <colgroup>
              <col style={{ width: "170px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
              <col style={{ width: "120px" }}/>
            </colgroup>
            <tr>
              <th>닉네임</th>
              <th>깐부설정</th>
              <th>깐부삭제</th>
              <th>베히모스</th>
              <th>에키드나 하드</th>
              <th>에키드나 노말</th>
              <th>카멘 하드</th>
              <th>카멘 노말</th>
              <th>상하탑 하드</th>
              <th>상하탑 노말</th>
              <th>일리아칸 하드</th>
              <th>일리아칸 노말</th>
              <th>카양겔 하드</th>
              <th>카양겔 노말</th>
              <th>아브렐슈드 하드</th>
              <th>아브렐슈드 노말</th>
              <th>쿠크세이튼</th>
              <th>비아키스 하드</th>
              <th>비아키스 노말</th>
              <th>발탄 하드</th>
              <th>발탄 노말</th>
            </tr>
            <tr>
              <td><a href="#none" className="radi-name">태정태세문단세음뭐였지</a></td>
              <td><a href="#none" className="radi-set">깐부설정</a></td>
              <td><a href="#none" className="radi-del">깐부삭제</a></td>
              <td>
                <span>1 / <em>1</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿1</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
              <td>
                <span>0 / <em>0</em></span>
                <div className="radi-txt">
                  <span>딜0</span>
                  <span>폿0</span>
                </div>
              </td>
            </tr>
          </table>
      </div>
    </div>

   
  );
};

export default MainRaids;
