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
import TodoDial from "./components/TodoDial";
import { sortForm } from "../../core/atoms/SortForm.atom";
import CharacterSortForm from "../../components/CharacterSortWrap/CharacterSortForm";
import GoogleAdvertise from "../../components/GoogleAdvertise";

const TodoIndex = () => {
  const { data: characters } = useCharacters();
  const [serverCharacters, setServerCharacters] = useState<CharacterType[]>([]);
  const [serverList, setServerList] = useState(new Map());
  const server = useRecoilValue(serverState);
  const showSortForm = useRecoilValue(sortForm);

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
    <>
      <TodoDial />
      <DefaultLayout>
        <TestDataNotify />

        {/* 일일 수익, 주간수익 */}
        <TodoProfit />

        {/*캐릭터 정렬(활성시만 보임)*/}
        {showSortForm && (
          <CharacterSortForm
            characters={serverCharacters}
            friendSetting={false}
          />
        )}

        {/*도비스/도가토 버튼*/}
        <TodoServerAndChallenge
          characters={serverCharacters}
          serverList={serverList}
        />

        <GoogleAdvertise
          client="ca-pub-9665234618246720"
          slot="2191443590"
          format="horizontal"
          responsive="false"
        />

        {/*일일/주간 숙제*/}
        <TodoContent characters={serverCharacters} />
      </DefaultLayout>
    </>
  );
};

export default TodoIndex;
