import { FC } from "react";
import { CharacterType } from "../../../../core/types/Character.type";
import * as characterApi from "../../../../core/apis/Character.api";
import * as friendApi from "../../../../core/apis/Friend.api";
import { FriendType } from "../../../../core/types/Friend.type";
import { useSetRecoilState } from "recoil";
import { loading } from "../../../../core/atoms/Loading.atom";
import { toast } from "react-toastify";

interface Props {
  character: CharacterType;
  friend?: FriendType;
}
const WeekEponaComponent: FC<Props> = ({ character, friend }) => {
  const { refetch: refetchCharacters } = characterApi.useCharacters();
  const { refetch: refetchFriends } = friendApi.useFriends();

  const setLoadingState = useSetRecoilState(loading);

  /*주간 에포나 체크*/
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

  /*주간 에포나 체크 All*/
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
          fontSize: 14, //pub 수정
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => weekEponaCheck()}
          onContextMenu={(e) => weekEponaCheckAll(e)}
        >
          <button
            className={`content-button ${
              character.weekEpona === 3
                ? "done"
                : character.weekEpona === 1
                ? "ing"
                : character.weekEpona === 2
                ? "ing2"
                : ""
            }`}
            style={{ cursor: "pointer" }}
          ></button>
          <div
            className={`${character.weekEpona === 3 ? "text-done" : ""}`}
            style={{ width: "100%" }}
          >
            주간에포나
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekEponaComponent;
