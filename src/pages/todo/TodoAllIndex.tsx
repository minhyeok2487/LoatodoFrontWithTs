import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import DefaultLayout from "@layouts/DefaultLayout";

import { sortForm } from "@core/atoms/sortForm.atom";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import { CharacterType } from "@core/types/character";

import Dial from "@components/Dial";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import Profit from "@components/todo/Profit";
import TodolList from "@components/todo/TodolList";

const TodoAllIndex = () => {
  const { getCharacters } = useCharacters();
  const [visibleCharacters, setVisibleCharacters] = useState<CharacterType[]>(
    []
  );
  const showSortForm = useRecoilValue(sortForm);

  useEffect(() => {
    if (getCharacters.data && getCharacters.data.length > 0) {
      setVisibleCharacters(
        getCharacters.data.filter(
          (character) => character.settings.showCharacter === true
        )
      );
    }
  }, [getCharacters.data]);

  return (
    <DefaultLayout>
      <TestDataNotify />
      <Dial />

      <Wrapper>
        {/* 일일 수익, 주간수익 */}
        <Profit characters={visibleCharacters} />

        {/* 캐릭터 정렬(활성시만 보임) */}
        {showSortForm && <SortCharacters characters={visibleCharacters} />}

        {/* 일일/주간 숙제 */}
        <TodolList characters={visibleCharacters} />
      </Wrapper>
    </DefaultLayout>
  );
};

export default TodoAllIndex;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
