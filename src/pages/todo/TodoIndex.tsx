import { useEffect, useState } from "react";
import TestDataNotify from "../../components/TestDataNotify";
import { useCharacters } from "../../core/apis/Character.api";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../styles/pages/TodoIndex.css";
import TodoContent from "./components/TodoContent";
import TodoProfit from "./components/TodoProfit";
import TodoServerAndChallenge from "./components/TodoServerAndChallenge";
import { useRecoilState, useRecoilValue } from "recoil";
import { serverState } from "../../core/atoms/Todo.atom";
import { getServerList } from "../../core/func/todo.fun";
import { CharacterType } from "../../core/types/Character.type";
import TodoDial from "./components/TodoDial";
import { sortForm } from "../../core/atoms/SortForm.atom";
import CharacterSortForm from "../../components/CharacterSortWrap/CharacterSortForm";

const TodoIndex = () => {
  const { data: characters } = useCharacters();
  const [serverCharacters, setServerCharacters] = useState<CharacterType[]>([]);
  const [serverList, setServerList] = useState(new Map());
  const [server, setServer] = useRecoilState(serverState);
  const showSortForm = useRecoilValue(sortForm);

  useEffect(() => {
    if (characters && characters.length > 0) {
      const filteredCharacters = characters.filter(
        (character) => character.serverName === server
      );
      setServerCharacters(filteredCharacters);

      if (!serverList.size) {
        setServerList(getServerList(characters));
      }
    }
  }, [characters, server]);

  return (
    <>
      <TodoDial />
      <DefaultLayout>
        <TestDataNotify />

        {/* 일일 수익, 주간수익 */}
        <TodoProfit characters={serverCharacters} />

        {/*캐릭터 정렬(활성시만 보임)*/}
        {showSortForm && (
          <CharacterSortForm
            characters={serverCharacters}
            friend={undefined}
          />
        )}

        {/*도비스/도가토 버튼*/}
        <TodoServerAndChallenge
          characters={serverCharacters}
          serverList={serverList}
          server={server}
          setServer={setServer}
          friend={undefined}
        />

        {/*일일/주간 숙제*/}
        <TodoContent characters={serverCharacters} />
      </DefaultLayout>
    </>
  );
};

export default TodoIndex;
