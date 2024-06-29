import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { MdGroupAdd } from "@react-icons/all-files/md/MdGroupAdd";
import { MdSearch } from "@react-icons/all-files/md/MdSearch";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

import * as friendApi from "@core/apis/friend.api";
import { loading } from "@core/atoms/loading.atom";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useModalState from "@core/hooks/useModalState";
import type { SearchCharacterItem } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Modal from "@components/Modal";

const FriendAddBtn = () => {
  const queryClient = useQueryClient();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [loadingState, setLoadingState] = useRecoilState(loading);
  const [searchUserModal, setSearchUserModal] = useModalState<boolean>();
  const [searchResultModal, setSearchResultModal] =
    useModalState<SearchCharacterItem[]>();

  const getCharacters = useCharacters();

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
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getFriends(),
        });
        toast("요청이 정상적으로 처리되었습니다.");
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
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getFriends(),
        });
      }
    }
  };

  if (!getCharacters.data || getCharacters.data.length === 0) {
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
                          <Button disabled>{character.areWeFriend}</Button>
                        );
                      case "깐부 요청":
                        return (
                          <Button
                            focusRipple={false}
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
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const Input = styled.input`
  flex: 1;
  align-self: stretch;
  padding: 0 16px;
  font-size: 16px;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.light};
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
