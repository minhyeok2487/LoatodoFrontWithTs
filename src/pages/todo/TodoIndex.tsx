import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import styled, { css } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";
import WideDefaultLayout from "@layouts/WideDefaultLayout";

import { showSortFormAtom, todoServerAtom } from "@core/atoms/todo.atom";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import type { ServerName } from "@core/types/lostark";
import { getServerCounts } from "@core/utils";

import Button from "@components/Button";
import Dial from "@components/Dial";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import Profit from "@components/todo/Profit";
import TodoList from "@components/todo/TodoList";

const TodoIndex = () => {
  const [todoServer, setTodoServer] = useAtom(todoServerAtom);
  const showSortForm = useAtomValue(showSortFormAtom);
  const getCharacters = useCharacters();

  const characters = useMemo(() => {
    return (getCharacters.data || []).filter(
      (character) =>
        (todoServer === "전체" ? true : character.serverName === todoServer) &&
        character.settings.showCharacter
    );
  }, [getCharacters.data, todoServer]);

  const serverCounts = useMemo(() => {
    return getServerCounts(getCharacters.data || []);
  }, [getCharacters.data]);

  const servers = Object.keys(serverCounts) as ServerName[];

  return (
    <WideDefaultLayout>
      <Dial />

      <TestDataNotify />

      <Wrapper>
        {characters.length > 0 && <Profit characters={characters} />}

        {showSortForm && <SortCharacters characters={characters} />}

        {((todoServer && servers.length > 1) || characters.length === 0) && (
          <Buttons>
            <Button
              css={
                todoServer !== "전체"
                  ? css`
                      background: ${({ theme }) => theme.app.bg.white};
                    `
                  : undefined
              }
              variant={todoServer === "전체" ? "contained" : "outlined"}
              onClick={() => setTodoServer("전체")}
            >
              전체
            </Button>

            {Object.entries<number>(serverCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([serverName, count]) => {
                const variant =
                  todoServer === serverName ? "contained" : "outlined";

                return (
                  <Button
                    key={serverName}
                    css={
                      variant === "outlined"
                        ? css`
                            background: ${({ theme }) => theme.app.bg.white};
                          `
                        : undefined
                    }
                    variant={variant}
                    onClick={() => setTodoServer(serverName as ServerName)}
                  >
                    {serverName} {count}개
                  </Button>
                );
              })}
          </Buttons>
        )}

        <TodoList characters={characters} />
      </Wrapper>
    </WideDefaultLayout>
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
