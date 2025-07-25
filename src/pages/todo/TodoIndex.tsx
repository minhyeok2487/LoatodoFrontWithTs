import { useAtom, useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import styled, { css } from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import {
  showDailyTodoSortFormAtom,
  showGridFormAtom,
  showSortFormAtom,
  showWideAtom,
  todoServerAtom,
} from "@core/atoms/todo.atom";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import { usePersistedGridConfig } from "@core/hooks/usePersistedGridConfig";
import type { ServerName } from "@core/types/lostark";
import { getServerCounts } from "@core/utils";

import Button from "@components/Button";
import Dial from "@components/Dial";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import DailyTodoSortModal from "@components/todo/DailyTodoSortModal";
import Profit from "@components/todo/Profit";
import TodoList from "@components/todo/TodoList";
import GridConfigPanel from "@components/todo/TodoList/GridConfigPanel";
import UncheckedSummaryModal from "@components/todo/UncheckedSummaryModal";

const TodoIndex = () => {
  const [todoServer, setTodoServer] = useAtom(todoServerAtom);
  const [gridConfig, setGridConfig] = usePersistedGridConfig();
  const showSortForm = useAtomValue(showSortFormAtom);
  const showGridForm = useAtomValue(showGridFormAtom);
  const showDailyTodoSortForm = useAtomValue(showDailyTodoSortFormAtom);
  const getCharacters = useCharacters();
  const [summaryModal, setSummaryModal] = useState(false);

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
  const showWide = useAtomValue(showWideAtom);

  return (
    <WideDefaultLayout>
      <Dial />

      <TestDataNotify />

      <Wrapper $showWide={showWide} $count={characters.length}>
        {characters.length > 0 && (
          <Profit
            characters={characters}
            onSummaryClick={() => setSummaryModal(true)}
          />
        )}

        {showSortForm && <SortCharacters characters={characters} />}
        {showGridForm && (
          <GridConfigPanel
            gridConfig={gridConfig}
            showWide={showWide}
            onConfigChange={setGridConfig}
          />
        )}

        {showDailyTodoSortForm && <DailyTodoSortModal />}

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
        <TodoList characters={characters} gridConfig={gridConfig} />
      </Wrapper>

      <UncheckedSummaryModal
        isOpen={summaryModal}
        onClose={() => setSummaryModal(false)}
        characters={characters}
      />
    </WideDefaultLayout>
  );
};

export default TodoIndex;

const Wrapper = styled.div<{ $showWide: boolean; $count: number }>`
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
