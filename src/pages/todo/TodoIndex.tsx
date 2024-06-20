import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import DefaultLayout from "@layouts/DefaultLayout";

import { useCharacters } from "@core/apis/Character.api";
import { sortForm } from "@core/atoms/SortForm.atom";
import { serverState } from "@core/atoms/Todo.atom";
import { getServerList } from "@core/func/todo.fun";
import { CharacterType } from "@core/types/Character.type";

import Dial from "@components/Dial";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";

import "@styles/pages/TodoIndex.css";

import TodoContent from "./components/TodoContent";
import TodoProfit from "./components/TodoProfit";
import TodoServerAndChallenge from "./components/TodoServerAndChallenge";

const TodoIndex = () => {
  const { data: characters } = useCharacters();
  const [serverCharacters, setServerCharacters] = useState<CharacterType[]>([]);
  const [serverList, setServerList] = useState(new Map());
  const [server, setServer] = useRecoilState(serverState);
  const showSortForm = useRecoilValue(sortForm);

  useEffect(() => {
    if (characters && characters.length > 0) {
      const visibleCharacters = characters.filter(
        (character) => character.settings.showCharacter === true
      );

      const filteredCharacters = visibleCharacters.filter(
        (character) => character.serverName === server
      );

      setServerCharacters(filteredCharacters);

      if (!serverList.size) {
        setServerList(getServerList(visibleCharacters));
      }
    }
  }, [characters, server]);

  return (
    <DefaultLayout>
      <Dial />

      <TestDataNotify />

      {/* 일일 수익, 주간수익 */}
      <TodoProfit characters={serverCharacters} />

      {/* 캐릭터 정렬(활성시만 보임) */}
      {showSortForm && (
        <SortCharacters characters={serverCharacters} friend={undefined} />
      )}

      {/* 도비스/도가토 버튼 */}
      <TodoServerAndChallenge
        characters={serverCharacters}
        serverList={serverList}
        server={server}
        setServer={setServer}
        friend={undefined}
      />

      {/* 일일/주간 숙제 */}
      <TodoContent characters={serverCharacters} />
    </DefaultLayout>
  );
};

export default TodoIndex;
