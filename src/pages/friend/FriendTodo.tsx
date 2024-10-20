import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { showSortFormAtom } from "@core/atoms/todo.atom";
import useFriends from "@core/hooks/queries/friend/useFriends";
import type { Friend } from "@core/types/friend";
import type { ServerName } from "@core/types/lostark";
import { findManyCharactersServer, getServerList } from "@core/utils";

import Button from "@components/Button";
import Dial from "@components/Dial";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import Profit from "@components/todo/Profit";
import TodoContent from "@components/todo/TodoList";

const FriendTodo = () => {
  const { friendUsername } = useParams<{ friendUsername: string }>();
  const showSortForm = useAtomValue(showSortFormAtom);

  const getFriends = useFriends();
  const [serverList, setServerList] = useState({});
  const [targetFriend, setTargetFriend] = useState<Friend>();
  const [targetServer, setTargetServer] = useState<ServerName | null>(null);

  useEffect(() => {
    setTargetServer(null);
  }, [friendUsername]);

  useEffect(() => {
    if (getFriends.data) {
      const targetFriend = getFriends.data.find(
        (friend) => friend.nickName === friendUsername
      );

      if (targetFriend) {
        setTargetFriend(targetFriend);
        setServerList(getServerList(targetFriend.characterList));

        if (targetServer === null) {
          const newTargetServer = findManyCharactersServer(
            targetFriend.characterList
          );
          setTargetServer(newTargetServer);
        }
      }
    }
  }, [getFriends.data, targetServer, friendUsername]);

  const filteredCharacters = useMemo(() => {
    if (targetFriend) {
      return targetFriend.characterList.filter(
        (char) => char.serverName === targetServer
      );
    }

    return [];
  }, [targetFriend, targetServer]);

  if (!getFriends.data || filteredCharacters.length === 0) {
    return null;
  }

  return (
    <DefaultLayout>
      <TestDataNotify />
      <Dial isFriend />

      <Wrapper>
        {/* 일일 수익, 주간수익 */}
        <Profit characters={filteredCharacters} />

        {/* 캐릭터 정렬(활성시만 보임) */}
        {showSortForm && (
          <SortCharacters
            characters={filteredCharacters}
            friend={targetFriend}
          />
        )}

        {/* 도비스/도가토 버튼 */}
        {targetServer && (
          <Buttons>
            <Buttons>
              {Object.entries<number>(serverList).map(([serverName, count]) => {
                return (
                  <Button
                    variant={
                      targetServer === serverName ? "contained" : "outlined"
                    }
                    key={serverName}
                    onClick={() => setTargetServer(serverName as ServerName)}
                  >
                    {serverName} {count}개
                  </Button>
                );
              })}
            </Buttons>
          </Buttons>
        )}

        {/* 일일/주간 숙제 */}
        <TodoContent characters={filteredCharacters} friend={targetFriend} />
      </Wrapper>
    </DefaultLayout>
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
