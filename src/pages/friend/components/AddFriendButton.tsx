import { MdSearch } from "@react-icons/all-files/md/MdSearch";
import { useRef } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import useCharacters from "@core/hooks/queries/character/useCharacters";
import useModalState from "@core/hooks/useModalState";

import Button from "@components/Button";
import Modal from "@components/Modal";

import UserAddIcon from "@assets/images/ico_add_user.png";

import SearchResultModal from "./SearchResultModal";

const FriendAddBtn = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchUserModal, setSearchUserModal] = useModalState<boolean>();
  const [searchTerm, setSearchTerm] = useModalState<string>();

  const getCharacters = useCharacters();

  const searchFriend = () => {
    const searchName = searchInputRef.current?.value || "";

    if (searchName === "") {
      toast("캐릭터명을 입력해주세요.");
    } else {
      if (searchInputRef.current) {
        searchInputRef.current.value = "";
      }
      setSearchUserModal();
      setSearchTerm(searchName);
    }
  };

  if (!getCharacters.data || getCharacters.data.length === 0) {
    return null;
  }
  return (
    <>
      <Button
        css={addButtonCss}
        variant="outlined"
        size="medium"
        onClick={() => setSearchUserModal(true)}
      >
        <img alt="깐부추가" src={UserAddIcon} />
        깐부추가
      </Button>

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
          <Button css={searchButtonCss} variant="icon" type="submit">
            <MdSearch size="24" />
          </Button>
        </SearchUserWrapper>
      </Modal>

      <SearchResultModal
        onClose={() => setSearchTerm(undefined)}
        isOpen={!!searchTerm}
        searchTerm={searchTerm || ""}
      />
    </>
  );
};

export default FriendAddBtn;

const addButtonCss = css`
  height: 40px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.app.bg.white};
  border-radius: 8px;

  img {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
`;

const searchButtonCss = css`
  border-radius: 10px;
  padding: 10px 20px;
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
  background: ${({ theme }) => theme.app.bg.white};
  line-height: 1;
`;
