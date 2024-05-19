import { useParams } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useFriends } from "../../core/apis/Friend.api";
import { useEffect, useState } from "react";
import { CharacterType } from "../../core/types/Character.type";
import { useRecoilValue } from "recoil";
import { sortForm } from "../../core/atoms/SortForm.atom";
import TodoDial from "../todo/components/TodoDial";
import TodoProfit from "../todo/components/TodoProfit";
import CharacterSortForm from "../../components/CharacterSortWrap/CharacterSortForm";
import TodoServerAndChallenge from "../todo/components/TodoServerAndChallenge";
import TodoContent from "../todo/components/TodoContent";
import TestDataNotify from "../../components/TestDataNotify";
import { findManyCharactersServer, getServerList } from "../../core/func/todo.fun";

const FriendTodo = () => {
  const { nickName } = useParams();
  const { data: friends } = useFriends();
  const showSortForm = useRecoilValue(sortForm);
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [serverCharacters, setServerCharacters] = useState<CharacterType[]>([]);
  const [serverList, setServerList] = useState(new Map());
  const [server, setServer] = useState("");

  useEffect(() => {
    if (friends) {
      const friend = friends.find((friend) => friend.nickName === nickName);
      if (friend) {
        const chars = friend.characterList;
        const server = findManyCharactersServer(chars);
        const filteredChars = chars.filter((character) => character.serverName === server);
        
        setCharacters(chars);
        setServer(server);
        setServerCharacters(filteredChars);
        setServerList(getServerList(chars));
      }
    }
  }, [friends, nickName]);

  if (!friends || !characters.length || !serverCharacters.length || !serverList.size) {
    return null;
  }

  return (
    <>
      <TodoDial />
      <DefaultLayout>
        <TestDataNotify />

        {/* 일일 수익, 주간수익 */}
        <TodoProfit characters={serverCharacters} />

        {/* 캐릭터 정렬(활성시만 보임) */}
        {showSortForm && (
          <CharacterSortForm
            characters={serverCharacters}
            friendSetting={true}
          />
        )}

        {/* 도비스/도가토 버튼 */}
        <TodoServerAndChallenge
          characters={serverCharacters}
          serverList={serverList}
        />

        {/* 일일/주간 숙제 */}
        <TodoContent characters={serverCharacters} />
      </DefaultLayout>
    </>
  );
};

export default FriendTodo;
