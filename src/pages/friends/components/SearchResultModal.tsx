import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import * as friendApi from "@core/apis/friend.api";
import useSearchCharacter from "@core/hooks/queries/friend/useSearchCharacter";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Modal from "@components/Modal";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  searchTerm: string;
}

const SearchResultModal = ({ onClose, isOpen, searchTerm }: Props) => {
  const queryClient = useQueryClient();

  const searchCharacter = useSearchCharacter(searchTerm, {
    enabled: !!searchTerm,
  });

  const handleRequest = async (category: string, fromMember: string) => {
    const confirmMessage =
      category === "delete" ? "해당 요청을 삭제 하시겠습니까?" : null;

    const userConfirmed = confirmMessage
      ? window.confirm(confirmMessage)
      : true;

    if (userConfirmed) {
      const response = await friendApi.handleRequest(category, fromMember);
      if (response) {
        toast.success("요청이 정상적으로 처리되었습니다.");
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getFriends(),
        });
        onClose();
      }
    }
  };

  const requestFriend = async (category: string, fromMember: string) => {
    if (category === "깐부 요청") {
      const response = await friendApi.requestFriend(fromMember);

      if (response) {
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getFriends(),
        });
        toast.success("요청이 정상적으로 처리되었습니다.");
        onClose();
      }
    } else if (
      category === "깐부 요청 진행중" ||
      category === "깐부 요청 받음" ||
      category === "요청 거부"
    ) {
      handleRequest("delete", fromMember);
    }
  };

  return (
    <Modal title="캐릭터 검색 결과" isOpen={isOpen} onClose={onClose}>
      <Wrapper>
        {searchCharacter.data?.map((character) => {
          return (
            <Row key={character.id}>
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
                    return <Button disabled>{character.areWeFriend}</Button>;
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
            </Row>
          );
        })}
      </Wrapper>
    </Modal>
  );
};

export default SearchResultModal;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.app.text.dark2};

  & + & {
    margin-top: 10px;
  }
`;
