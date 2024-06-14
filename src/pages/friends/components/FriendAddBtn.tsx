import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";

import { useCharacters } from "@core/apis/Character.api";
import * as friendApi from "@core/apis/Friend.api";
import { loading } from "@core/atoms/Loading.atom";
import { ModalType, modalState } from "@core/atoms/Modal.atom";

const FriendAddBtn = () => {
  const { data: characters } = useCharacters();
  const { refetch: refetchFriends } = friendApi.useFriends();
  const [modal, setModal] = useRecoilState<ModalType>(modalState);
  const setLoadingState = useSetRecoilState(loading);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const openAddFriendForm = () => {
    const modalTitle = "깐부 캐릭터 검색";
    const modalContent = (
      <div className="friends-search-box">
        <input
          type="text"
          placeholder="캐릭터 검색"
          ref={searchInputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchFriend();
            }
          }}
        />
        <Button variant="text" className="search-button" onClick={searchFriend}>
          <SearchIcon />
        </Button>
      </div>
    );
    setModal({
      ...modal,
      openModal: true,
      modalTitle,
      modalContent,
    });
  };

  const searchFriend = async () => {
    try {
      setLoadingState(true);
      const searchName = searchInputRef.current?.value || "";
      if (searchName === "") {
        toast("캐릭터 명을 입력하여주십시오.");
      } else {
        const response = await friendApi.searchCharacter(searchName);
        createSearchCharacterForm(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingState(false);
    }
  };

  const createSearchCharacterForm = (
    friends: friendApi.searchCharacterResponseType[]
  ) => {
    const modalTitle = "캐릭터 검색 결과";

    const modalContent = (
      <div>
        {friends.map((character) => {
          return (
            <div key={character.id}>
              <p style={{ color: "var(--fColor)" }}>
                {character.username.substring(0, 5) +
                  "*".repeat(character.username.length - 5)}
                {character.areWeFriend === "깐부 요청" && (
                  <Button
                    variant="outlined"
                    onClick={() =>
                      requestFriend(character.areWeFriend, character.username)
                    }
                    style={{ marginLeft: 10 }}
                  >
                    {character.areWeFriend}
                  </Button>
                )}
                {character.areWeFriend === "깐부 요청 진행중" && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      requestFriend(character.areWeFriend, character.username)
                    }
                    style={{ marginLeft: 10 }}
                  >
                    {character.areWeFriend}
                  </Button>
                )}
                {character.areWeFriend === "깐부 요청 받음" && (
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() =>
                      requestFriend(character.areWeFriend, character.username)
                    }
                    style={{ marginLeft: 10 }}
                  >
                    {character.areWeFriend}
                  </Button>
                )}
                {character.areWeFriend === "깐부" && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    style={{ marginLeft: 10, cursor: "default" }}
                  >
                    {character.areWeFriend}
                  </Button>
                )}
              </p>
            </div>
          );
        })}
      </div>
    );

    setModal({
      ...modal,
      openModal: true,
      modalTitle,
      modalContent,
    });
  };

  // 검색 후 요청 메서드
  const requestFriend = async (category: string, fromMember: string) => {
    if (category === "깐부 요청") {
      const response = await friendApi.requestFriend(fromMember);
      if (response) {
        setModal({ ...modal, openModal: false });
        toast("요청이 정상적으로 처리되었습니다.");
        refetchFriends();
      }
    }
    if (
      category === "깐부 요청중" ||
      category === "깐부 요청 받음" ||
      category === "요청 거부"
    ) {
      handleRequest("delete", fromMember);
    }
  };

  const handleRequest = async (category: string, fromMember: string) => {
    const confirmMessage =
      category === "delete" ? "해당 요청을 삭제 하시겠습니까?" : null;

    const userConfirmed = confirmMessage
      ? window.confirm(confirmMessage)
      : true;

    if (userConfirmed) {
      const response = await friendApi.handleRequest(category, fromMember);
      if (response) {
        setModal({ ...modal, openModal: false });
        toast("요청이 정상적으로 처리되었습니다.");
        refetchFriends();
      }
    }
  };

  if (characters === undefined || characters.length < 1) {
    return null;
  }

  return (
    <div className="friends-button-box">
      <Button
        variant="text"
        className="add-button"
        startIcon={<GroupAddIcon />}
        onClick={openAddFriendForm}
      >
        깐부 추가
      </Button>
    </div>
  );
};

export default FriendAddBtn;
