import { useEffect, useState } from "react";
import TestDataNotify from "../../components/TestDataNotify";
import { useCharacters } from "../../core/apis/Character.api";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../styles/pages/TodoIndex.css";
import TodoContent from "./components/TodoContent";
import TodoProfit from "./components/TodoProfit";
import TodoServerAndChallenge from "./components/TodoServerAndChallenge";
import { useRecoilValue } from "recoil";
import { serverState } from "../../core/atoms/Todo.atom";
import { getServerList } from "../../core/func/todo.fun";
import { CharacterType } from "../../core/types/Character.type";

const TodoIndex = () => {
  const { data: characters } = useCharacters();
  const [serverCharacters, setServerCharacters] = useState<CharacterType[]>([]);
  const [serverList, setServerList] = useState(new Map());
  const server = useRecoilValue(serverState);

  useEffect(() => {
    if (characters) {
      const filteredCharacters = characters.filter(
        (character) => character.serverName === server
      );
      setServerCharacters(filteredCharacters);

      // Only set the server list once when characters are first loaded
      if (!serverList.size) {
        setServerList(getServerList(characters));
      }
    }
  }, [characters, server]);

  if (
    characters === undefined ||
    !serverCharacters.length ||
    !serverList.size
  ) {
    return null;
  }

  return (
    <DefaultLayout>
      <TestDataNotify />

      {/* 일일 수익, 주간수익 */}
      <TodoProfit />

      {/*도비스/도가토 버튼*/}
      <TodoServerAndChallenge
        characters={serverCharacters}
        serverList={serverList}
      />

      {/*일일/주간 숙제*/}
      <TodoContent characters={serverCharacters} />
    </DefaultLayout>
  );
};

export default TodoIndex;
