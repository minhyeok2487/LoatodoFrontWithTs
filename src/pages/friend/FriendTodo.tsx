import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import { showSortFormAtom } from "@core/atoms/todo.atom";
import {
  useCheckServerTodo,
  useToggleServerTodoEnabled,
} from "@core/hooks/mutations/todo";
import useFriends from "@core/hooks/queries/friend/useFriends";
import { useServerTodos } from "@core/hooks/queries/todo";
import useModalState from "@core/hooks/useModalState";
import usePersistedGridConfig from "@core/hooks/usePersistedGridConfig";
import type { ServerName } from "@core/types/lostark";
import {
  findManyCharactersServer,
  getServerCounts,
  getTodayWeekday,
} from "@core/utils";
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

const FriendTodo = () => {
  const { friendUsername } = useParams<{ friendUsername: string }>();
  const queryClient = useQueryClient();
  const showSortForm = useAtomValue(showSortFormAtom);
  const [gridConfig] = usePersistedGridConfig();
  const getFriends = useFriends();
  const [targetServer, setTargetServer] = useState<ServerName | "전체">("전체");

  const targetFriend = useMemo(() => {
    return getFriends.data?.find(
      (friend) => friend.nickName === friendUsername
    );
  }, [getFriends.data, friendUsername]);

  const visibleFriendCharacters = useMemo(() => {
    return (targetFriend?.characterList || []).filter(
      (character) => character.settings.showCharacter
    );
  }, [targetFriend]);

  const serverCounts = useMemo(() => {
    return getServerCounts(visibleFriendCharacters);
  }, [visibleFriendCharacters]);

  const characters = useMemo(() => {
    return visibleFriendCharacters.filter((character) =>
      targetServer === "전체" ? true : character.serverName === targetServer
    );
  }, [visibleFriendCharacters, targetServer]);

  const visibleServers = useMemo(() => {
    const serverSet = new Set<ServerName>();
    characters.forEach((character) => {
      serverSet.add(character.serverName);
    });

    return Array.from(serverSet) as ServerName[];
  }, [characters]);
  const [serverTodoModal, setServerTodoModal] = useModalState<boolean>();
  const servers = Object.keys(serverCounts) as ServerName[];
  const showServerButtons = servers.length > 0;
  const todayWeekday = getTodayWeekday();
  const serverTodosOverview = useServerTodos(targetFriend?.friendUsername, {
    enabled: Boolean(targetFriend) && servers.length > 0,
  });
  const serverTodoQueryKey = queryKeyGenerator.getServerTodos(
    targetFriend?.friendUsername
  );
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
        summary[serverName as ServerName] = items.slice(0, 3);
      }
    });

    return summary;
  }, [serverTodosOverview.data, servers, todayWeekday]);

  const handleSummaryToggle = async (item: ServerTodoSummaryItem) => {
    if (isServerTodoUpdating || !targetFriend) {
      return;
    }

    if (!item.hasState) {
      try {
        await toggleServerTodoEnabledMutation.mutateAsync({
          friendUsername: targetFriend.friendUsername,
          todoId: item.todoId,
          serverName: item.serverName,
          enabled: true,
        });
      } catch {
        return;
      }
    }

    checkServerTodoMutation.mutate({
      friendUsername: targetFriend.friendUsername,
      todoId: item.todoId,
      serverName: item.serverName,
      checked: !item.checked,
    });
  };

  useEffect(() => {
    if (targetFriend) {
      setTargetServer(findManyCharactersServer(targetFriend.characterList));
    }
  }, [friendUsername]);

  if (!getFriends.data || characters.length === 0) {
    return null;
  }

  return (
    <WideDefaultLayout>
      <TestDataNotify />
      <Dial isFriend friendUsername={targetFriend?.friendUsername} />

      <Wrapper>
        <Profit characters={characters} onSummaryClick={() => {}} />

        {showSortForm && (
          <SortCharacters characters={characters} friend={targetFriend} />
        )}

        {showServerButtons && (
          <ServerChipList>
            {[
              {
                key: "전체",
                label: "전체",
                count: visibleFriendCharacters.length,
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
              const isActive = targetServer === item.key;
              const isAll = item.key === "전체";

              return (
                <ServerChip
                  key={item.key}
                  type="button"
                  aria-pressed={isActive}
                  $active={isActive}
                  onClick={() =>
                    setTargetServer(item.key as ServerName | "전체")
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

        <TodoList
          characters={characters}
          friend={targetFriend}
          gridConfig={gridConfig}
        />
      </Wrapper>

      {visibleServers.length > 0 && (
        <Modal
          title="원정대 공통 숙제"
          isOpen={!!serverTodoModal}
          onClose={() => setServerTodoModal(false)}
        >
          <ModalBody>
            {!!serverTodoModal && (
              <ServerTodos
                servers={visibleServers}
                friend={targetFriend}
                showAllWeekdays
              />
            )}
          </ModalBody>
        </Modal>
      )}
    </WideDefaultLayout>
  );
};

export default FriendTodo;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ModalBody = styled.div`
  width: min(400px, 90vw);
  max-height: 70vh;
  overflow-y: auto;
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
