import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import DefaultLayout from "@layouts/DefaultLayout";

import { useCharacters } from "@core/apis/Character.api";
import { sortForm } from "@core/atoms/SortForm.atom";
import { CharacterType } from "@core/types/Character.type";

import CharacterSortForm from "@components/CharacterSortWrap/CharacterSortForm";
import TestDataNotify from "@components/TestDataNotify";

import "@styles/pages/TodoIndex.css";

import TodoContent from "./components/TodoContent";
import TodoDial from "./components/TodoDial";
import TodoProfit from "./components/TodoProfit";

// import TodoServerAndChallenge from "./components/TodoServerAndChallenge";

const TodoAllIndex = () => {
  const { data: characters } = useCharacters();
  const [visibleCharacters, setVisibleCharacters] = useState<CharacterType[]>(
    []
  );
  const showSortForm = useRecoilValue(sortForm);

  useEffect(() => {
    if (characters && characters.length > 0) {
      setVisibleCharacters(
        characters.filter(
          (character) => character.settings.showCharacter === true
        )
      );
    }
  }, [characters, visibleCharacters]);

  return (
    <>
      <TodoDial />
      <DefaultLayout>
        <TestDataNotify />

        {/* 일일 수익, 주간수익 */}
        <TodoProfit characters={visibleCharacters} />

        {/* 캐릭터 정렬(활성시만 보임) */}
        {showSortForm && (
          <CharacterSortForm
            characters={visibleCharacters}
            friend={undefined}
          />
        )}

        {/* 일일/주간 숙제 */}
        <TodoContent characters={visibleCharacters} />
      </DefaultLayout>
    </>
  );
};

export default TodoAllIndex;
