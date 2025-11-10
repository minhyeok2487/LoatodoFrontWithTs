import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import {
  showDailyTodoSortFormAtom,
  showGridFormAtom,
  showSortFormAtom,
  showWideAtom,
  todoServerAtom,
} from "@core/atoms/todo.atom";
import {
  useCheckServerTodo,
  useToggleServerTodoEnabled,
} from "@core/hooks/mutations/todo";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import { useServerTodos } from "@core/hooks/queries/todo";
import useModalState from "@core/hooks/useModalState";
import { usePersistedGridConfig } from "@core/hooks/usePersistedGridConfig";
import type { ServerName } from "@core/types/lostark";
import { getServerCounts, getTodayWeekday } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Dial from "@components/Dial";
import Modal from "@components/Modal";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import DailyTodoSortModal from "@components/todo/DailyTodoSortModal";
import Profit from "@components/todo/Profit";
import ServerTodos from "@components/todo/ServerTodos";
import TodoList from "@components/todo/TodoList";
import GridConfigPanel from "@components/todo/TodoList/GridConfigPanel";
import UncheckedSummaryModal from "@components/todo/UncheckedSummaryModal";

interface ServerTodoSummaryItem {
  todoId: number;
  name: string;
  checked: boolean;
  serverName: ServerName;
  hasState: boolean;
}

interface ServerTodoSummaryItem {
  todoId: number;
  name: string;
  checked: boolean;
  serverName: ServerName;
  hasState: boolean;
}

const TodoIndex = () => {
  const queryClient = useQueryClient();
  const [todoServer, setTodoServer] = useAtom(todoServerAtom);
  const [gridConfig, setGridConfig] = usePersistedGridConfig();
  const [summaryModal, setSummaryModal] = useState(false);
  const [serverTodoModal, setServerTodoModal] = useModalState<boolean>();
  const showSortForm = useAtomValue(showSortFormAtom);
  const showGridForm = useAtomValue(showGridFormAtom);
  const showDailyTodoSortForm = useAtomValue(showDailyTodoSortFormAtom);
  const showWide = useAtomValue(showWideAtom);
  const getCharacters = useCharacters();

  const visibleCharacters = useMemo(() => {
    return (getCharacters.data || []).filter(
      (character) => character.settings.showCharacter
    );
  }, [getCharacters.data]);

  const characters = useMemo(() => {
    return visibleCharacters.filter((character) =>
      todoServer === "전체" ? true : character.serverName === todoServer
    );
  }, [visibleCharacters, todoServer]);

  const serverCounts = useMemo(() => {
    return getServerCounts(visibleCharacters);
  }, [visibleCharacters]);

  const servers = Object.keys(serverCounts) as ServerName[];
  const visibleServers = useMemo(() => {
    const serverSet = new Set<ServerName>();
    characters.forEach((character) => {
      serverSet.add(character.serverName);
    });
    return Array.from(serverSet) as ServerName[];
  }, [characters]);
  const showServerButtons = servers.length > 0;
  const serverTodosOverview = useServerTodos(undefined, {
    enabled: servers.length > 0,
  });
  const todayWeekday = getTodayWeekday();
  const serverTodoQueryKey = queryKeyGenerator.getServerTodos(undefined);

  const toggleServerTodoEnabledMutation = useToggleServerTodoEnabled({
    onSuccess: (overview) => {
      queryClient.setQueryData(serverTodoQueryKey, overview);
    },
    onError: () => {
      toast.error("원정대 숙제 상태를 초기화하지 못했습니다.");
    },
  });

  const checkServerTodoMutation = useCheckServerTodo({
    onSuccess: (overview) => {
      queryClient.setQueryData(serverTodoQueryKey, overview);
    },
    onError: () => {
      toast.error("원정대 숙제를 체크하지 못했습니다.");
    },
  });

  const isServerTodoUpdating =
    toggleServerTodoEnabledMutation.isPending ||
    checkServerTodoMutation.isPending;

  const serverTodoSummaries = useMemo(() => {
    if (!serverTodosOverview.data) {
      return {} as Partial<Record<ServerName, ServerTodoSummaryItem[]>>;
    }

    const { todos, states } = serverTodosOverview.data;
    const stateMap = states.reduce<Record<string, (typeof states)[number]>>(
      (acc, state) => {
        acc[`${state.serverName}-${state.todoId}`] = state;
        return acc;
      },
      {}
    );

    const summary: Partial<Record<ServerName, ServerTodoSummaryItem[]>> = {};

    servers.forEach((serverName) => {
      const items = todos
        .map((todo) => {
          const state = stateMap[`${serverName}-${todo.todoId}`];
          const enabled =
            state?.enabled !== undefined ? state.enabled : todo.defaultEnabled;
          const checked = state?.checked ?? false;
          const visibleToday = todo.visibleWeekdays.includes(todayWeekday);

          if (!enabled || !visibleToday) {
            return null;
          }

          return {
            todoId: todo.todoId,
            serverName: serverName as ServerName,
            name: todo.contentName,
            checked,
            hasState: Boolean(state),
          } as ServerTodoSummaryItem;
        })
        .filter(Boolean) as ServerTodoSummaryItem[];

      if (items.length > 0) {
        summary[serverName] = items.slice(0, 3);
      }
    });

    return summary;
  }, [serverTodosOverview.data, servers, todayWeekday]);

  const handleSummaryToggle = async (item: ServerTodoSummaryItem) => {
    if (isServerTodoUpdating) {
      return;
    }

    if (!item.hasState) {
      try {
        await toggleServerTodoEnabledMutation.mutateAsync({
          todoId: item.todoId,
          serverName: item.serverName,
          enabled: true,
        });
      } catch {
        return;
      }
    }

    checkServerTodoMutation.mutate({
      todoId: item.todoId,
      serverName: item.serverName,
      checked: !item.checked,
    });
  };

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

        {showServerButtons && (
          <ServerChipList>
            {[
              {
                key: "전체",
                label: "전체",
                count: visibleCharacters.length,
                summary: undefined,
              },
              ...Object.entries<number>(serverCounts).map(
                ([serverName, count]) => ({
                  key: serverName,
                  label: serverName,
                  count,
                  summary: serverTodoSummaries[serverName as ServerName],
                })
              ),
            ].map((item) => {
              const isActive = todoServer === item.key;
              const isAll = item.key === "전체";

              return (
                <ServerChip
                  key={item.key}
                  type="button"
                  aria-pressed={isActive}
                  $active={isActive}
                  onClick={() =>
                    setTodoServer(item.key as ServerName | "전체")
                  }
                >
                  <ChipHeader>
                    <ChipTitle>
                      {item.label} {item.count}개
                    </ChipTitle>
                    {isAll && visibleServers.length > 0 && (
                      <ChipButton
                        variant="outlined"
                        onClick={(event) => {
                          event.stopPropagation();
                          setServerTodoModal(true);
                        }}
                      >
                        원정대 숙제 관리
                      </ChipButton>
                    )}
                  </ChipHeader>
                  {!isAll && item.summary && item.summary.length > 0 && (
                    <TodoSummary>
                      {item.summary.map((summaryItem) => (
                        <TodoBadge
                          key={`${item.label}-${summaryItem.name}`}
                          $checked={summaryItem.checked}
                          $disabled={isServerTodoUpdating}
                          role="button"
                          tabIndex={isServerTodoUpdating ? -1 : 0}
                          aria-pressed={summaryItem.checked}
                          aria-disabled={isServerTodoUpdating}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (isServerTodoUpdating) return;
                            handleSummaryToggle(summaryItem);
                          }}
                          onKeyDown={(event) => {
                            if (isServerTodoUpdating) return;
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              event.stopPropagation();
                              handleSummaryToggle(summaryItem);
                            }
                          }}
                        >
                          {summaryItem.name}
                        </TodoBadge>
                      ))}
                    </TodoSummary>
                  )}
                </ServerChip>
              );
            })}
          </ServerChipList>
        )}
        <TodoList characters={characters} gridConfig={gridConfig} />
      </Wrapper>

      <UncheckedSummaryModal
        isOpen={summaryModal}
        onClose={() => setSummaryModal(false)}
        characters={characters}
      />

      {visibleServers.length > 0 && (
        <Modal
          title="원정대 공통 숙제"
          isOpen={!!serverTodoModal}
          onClose={() => setServerTodoModal(false)}
        >
          <ModalBody>
            {!!serverTodoModal && (
              <ServerTodos servers={visibleServers} showAllWeekdays />
            )}
          </ModalBody>
        </Modal>
      )}
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

const ModalBody = styled.div`
  width: min(600px, 90vw);
  max-height: 70vh;
  overflow-y: auto;
`;

const TodoSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const TodoBadge = styled.span<{ $checked: boolean; $disabled: boolean }>`
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid
    ${({ theme, $checked }) =>
      $checked ? theme.app.palette.blue[350] : theme.app.border};
  color: ${({ theme, $checked }) =>
    $checked ? theme.app.palette.blue[350] : theme.app.text.gray1};
  background: ${({ theme, $checked }) =>
    $checked ? theme.app.palette.blue[50] : "transparent"};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition:
    background 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  user-select: none;
`;

const ServerChipList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
`;

const ServerChip = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.app.text.dark2 : theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  cursor: pointer;
  transition:
    border 0.2s ease,
    background 0.2s ease;
`;

const ChipTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark2};
`;

const ChipHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const ChipButton = styled(Button)`
  padding: 4px 8px;
  font-size: 12px;
`;
