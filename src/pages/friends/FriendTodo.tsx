import { useParams } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useFriends } from "../../core/apis/Friend.api";
import { useEffect, useState } from "react";
import { CharacterType } from "../../core/types/Character.type";
import { useRecoilValue } from "recoil";
import { sortForm } from "../../core/atoms/SortForm.atom";
import TodoProfit from "../todo/components/TodoProfit";
import CharacterSortForm from "../../components/CharacterSortWrap/CharacterSortForm";
import TodoServerAndChallenge from "../todo/components/TodoServerAndChallenge";
import TodoContent from "../todo/components/TodoContent";
import TestDataNotify from "../../components/TestDataNotify";
import { findManyCharactersServer, getServerList } from "../../core/func/todo.fun";
import FriendsDial from "./components/FriendsDial";
import { FriendType } from "../../core/types/Friend.type";

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
      const localFriend = friends.find((friend) => friend.nickName === nickName);
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
      const filteredChars = characters.filter((character) => character.serverName === server);
      setServerCharacters(filteredChars);
    }
  }, [characters, server]);

  if (!friends || !characters.length || !serverCharacters.length || !serverList.size || !friend) {
    return null;
  }

  return (
    <>
      <FriendsDial />
      <DefaultLayout>
        <TestDataNotify />

        {/* 일일 수익, 주간수익 */}
        <TodoProfit characters={serverCharacters} />

        {/* 캐릭터 정렬(활성시만 보임) */}
        {showSortForm && (
          <CharacterSortForm
            characters={serverCharacters}
            friend={friend}
          />
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
        <TodoContent characters={serverCharacters} friend={friend}/>
      </DefaultLayout>
    </>
  );
};

export default FriendTodo;
