import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { showSortFormAtom } from "@core/atoms/todo.atom";
import useFriends from "@core/hooks/queries/friend/useFriends";
import type { Friend } from "@core/types/friend";
import type { ServerName } from "@core/types/lostark";
import { findManyCharactersServer, getServerList } from "@core/utils/todo.util";

import Dial from "@components/Dial";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import ChallengeButtons from "@components/todo/ChallengeButtons";
import Profit from "@components/todo/Profit";
import SelectServer from "@components/todo/SelectServer";
import TodoContent from "@components/todo/TodolList";

const FriendTodo = () => {
  const { nickName } = useParams();
  const showSortForm = useAtomValue(showSortFormAtom);

  const getFriends = useFriends();
  const [serverList, setServerList] = useState(new Map());
  const [targetFriend, setTargetFriend] = useState<Friend>();
  const [targetServer, setTargetServer] = useState<ServerName | null>(null);

  useEffect(() => {
    setTargetServer(null);
  }, [nickName]);

  useEffect(() => {
    if (getFriends.data) {
      const targetFriend = getFriends.data.find(
        (friend) => friend.nickName === nickName
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
  }, [getFriends.data, targetServer, nickName]);

  const filteredCharacters = useMemo(() => {
    if (targetFriend) {
      return targetFriend.characterList.filter(
        (char) => char.serverName === targetServer
      );
    }

    return [];
  }, [targetFriend, targetServer]);

  if (!getFriends.data || !serverList.size || filteredCharacters.length === 0) {
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
            <SelectServer
              characters={filteredCharacters}
              serverList={serverList}
              server={targetServer}
              setServer={setTargetServer}
            />
            <ChallengeButtons
              characters={filteredCharacters}
              server={targetServer}
              friend={targetFriend}
            />
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
