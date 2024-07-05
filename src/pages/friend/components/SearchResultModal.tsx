import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";

import useHandleFriendRequest from "@core/hooks/mutations/friend/useHandleFriendRequest";
import useSendFriendRequest from "@core/hooks/mutations/friend/useSendFriendRequest";
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
  const sendFriendRequest = useSendFriendRequest({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
      toast.success("요청이 정상적으로 처리되었습니다.");
      onClose();
    },
  });
  const handleFriendRequest = useHandleFriendRequest({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
      toast.success("요청이 정상적으로 처리되었습니다.");
      onClose();
    },
  });

  useEffect(() => {
    if (searchCharacter.isError) {
      onClose();
    }
  }, [searchCharacter.isError]);

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
                        onClick={() => {
                          if (window.confirm("해당 요청을 삭제하시겠습니까?")) {
                            handleFriendRequest.mutate({
                              fromUsername: character.username,
                              action: "reject",
                            });
                          }
                        }}
                      >
                        깐부 요청 진행 중
                      </Button>
                    );
                  case "깐부 요청 받음":
                    return (
                      <>
                        <Button
                          onClick={() => {
                            handleFriendRequest.mutate({
                              fromUsername: character.username,
                              action: "ok",
                            });
                          }}
                        >
                          수락
                        </Button>
                        <Button
                          color="error"
                          onClick={() => {
                            if (
                              window.confirm(
                                `${character.characterName}님의 깐부 요청을 거절하시겠습니까?`
                              )
                            ) {
                              handleFriendRequest.mutate({
                                fromUsername: character.username,
                                action: "reject",
                              });
                            }
                          }}
                        >
                          거절
                        </Button>
                      </>
                    );
                  case "깐부":
                    return <Button disabled>깐부</Button>;
                  case "깐부 요청":
                    return (
                      <Button
                        focusRipple={false}
                        onClick={() => {
                          sendFriendRequest.mutate(character.username);
                        }}
                      >
                        깐부 요청
                      </Button>
                    );
                  default:
                    return (
                      <Button
                        color="error"
                        onClick={() => {
                          if (
                            window.confirm(`해당 요청을 삭제 하시겠습니까?`)
                          ) {
                            handleFriendRequest.mutate({
                              fromUsername: character.username,
                              action: "delete",
                            });
                          }
                        }}
                      >
                        요청 거부됨
                      </Button>
                    );
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
