import { FC } from "react";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

import * as characterApi from "@core/apis/Character.api";
import * as friendApi from "@core/apis/Friend.api";
import { loading } from "@core/atoms/Loading.atom";
import useModalState from "@core/hooks/useModalState";
import { CharacterType } from "@core/types/Character.type";
import { FriendType } from "@core/types/Friend.type";

import CubeRewardsModal from "@components/CubeRewardsModal";

interface Props {
  character: CharacterType;
  friend?: FriendType;
}
const CubeComponent: FC<Props> = ({ character, friend }) => {
  const { refetch: refetchCharacters } = characterApi.useCharacters();
  const { refetch: refetchFriends } = friendApi.useFriends();
  const setLoadingState = useSetRecoilState(loading);
  const [modalState, setModalState] = useModalState();

  /* 큐브 티켓 추가 */
  const addCubeTicket = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
      }
      try {
        await friendApi.addCubeTicket(character);
        refetchFriends();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    } else {
      try {
        await characterApi.addCubeTicket(character);
        refetchCharacters();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    }
    setLoadingState(false);
  };

  /* 큐브 티켓 감소 */
  const substractCubeTicket = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
      }
      try {
        await friendApi.substractCubeTicket(character);
        refetchFriends();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    } else {
      try {
        await characterApi.substractCubeTicket(character);
        refetchCharacters();
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
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
          fontSize: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <button
            className="minus"
            type="button"
            style={{ cursor: "pointer" }}
            onClick={() => substractCubeTicket()}
          >
            -
          </button>
          <div
            style={{
              width: "90px",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            {character.cubeTicket} 장
          </div>
          <button
            className="plus"
            type="button"
            style={{ cursor: "pointer" }}
            onClick={() => addCubeTicket()}
          >
            +
          </button>
          <div style={{ width: "100%", marginLeft: 5 }}>큐브 티켓</div>
          <MdSearch onClick={() => setModalState(character)} />
        </div>
      </div>

      <CubeRewardsModal
        character={character}
        isOpen={!!modalState}
        onClose={() => setModalState()}
      />
    </div>
  );
};

export default CubeComponent;
