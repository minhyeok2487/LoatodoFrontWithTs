import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { useRef } from "react";
import { MdGroupAdd, MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

import { useCharacters } from "@core/apis/Character.api";
import * as friendApi from "@core/apis/Friend.api";
import type { SearchCharacterResponseType } from "@core/apis/Friend.api";
import { loading } from "@core/atoms/Loading.atom";
import useModalState from "@core/hooks/useModalState";

import Modal from "@components/Modal";

const FriendAddBtn = () => {
  const { data: characters } = useCharacters();
  const { refetch: refetchFriends } = friendApi.useFriends();
  const [loadingState, setLoadingState] = useRecoilState(loading);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchUserModal, setSearchUserModal] = useModalState<boolean>();
  const [searchResultModal, setSearchResultModal] =
    useModalState<SearchCharacterResponseType[]>();

  const searchFriend = async () => {
    try {
      setLoadingState(true);
      const searchName = searchInputRef.current?.value || "";
      if (searchName === "") {
        toast("캐릭터 명을 입력하여주십시오.");
      } else {
        const response = await friendApi.searchCharacter(searchName);
        if (searchInputRef.current) {
          searchInputRef.current.value = "";
        }
        setSearchUserModal();
        setSearchResultModal(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingState(false);
    }
  };

  // 검색 후 요청 메서드
  const requestFriend = async (category: string, fromMember: string) => {
    if (category === "깐부 요청") {
      const response = await friendApi.requestFriend(fromMember);
      if (response) {
        setSearchResultModal();
        toast("요청이 정상적으로 처리되었습니다.");
        refetchFriends();
      }
    }
    if (
      category === "깐부 요청 진행중" ||
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
        setSearchResultModal();
        toast("요청이 정상적으로 처리되었습니다.");
        refetchFriends();
      }
    }
  };

  if (characters === undefined || characters.length < 1) {
    return null;
  }

  return (
    <>
      <AddButton
        variant="text"
        startIcon={<MdGroupAdd />}
        disabled={loadingState}
        onClick={() => setSearchUserModal(true)}
      >
        깐부 추가
      </AddButton>

      <Modal
        title="깐부 캐릭터 검색"
        isOpen={!!searchUserModal}
        onClose={() => setSearchUserModal(false)}
      >
        <SearchUserWrapper
          onSubmit={(e) => {
            e.preventDefault();

            searchFriend();
          }}
        >
          <Input type="text" placeholder="캐릭터 검색" ref={searchInputRef} />
          <SearchButton variant="text" type="submit">
            <MdSearch size="24" />
          </SearchButton>
        </SearchUserWrapper>
      </Modal>

      {searchResultModal && (
        <Modal
          title="캐릭터 검색 결과"
          isOpen={!!searchResultModal}
          onClose={() => setSearchResultModal()}
        >
          <SearchResultWrapper>
            {searchResultModal.map((character) => {
              return (
                <SearchResultRow key={character.id}>
                  {character.username.substring(0, 5) +
                    "*".repeat(character.username.length - 5)}

                  {(() => {
                    switch (character.areWeFriend) {
                      case "깐부 요청 진행중":
                        return (
                          <Button
                            focusRipple={false}
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                              requestFriend(
                                character.areWeFriend,
                                character.username
                              )
                            }
                          >
                            {character.areWeFriend}
                          </Button>
                        );

                      case "깐부 요청 받음":
                        return (
                          <Button
                            focusRipple={false}
                            variant="outlined"
                            color="success"
                            onClick={() =>
                              requestFriend(
                                character.areWeFriend,
                                character.username
                              )
                            }
                          >
                            {character.areWeFriend}
                          </Button>
                        );
                      case "깐부":
                        return (
                          <Button variant="outlined" color="inherit" disabled>
                            {character.areWeFriend}
                          </Button>
                        );
                      case "깐부 요청":
                        return (
                          <Button
                            focusRipple={false}
                            variant="outlined"
                            onClick={() =>
                              requestFriend(
                                character.areWeFriend,
                                character.username
                              )
                            }
                          >
                            {character.areWeFriend}
                          </Button>
                        );
                      default:
                        return null;
                    }
                  })()}
                </SearchResultRow>
              );
            })}
          </SearchResultWrapper>
        </Modal>
      )}
    </>
  );
};

export default FriendAddBtn;

const AddButton = styled(Button)`
  padding: 8px 16px;
  background: ${({ theme }) => theme.app.bg.light};
  color: ${({ theme }) => theme.app.text.main};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;

  &:hover {
    background: ${({ theme }) => theme.app.bg.light};
  }
`;

const SearchUserWrapper = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const Input = styled.input`
  align-self: stretch;
  padding: 0 16px;
  font-size: 16px;
  line-height: 1;
`;

const SearchButton = styled(Button)`
  padding: 10px;
  color: ${({ theme }) => theme.app.text.dark2};
`;

const SearchResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const SearchResultRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.app.text.dark2};

  & + & {
    margin-top: 10px;
  }
`;
