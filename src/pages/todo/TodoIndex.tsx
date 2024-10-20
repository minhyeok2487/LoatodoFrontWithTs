import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { serverAtom, showSortFormAtom } from "@core/atoms/todo.atom";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import { Character } from "@core/types/character";
import type { ServerName } from "@core/types/lostark";
import { getServerList } from "@core/utils";

import Button from "@components/Button";
import Dial from "@components/Dial";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import Profit from "@components/todo/Profit";
import TodoList from "@components/todo/TodoList";

const TodoIndex = () => {
  const getCharacters = useCharacters();
  const [serverCharacters, setServerCharacters] = useState<Character[]>([]);
  const [serverList, setServerList] = useState({});
  const [server, setServer] = useAtom(serverAtom);
  const showSortForm = useAtomValue(showSortFormAtom);

  useEffect(() => {
    if (getCharacters.data && getCharacters.data.length > 0) {
      const visibleCharacters = getCharacters.data.filter(
        (character) => character.settings.showCharacter === true
      );

      const filteredCharacters = visibleCharacters.filter(
        (character) => character.serverName === server
      );

      setServerCharacters(filteredCharacters);

      setServerList(getServerList(visibleCharacters));
    }
  }, [getCharacters.data, server]);

  return (
    <DefaultLayout>
      <Dial />

      <TestDataNotify />

      <Wrapper>
        <Profit characters={serverCharacters} />

        {showSortForm && <SortCharacters characters={serverCharacters} />}

        {server && (
          <Buttons>
            {Object.entries<number>(serverList).map(([serverName, count]) => {
              const variant = server === serverName ? "contained" : "outlined";

              return (
                <Button
                  css={
                    variant === "outlined"
                      ? css`
                          background: ${({ theme }) => theme.app.bg.white};
                        `
                      : undefined
                  }
                  variant={variant}
                  key={serverName}
                  onClick={() => setServer(serverName as ServerName)}
                >
                  {serverName} {count}개
                </Button>
              );
            })}
          </Buttons>
        )}

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
