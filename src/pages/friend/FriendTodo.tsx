import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import { showSortFormAtom } from "@core/atoms/todo.atom";
import useFriends from "@core/hooks/queries/friend/useFriends";
import usePersistedGridConfig from "@core/hooks/usePersistedGridConfig";
import type { ServerName } from "@core/types/lostark";
import { findManyCharactersServer, getServerCounts } from "@core/utils";

import Button from "@components/Button";
import Dial from "@components/Dial";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import Profit from "@components/todo/Profit";
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

  const serverCounts = useMemo(() => {
    return getServerCounts(targetFriend?.characterList || []);
  }, [targetFriend]);

  const characters = useMemo(() => {
    return (targetFriend?.characterList || []).filter(
      (character) =>
        (targetServer === "전체"
          ? true
          : character.serverName === targetServer) &&
        character.settings.showCharacter
    );
  }, [targetFriend, targetServer]);

  useEffect(() => {
    if (targetFriend) {
      setTargetServer(findManyCharactersServer(targetFriend.characterList));
    }
  }, [friendUsername]);

  if (!getFriends.data || characters.length === 0) {
    return null;
  }

  const servers = Object.keys(serverCounts) as ServerName[];

  return (
    <WideDefaultLayout>
      <TestDataNotify />
      <Dial isFriend friendUsername={targetFriend?.friendUsername} />

      <Wrapper>
        <Profit characters={characters} />

        {showSortForm && (
          <SortCharacters characters={characters} friend={targetFriend} />
        )}

        {targetServer && servers.length > 1 && (
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

            <Buttons>
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
                              background: ${({ theme }) => theme.app.bg.white};
                            `
                          : undefined
                      }
                      variant={variant}
                      onClick={() => setTargetServer(serverName as ServerName)}
                    >
                      {serverName} {count}개
                    </Button>
                  );
                }
              )}
            </Buttons>
          </Buttons>
        )}

        <TodoList
          characters={characters}
          friend={targetFriend}
          gridConfig={gridConfig}
        />
      </Wrapper>
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
`;
