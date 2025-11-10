import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import {
  showSortFormAtom,
  showWideAtom,
  todoServerAtom,
} from "@core/atoms/todo.atom";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import { useServerTodos } from "@core/hooks/queries/todo";
import {
  useCheckServerTodo,
  useToggleServerTodoEnabled,
} from "@core/hooks/mutations/todo";
import useModalState from "@core/hooks/useModalState";
import type { ServerName } from "@core/types/lostark";
import { getServerCounts, getTodayWeekday } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Dial from "@components/Dial";
import Modal from "@components/Modal";
import SortCharacters from "@components/SortCharacters";
import TestDataNotify from "@components/TestDataNotify";
import Profit from "@components/todo/Profit";
import ServerTodos from "@components/todo/ServerTodos";
import TodoList from "@components/todo/TodoList";

interface ServerTodoSummaryItem {
  todoId: number;
  name: string;
  checked: boolean;
  serverName: ServerName;
  hasState: boolean;
}

const TodoIndex = () => {
  const [todoServer, setTodoServer] = useAtom(todoServerAtom);
  const showSortForm = useAtomValue(showSortFormAtom);
  const getCharacters = useCharacters();
  const queryClient = useQueryClient();

  const visibleCharacters = useMemo(() => {
    return (getCharacters.data || []).filter(
      (character) => character.settings.showCharacter
    );
  }, [getCharacters.data]);

  const characters = useMemo(() => {
    return visibleCharacters.filter((character) =>
      todoServer === "전체"
        ? true
        : character.serverName === todoServer
    );
  }, [visibleCharacters, todoServer]);

  const serverCounts = useMemo(() => {
    return getServerCounts(visibleCharacters);
  }, [visibleCharacters]);

  const servers = Object.keys(serverCounts) as ServerName[];
  const [showWide, setShowWide] = useAtom(showWideAtom);
  const [serverTodoModal, setServerTodoModal] = useModalState<boolean>();
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
    const stateMap = states.reduce<Record<string, typeof states[number]>>(
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
        {characters.length > 0 && <Profit characters={characters} />}

        {showSortForm && <SortCharacters characters={characters} />}

        {(showServerButtons || visibleServers.length > 0) && (
          <ControlsRow>
            <ControlCard>
              <ControlHeader>
                <ControlTitle>출력</ControlTitle>
                {visibleServers.length > 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => setServerTodoModal(true)}
                  >
                    원정대 숙제 관리
                  </Button>
                )}
              </ControlHeader>

              {showServerButtons && (
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
                      const summary =
                        serverTodoSummaries[serverName as ServerName];

                      return (
                        <Button
                          key={serverName}
                          css={
                            variant === "outlined"
                              ? css`
                                  background: ${({ theme }) =>
                                    theme.app.bg.white};
                                `
                              : undefined
                          }
                          variant={variant}
                          onClick={() =>
                            setTodoServer(serverName as ServerName)
                          }
                        >
                          <ButtonContent>
                            <ButtonTitle>
                              {serverName} {count}개
                            </ButtonTitle>
                            {summary && summary.length > 0 && (
                              <TodoSummary>
                                {summary.map((item) => (
                                  <TodoBadge
                                    key={`${serverName}-${item.name}`}
                                    $checked={item.checked}
                                    $disabled={isServerTodoUpdating}
                                    role="button"
                                    tabIndex={isServerTodoUpdating ? -1 : 0}
                                    aria-pressed={item.checked}
                                    aria-disabled={isServerTodoUpdating}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      if (isServerTodoUpdating) {
                                        return;
                                      }
                                      handleSummaryToggle(item);
                                    }}
                                    onKeyDown={(event) => {
                                      if (isServerTodoUpdating) {
                                        return;
                                      }
                                      if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        handleSummaryToggle(item);
                                      }
                                    }}
                                  >
                                    {item.name}
                                  </TodoBadge>
                                ))}
                              </TodoSummary>
                            )}
                          </ButtonContent>
                        </Button>
                      );
                    })}
                </Buttons>
              )}
            </ControlCard>
          </ControlsRow>
        )}

        <TodoList characters={characters} />
      </Wrapper>

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

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  flex-wrap: wrap;
`;

const ControlsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ControlCard = styled.div`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  padding: 14px;
  background: ${({ theme }) => theme.app.bg.white};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ModalBody = styled.div`
  width: min(600px, 90vw);
  max-height: 70vh;
  overflow-y: auto;
`;

const ControlTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark2};
  letter-spacing: -0.2px;
`;

const ControlHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
`;

const ButtonTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
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
  transition: background 0.2s ease, color 0.2s ease, opacity 0.2s ease;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  user-select: none;
`;
