import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import DefaultLayout from "@layouts/DefaultLayout";

import TodoContent from "@pages/todo/components/TodoContent";
import TodoServerAndChallenge from "@pages/todo/components/TodoServerAndChallenge";

import { useFriends } from "@core/apis/Friend.api";
import { sortForm } from "@core/atoms/SortForm.atom";
import { findManyCharactersServer, getServerList } from "@core/func/todo.fun";
import { CharacterType } from "@core/types/Character.type";
import { FriendType } from "@core/types/Friend.type";

import Dial from "@components/Dial";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import Profit from "@components/todo/Profit";

const FriendTodo = () => {
  const { nickName } = useParams();
  const { data: friends } = useFriends();
  const showSortForm = useRecoilValue(sortForm);
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [serverCharacters, setServerCharacters] = useState<CharacterType[]>([]);
  const [serverList, setServerList] = useState(new Map());
  const [friend, setFriend] = useState<FriendType>();
  const [server, setServer] = useState("");

  useEffect(() => {
    if (friends) {
      const localFriend = friends.find(
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
  }, [friends, nickName]);

  useEffect(() => {
    if (characters.length && server) {
      const filteredChars = characters.filter(
        (character) => character.serverName === server
      );
      setServerCharacters(filteredChars);
    }
  }, [characters, server]);

  if (
    !friends ||
    !characters.length ||
    !serverCharacters.length ||
    !serverList.size ||
    !friend
  ) {
    return null;
  }

  return (
    <DefaultLayout>
      <Dial isFriend />

      <TestDataNotify />

      {/* 일일 수익, 주간수익 */}
      <Profit characters={serverCharacters} />

      {/* 캐릭터 정렬(활성시만 보임) */}
      {showSortForm && (
        <SortCharacters characters={serverCharacters} friend={friend} />
      )}

      {/* 도비스/도가토 버튼 */}
      <TodoServerAndChallenge
        characters={serverCharacters}
        serverList={serverList}
        server={server}
        setServer={setServer}
        friend={friend}
      />

      {/* 일일/주간 숙제 */}
      <TodoContent characters={serverCharacters} friend={friend} />
    </DefaultLayout>
  );
};

export default FriendTodo;
