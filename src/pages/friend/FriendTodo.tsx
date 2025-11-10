import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import { showSortFormAtom } from "@core/atoms/todo.atom";
import useFriends from "@core/hooks/queries/friend/useFriends";
import useModalState from "@core/hooks/useModalState";
import usePersistedGridConfig from "@core/hooks/usePersistedGridConfig";
import type { ServerName } from "@core/types/lostark";
import { findManyCharactersServer, getServerCounts } from "@core/utils";

import Button from "@components/Button";
import Dial from "@components/Dial";
import Modal from "@components/Modal";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import Profit from "@components/todo/Profit";
import ServerTodos from "@components/todo/ServerTodos";
import TodoList from "@components/todo/TodoList";

const FriendTodo = () => {
  const { friendUsername } = useParams<{ friendUsername: string }>();
  const showSortForm = useAtomValue(showSortFormAtom);
  const [gridConfig] = usePersistedGridConfig();
  const getFriends = useFriends();
  const [targetServer, setTargetServer] = useState<ServerName | "전체">("전체");

  const targetFriend = useMemo(() => {
    return getFriends.data?.find(
      (friend) => friend.nickName === friendUsername
    );
  }, [getFriends.data, friendUsername]);

  const visibleFriendCharacters = useMemo(() => {
    return (targetFriend?.characterList || []).filter(
      (character) => character.settings.showCharacter
    );
  }, [targetFriend]);

  const serverCounts = useMemo(() => {
    return getServerCounts(visibleFriendCharacters);
  }, [visibleFriendCharacters]);

  const characters = useMemo(() => {
    return visibleFriendCharacters.filter((character) =>
      targetServer === "전체"
        ? true
        : character.serverName === targetServer
    );
  }, [visibleFriendCharacters, targetServer]);

  const visibleServers = useMemo(() => {
    const serverSet = new Set<ServerName>();
    characters.forEach((character) => {
      serverSet.add(character.serverName);
    });

    return Array.from(serverSet) as ServerName[];
  }, [characters]);
  const [serverTodoModal, setServerTodoModal] = useModalState<boolean>();
  const servers = Object.keys(serverCounts) as ServerName[];
  const showServerButtons = servers.length > 0;

  useEffect(() => {
    if (targetFriend) {
      setTargetServer(findManyCharactersServer(targetFriend.characterList));
    }
  }, [friendUsername]);

  if (!getFriends.data || characters.length === 0) {
    return null;
  }

  return (
    <WideDefaultLayout>
      <TestDataNotify />
      <Dial isFriend friendUsername={targetFriend?.friendUsername} />

      <Wrapper>
        <Profit characters={characters} onSummaryClick={() => {}} />

        {showSortForm && (
          <SortCharacters characters={characters} friend={targetFriend} />
        )}

        {(showServerButtons || visibleServers.length > 0) && (
          <ControlsRow>
            {showServerButtons && (
              <Buttons>
                <Button
                  css={
                    targetServer !== "전체"
                      ? css`
                          background: ${({ theme }) => theme.app.bg.white};
                        `
                      : undefined
                  }
                  variant={targetServer === "전체" ? "contained" : "outlined"}
                  onClick={() => setTargetServer("전체")}
                >
                  전체
                </Button>

                {Object.entries<number>(serverCounts).map(
                  ([serverName, count]) => {
                    const variant =
                      targetServer === serverName ? "contained" : "outlined";

                    return (
                      <Button
                        key={serverName}
                        css={
                          variant === "outlined"
                            ? css`
                                background: ${({ theme }) =>
                                  theme.app.bg.white};
                              `
                            : undefined
                        }
                        variant={variant}
                        onClick={() =>
                          setTargetServer(serverName as ServerName)
                        }
                      >
                        {serverName} {count}개
                      </Button>
                    );
                  }
                )}
              </Buttons>
            )}

            {visibleServers.length > 0 && (
              <Button
                variant="outlined"
                onClick={() => setServerTodoModal(true)}
              >
                원정대 숙제 관리
              </Button>
            )}
          </ControlsRow>
        )}

        <TodoList
          characters={characters}
          friend={targetFriend}
          gridConfig={gridConfig}
        />
      </Wrapper>

      {visibleServers.length > 0 && (
        <Modal
          title="원정대 공통 숙제"
          isOpen={!!serverTodoModal}
          onClose={() => setServerTodoModal(false)}
        >
          <ModalBody>
            {!!serverTodoModal && (
              <ServerTodos
                servers={visibleServers}
                friend={targetFriend}
                showAllWeekdays
              />
            )}
          </ModalBody>
        </Modal>
      )}
    </WideDefaultLayout>
  );
};

export default FriendTodo;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  flex-wrap: wrap;
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const ModalBody = styled.div`
  width: min(400px, 90vw);
  max-height: 70vh;
  overflow-y: auto;
`;
