import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import DefaultLayout from "@layouts/DefaultLayout";

import { useCharacters } from "@core/apis/Character.api";
import { sortForm } from "@core/atoms/sortForm.atom";
import { serverState } from "@core/atoms/todo.atom";
import { getServerList } from "@core/func/todo.fun";
import { CharacterType } from "@core/types/character";

import Dial from "@components/Dial";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import ChallangeButtons from "@components/todo/ChallangeButtons";
import Profit from "@components/todo/Profit";
import SelectServer from "@components/todo/SelectServer";
import TodoList from "@components/todo/TodolList";

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

      <Wrapper>
        {/* 일일 수익, 주간수익 */}
        <Profit characters={serverCharacters} />

        {/* 캐릭터 정렬(활성시만 보임) */}
        {showSortForm && <SortCharacters characters={serverCharacters} />}

        {/* 도비스/도가토 버튼 */}
        <Buttons>
          <SelectServer
            characters={serverCharacters}
            serverList={serverList}
            server={server}
            setServer={setServer}
          />
          <ChallangeButtons characters={serverCharacters} server={server} />
        </Buttons>

        {/* 일일/주간 숙제 */}
        <TodoList characters={serverCharacters} />
      </Wrapper>
    </DefaultLayout>
  );
};

export default TodoIndex;

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
