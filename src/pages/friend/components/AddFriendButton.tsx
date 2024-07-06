import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { MdGroupAdd } from "@react-icons/all-files/md/MdGroupAdd";
import { MdSearch } from "@react-icons/all-files/md/MdSearch";
import { useRef } from "react";
import { toast } from "react-toastify";

import useCharacters from "@core/hooks/queries/character/useCharacters";
import useModalState from "@core/hooks/useModalState";

import Modal from "@components/Modal";

import SearchResultModal from "./SearchResultModal";

const FriendAddBtn = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchUserModal, setSearchUserModal] = useModalState<boolean>();
  const [searchTerm, setSearchTerm] = useModalState<string>();

  const getCharacters = useCharacters();

  const searchFriend = () => {
    const searchName = searchInputRef.current?.value || "";

    if (searchName === "") {
      toast("캐릭터 명을 입력하여주십시오.");
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
      <AddButton
        variant="text"
        startIcon={<MdGroupAdd />}
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

      <SearchResultModal
        onClose={() => setSearchTerm(undefined)}
        isOpen={!!searchTerm}
        searchTerm={searchTerm || ""}
      />
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
  padding: 1px;
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
  border-radius: 10px;
`;
