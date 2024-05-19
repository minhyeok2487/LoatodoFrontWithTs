import { FC } from "react";
import { CharacterType } from "../../../../core/types/Character.type";
import * as characterApi from "../../../../core/apis/Character.api";
import * as friendApi from "../../../../core/apis/Friend.api";
import { FriendType } from "../../../../core/types/Friend.type";
import { loading } from "../../../../core/atoms/Loading.atom";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
interface Props {
  character: CharacterType;
  friend?: FriendType;
}
const SilmaelChangeComponent: FC<Props> = ({ character, friend }) => {
  const { refetch: refetchCharacters } = characterApi.useCharacters();
  const { refetch: refetchFriends } = friendApi.useFriends();

  const setLoadingState = useSetRecoilState(loading);
  /*실마엘 체크*/
  const silmaelChange = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
      }
      try {
        await friendApi.silmaelChange(character);
        refetchFriends();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    } else {
      try {
        await characterApi.silmaelChange(character);
        refetchCharacters();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    }
    setLoadingState(false);
  };

  /*실마엘 체크(우클릭)*/
  const silmaelChangeAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    silmaelChange();
  };

  return (
    <div className="content-wrap">
      <div
        className="content"
        style={{
          height: 35,
          position: "relative",
          justifyContent: "space-between",
          fontSize: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => silmaelChange()}
          onContextMenu={(e) => silmaelChangeAll(e)}
        >
          <button
            className={`content-button ${
              character.silmaelChange ? "done" : ""
            }`}
            style={{ cursor: "pointer" }}
          ></button>
          <div
            className={`${character.silmaelChange ? "text-done" : ""}`}
            style={{ width: "100%" }}
          >
            실마엘 혈석 교환
          </div>
        </div>
      </div>
    </div>
  );
};

export default SilmaelChangeComponent;
