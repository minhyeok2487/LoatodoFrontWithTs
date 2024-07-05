import styled from "@emotion/styled";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DefaultLayout from "@layouts/DefaultLayout";

import { showSortFormAtom } from "@core/atoms/todo.atom";
import useFriends from "@core/hooks/queries/friend/useFriends";
import type { Character } from "@core/types/character";
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
  const [characters, setCharacters] = useState<Character[]>([]);
  const [serverCharacters, setServerCharacters] = useState<Character[]>([]);
  const [serverList, setServerList] = useState(new Map());
  const [friend, setFriend] = useState<Friend>();
  const [server, setServer] = useState<ServerName | null>(null);

  useEffect(() => {
    if (getFriends.data) {
      const localFriend = getFriends.data.find(
        (friend) => friend.nickName === nickName
      );

      if (localFriend) {
        setFriend(localFriend);
        const chars = localFriend.characterList;
        setCharacters(chars);
        setServer(findManyCharactersServer(chars));
        setServerList(getServerList(chars));
      }
    }
  }, [getFriends.data, nickName]);

  useEffect(() => {
    if (characters.length && server) {
      const filteredChars = characters.filter(
        (character) => character.serverName === server
      );
      setServerCharacters(filteredChars);
    }
  }, [characters, server]);

  if (
    !getFriends.data ||
    !characters.length ||
    !serverCharacters.length ||
    !serverList.size ||
    !friend
  ) {
    return null;
  }

  return (
    <DefaultLayout>
      <TestDataNotify />
      <Dial isFriend />

      <Wrapper>
        {/* 일일 수익, 주간수익 */}
        <Profit characters={serverCharacters} />

        {/* 캐릭터 정렬(활성시만 보임) */}
        {showSortForm && (
          <SortCharacters characters={serverCharacters} friend={friend} />
        )}

        {/* 도비스/도가토 버튼 */}
        {server && (
          <Buttons>
            <SelectServer
              characters={serverCharacters}
              serverList={serverList}
              server={server}
              setServer={setServer}
            />
            <ChallengeButtons
              characters={serverCharacters}
              server={server}
              friend={friend}
            />
          </Buttons>
        )}

        {/* 일일/주간 숙제 */}
        <TodoContent characters={serverCharacters} friend={friend} />
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
