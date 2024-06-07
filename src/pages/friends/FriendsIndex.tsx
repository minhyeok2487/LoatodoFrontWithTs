import "../../styles/pages/FriendsIndex.css";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useFriends } from "../../core/apis/Friend.api";
import FriendAddBtn from "./components/FriendAddBtn";
import { Button, FormControlLabel, Switch } from "@mui/material";
import * as friendApi from "../../core/apis/Friend.api";
import { toast } from "react-toastify";
import {
  calculateFriendRaids,
} from "../../core/func/todo.fun";
import { FriendType } from "../../core/types/Friend.type";
import { useRecoilState } from "recoil";
import { ModalType, modalState } from "../../core/atoms/Modal.atom";
import { useCharacters } from "../../core/apis/Character.api";
import { Link } from "react-router-dom";

const FriendsIndex = () => {
  const { data: friends, refetch: refetchFriends } = useFriends();
  const { data: characters } = useCharacters();
  const [modal, setModal] = useRecoilState<ModalType>(modalState);

  if (friends === undefined) {
    return null;
  }
  const handleRequest = async (category: string, fromMember: string) => {
    const confirmMessage =
      category === "delete" ? "해당 요청을 삭제 하시겠습니까?" : null;

    const userConfirmed = confirmMessage
      ? window.confirm(confirmMessage)
      : true;

    if (userConfirmed) {
      const response = await friendApi.handleRequest(category, fromMember);
      if (response) {
        toast("요청이 정상적으로 처리되었습니다.");
        refetchFriends();
      }
    }
  };

  const openFriendSettingForm = async (friend: FriendType) => {
    const modalTitle = friend?.nickName + " 권한 설정";
    var modalContent = (
      <div>
        <div>
          <p>
            일일 숙제 출력 권한 :{" "}
            {selectSetting(
              friend!!.friendId,
              friend.toFriendSettings!!.showDayTodo,
              "showDayTodo"
            )}
          </p>
        </div>
        <div>
          <p>
            일일 숙제 체크 권한 :{" "}
            {selectSetting(
              friend!!.friendId,
              friend.toFriendSettings!!.checkDayTodo,
              "checkDayTodo"
            )}
          </p>
        </div>
        <div>
          <p>
            레이드 출력 권한 :{" "}
            {selectSetting(
              friend!!.friendId,
              friend.toFriendSettings!!.showRaid,
              "showRaid"
            )}
          </p>
        </div>
        <div>
          <p>
            레이드 체크 권한 :{" "}
            {selectSetting(
              friend!!.friendId,
              friend.toFriendSettings!!.checkRaid,
              "checkRaid"
            )}
          </p>
        </div>
        <div>
          <p>
            주간 숙제 출력 권한 :{" "}
            {selectSetting(
              friend!!.friendId,
              friend.toFriendSettings!!.showWeekTodo,
              "showWeekTodo"
            )}
          </p>
        </div>
        <div>
          <p>
            주간 숙제 체크 권한 :{" "}
            {selectSetting(
              friend!!.friendId,
              friend.toFriendSettings!!.checkWeekTodo,
              "checkWeekTodo"
            )}
          </p>
        </div>
        <div>
          <p>
            설정 변경 권한 :{" "}
            {selectSetting(
              friend!!.friendId,
              friend.toFriendSettings!!.setting,
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
    const friend = friends.find((el) => el.friendId === friendId);
    await openFriendSettingForm(friend!!);
  };

  const tableHeaders = [
    "닉네임",
    "깐부설정",
    "깐부삭제",
    "베히모스",
    "에키드나",
    "카멘",
    "상하탑",
    "일리아칸",
    "카양겔",
    "아브렐슈드",
    "쿠크세이튼",
    "비아키스",
    "발탄",
  ];

  var characterRaid = null;
  if (characters !== undefined) {
    characterRaid = calculateFriendRaids(characters);
  }

  return (
    <DefaultLayout>
      <div className="friends-wrap">
        <div className="friends-button-group">
          <FriendAddBtn />
        </div>
        {friends.map((friend) => (
          <div className="home-content" key={friend.friendId}>
            {friend.areWeFriend != "깐부" && (
              <div className="main-raids">
                <div className="main-raids-header">
                  <h2>
                    <strong>{friend.nickName}</strong> {friend.areWeFriend}
                  </h2>
                  {friend.areWeFriend === "깐부 요청 받음" && (
                    <div>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          handleRequest("ok", friend.friendUsername)
                        }
                      >
                        수락
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          handleRequest("reject", friend.friendUsername)
                        }
                      >
                        거절
                      </Button>
                    </div>
                  )}
                  {friend.areWeFriend !== "깐부 요청 받음" && (
                    <div>
                      {/* 상태 : {friend.areWeFriend} */}
                      <Button
                        variant="outlined"
                        color="error"
                        style={{ marginLeft: 10 }}
                        onClick={() =>
                          handleRequest("delete", friend.friendUsername)
                        }
                      >
                        요청 삭제
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="cont-wrap">
          <div className="tbl-list">
            <table>
              <colgroup>
                {tableHeaders.map((_, index) => (
                  <col key={index} style={{ width: "120px" }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Link to="/todo" className="radi-name">
                      나
                    </Link>
                  </td>
                  <td>
                  </td>
                  <td>
                  </td>
                  {characterRaid?.map((raid, colIndex) => (
                    <td key={colIndex}>
                      <span>
                        {raid.count} / <em>{raid.totalCount}</em>
                      </span>
                      <div className="radi-txt">
                        <span>딜{raid.dealerCount}</span>
                        <span>폿{raid.supportCount}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                {friends.map((friend, rowIndex) => {
                  if (friend.areWeFriend === "깐부") {
                    const raidStatus = calculateFriendRaids(friend.characterList);
                    return (
                      <tr key={rowIndex}>
                        <td>
                          <Link to={`/friends/${friend.nickName}`} className="radi-name">
                            {friend.nickName}
                          </Link>
                        </td>
                        <td>
                          <button
                            onClick={() => openFriendSettingForm(friend)}
                            className="radi-set"
                          >
                            깐부 설정
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              handleRequest("delete", friend.friendUsername)
                            }
                            className="radi-del"
                          >
                            깐부 삭제
                          </button>
                        </td>
                        {raidStatus.map((raid, colIndex) => (
                          <td key={colIndex}>
                            <span>
                              {raid.count} / <em>{raid.totalCount}</em>
                            </span>
                            <div className="radi-txt">
                              <span>딜{raid.dealerCount}</span>
                              <span>폿{raid.supportCount}</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  } else {
                    return null;
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FriendsIndex;
