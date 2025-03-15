import { Grid } from "@mui/material";
import { MdSearch } from "@react-icons/all-files/md/MdSearch";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import useAddCharacter from "@core/hooks/mutations/character/useAddCharacter";
import useRecoveryCharacter from "@core/hooks/mutations/character/useRecoveryCharacter";
import useDeletedCharacters from "@core/hooks/queries/character/useDeletedCharacters";
import useModalState from "@core/hooks/useModalState";
import { getIsSpecialist } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Modal from "@components/Modal";

const DeletedCharacterRecovery = () => {
  const queryClient = useQueryClient();
  const [showCharacters, setShowCharacters] = useState(false);
  const getDeletedCharacters = useDeletedCharacters();
  const [searchModal, setSearchModal] = useModalState<boolean>();
  const [searchTerm, setSearchTerm] = useModalState<string>();

  const recoverCharacterMutation = useRecoveryCharacter({
    onSuccess: () => {
      toast.success(`캐릭터가 복구되었습니다.`);
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getDeletedCharacters(),
      });
    },
  });

  const recoverCharacter = (characterId: number, characterName: string) => {
    if (window.confirm(`${characterName}을 복구할까요?`)) {
      recoverCharacterMutation.mutate(characterId);
    }
  };

  if (!getDeletedCharacters.data) {
    return null;
  }

  const clickBtn = () => {
    if (getDeletedCharacters.data.length === 0) {
      toast.error("삭제된 캐릭터가 없습니다.");
    } else {
      setShowCharacters(!showCharacters);
    }
  };

  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchCharacter = () => {
    const searchName = searchInputRef.current?.value || "";

    if (searchName === "") {
      toast("캐릭터명을 입력해주세요.");
    } else {
      addCharacterMutation.mutate(searchName);
      if (searchInputRef.current) {
        searchInputRef.current.value = "";
      }
      setSearchModal(false);
      setSearchTerm(searchName);
    }
  };

  const addCharacterMutation = useAddCharacter({
    onSuccess: () => {
      toast.success(`캐릭터가 추가되었습니다.`);
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
    },
  });

  return (
    <Wrapper>
      <Button onClick={clickBtn}>삭제된 캐릭터 복구</Button>
      <Button onClick={() => setSearchModal(true)} css={buttonCss}>
        캐릭터 추가
      </Button>
      {showCharacters && getDeletedCharacters.data.length > 0 && (
        <CharacterList>
          <Instruction>캐릭터를 클릭하면 복구할 수 있습니다.</Instruction>
          <Grid container spacing={1.5} overflow="hidden">
            {getDeletedCharacters.data.map((character) => (
              <Item key={character.characterId} item>
                <Body
                  onClick={() =>
                    recoverCharacter(
                      character.characterId,
                      character.characterName
                    )
                  }
                >
                  <CharacterBox
                    style={{
                      backgroundImage:
                        character.characterImage !== null
                          ? `url(${character.characterImage})`
                          : undefined,
                      backgroundPosition: getIsSpecialist(
                        character.characterClassName
                      )
                        ? "left 10px top -80px"
                        : "left 10px top -30px",
                    }}
                  >
                    <Server>
                      @{character.serverName} {character.characterClassName}
                    </Server>
                    <Nickname>{character.characterName}</Nickname>
                    <Level>Lv. {character.itemLevel}</Level>
                  </CharacterBox>
                </Body>
              </Item>
            ))}
          </Grid>
        </CharacterList>
      )}
      <Modal
        title="추가할 캐릭터 검색"
        isOpen={!!searchModal}
        onClose={() => setSearchModal(false)}
      >
        <SearchUserWrapper
          onSubmit={(e) => {
            e.preventDefault();

            searchCharacter();
          }}
        >
          <Input type="text" placeholder="캐릭터 검색" ref={searchInputRef} />
          <Button css={searchButtonCss} variant="icon" type="submit">
            <MdSearch size="24" />
          </Button>
        </SearchUserWrapper>
      </Modal>
    </Wrapper>
  );
};

export default DeletedCharacterRecovery;

const Wrapper = styled.div`
  margin-bottom: 12px;
`;

const CharacterList = styled.div`
  padding: 8px;
  margin-top: 12px;
  width: 88%;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
`;

const Instruction = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
  margin-left: 15px;
`;

const Item = styled(Grid)`
  width: 192px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const CharacterBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 15px;
  height: 112px;
  border-radius: 10px; /* 둥근 모서리 */
  line-height: 1.1;
  color: ${({ theme }) => theme.app.palette.gray[0]};
  border: 1px solid ${({ theme }) => theme.app.border};
  background-color: ${({ theme }) => theme.app.palette.gray[500]};
  background-size: 150%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 효과 */

  &:hover {
    transform: scale(1.02); /* 약간의 확대 효과 */
    cursor: pointer;
    border: 2px solid ${({ theme }) => theme.app.bg.reverse};
  }
`;

const Server = styled.span`
  margin-bottom: 6px;
  font-size: 12px;
`;

const Nickname = styled.span`
  margin-bottom: 3px;
  font-size: 16px;
  font-weight: bold; /* 강조된 이름 */
`;

const Level = styled.span`
  font-size: 14px;
`;

const buttonCss = css`
  margin-left: 5px;
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
