import { FC } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

import * as characterApi from "@core/apis/Character.api";
import * as friendApi from "@core/apis/Friend.api";
import { loading } from "@core/atoms/Loading.atom";
import { CharacterType } from "@core/types/Character.type";
import { FriendType } from "@core/types/Friend.type";

interface Props {
  character: CharacterType;
  friend?: FriendType;
}
const WeekEponaComponent: FC<Props> = ({ character, friend }) => {
  const { refetch: refetchCharacters } = characterApi.useCharacters();
  const { refetch: refetchFriends } = friendApi.useFriends();

  const setLoadingState = useSetRecoilState(loading);

  /* 주간 에포나 체크 */
  const weekEponaCheck = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
      }
      try {
        await friendApi.weekEponaCheck(character);
        refetchFriends();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    } else {
      try {
        await characterApi.weekEponaCheck(character);
        refetchCharacters();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    }
    setLoadingState(false);
  };

  /* 주간 에포나 체크 All */
  const weekEponaCheckAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
      }
      try {
        await friendApi.weekEponaCheckAll(character);
        refetchFriends();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    } else {
      try {
        await characterApi.weekEponaCheckAll(character);
        refetchCharacters();
      } catch (error) {
        console.error("Error weekEponaCheckAll:", error);
      }
    }
    setLoadingState(false);
  };

  return (
    <div className="content-wrap">
      <div
        className="content"
        style={{
          height: 35,
          position: "relative",
          justifyContent: "space-between",
          fontSize: 14, // pub 수정
        }}
      >
        <button
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            cursor: "pointer",
          }}
          type="button"
          onClick={() => weekEponaCheck()}
          onContextMenu={(e) => weekEponaCheckAll(e)}
        >
          <div
            className={`content-button ${(() => {
              switch (character.weekEpona) {
                case 1:
                  return "ing";
                case 2:
                  return "ing2";
                case 3:
                  return "done";
                default:
                  return "";
              }
            })()}`}
            style={{ cursor: "pointer" }}
          />
          <div
            className={`${character.weekEpona === 3 ? "text-done" : ""}`}
            style={{ width: "100%" }}
          >
            주간에포나
          </div>
        </button>
      </div>
    </div>
  );
};

export default WeekEponaComponent;
