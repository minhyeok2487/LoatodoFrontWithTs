import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import DefaultLayout from "@layouts/DefaultLayout";

import { sortForm } from "@core/atoms/sortForm.atom";
import { serverAtom } from "@core/atoms/todo.atom";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import { Character } from "@core/types/character";
import { getServerList } from "@core/utils/todo.util";

import Dial from "@components/Dial";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import ChallengeButtons from "@components/todo/ChallengeButtons";
import Profit from "@components/todo/Profit";
import SelectServer from "@components/todo/SelectServer";
import TodoList from "@components/todo/TodolList";

const TodoIndex = () => {
  const getCharacters = useCharacters();
  const [serverCharacters, setServerCharacters] = useState<Character[]>([]);
  const [serverList, setServerList] = useState(new Map());
  const [server, setServer] = useRecoilState(serverAtom);
  const showSortForm = useRecoilValue(sortForm);

  useEffect(() => {
    if (getCharacters.data && getCharacters.data.length > 0) {
      const visibleCharacters = getCharacters.data.filter(
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
  }, [getCharacters.data, server]);

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
        {server && (
          <Buttons>
            <SelectServer
              characters={serverCharacters}
              serverList={serverList}
              server={server}
              setServer={setServer}
            />
            <ChallengeButtons characters={serverCharacters} server={server} />
          </Buttons>
        )}

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
