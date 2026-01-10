import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "react-toastify";
import styled, { css, useTheme } from "styled-components";
import { MdClose } from "@react-icons/all-files/md/MdClose";

import {
  useCheckServerTodo,
  useDeleteServerTodo,
  useToggleServerTodoEnabled,
} from "@core/hooks/mutations/todo";
import { useServerTodos } from "@core/hooks/queries/todo";
import type { Friend } from "@core/types/friend";
import type { ServerName } from "@core/types/lostark";
import type { Weekday } from "@core/types/schedule";
import type { CustomTodoFrequency, ServerTodoItem, ServerTodoState } from "@core/types/todo";
import { getTodayWeekday } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Check, * as CheckStyledComponents from "@components/todo/TodoList/element/Check";

interface Props {
  servers: ServerName[];
  friend?: Friend;
  showAllWeekdays?: boolean;
}

interface DerivedServerTodo extends ServerTodoItem {
  serverName: ServerName;
  enabled: boolean;
  checked: boolean;
  isVisibleToday: boolean;
}

const weekdayLabelMap: Record<Weekday, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

const ServerTodos = ({ servers, friend, showAllWeekdays = false }: Props) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const friendUsername = friend?.friendUsername;
  const canView = friend ? friend.fromFriendSettings.showWeekTodo : true;
  const canToggle = friend ? friend.fromFriendSettings.setting : true;
  const canCheck = friend ? friend.fromFriendSettings.checkWeekTodo : true;
  const isOwnTodo = !friend;

  if (friend) {
    console.log("[ServerTodos] friend context", {
      friendUsername,
      nickName: friend.nickName,
      permissions: {
        canView,
        canToggle,
        canCheck,
      },
      fromFriendSettings: friend.fromFriendSettings,
      servers,
      showAllWeekdays,
    });
  }

  const uniqueServers = useMemo(() => {
    return Array.from(new Set(servers)) as ServerName[];
  }, [servers]);

  const todayWeekday = getTodayWeekday();

  const serverTodosQuery = useServerTodos(friendUsername, {
    enabled: canView && uniqueServers.length > 0,
  });

  const queryKey = queryKeyGenerator.getServerTodos(friendUsername);

  const toggleEnabledMutation = useToggleServerTodoEnabled({
    onSuccess: (overview) => {
      queryClient.setQueryData(queryKey, overview);
    },
    onError: () => {
      toast.error("서버 숙제 표시 설정을 변경하지 못했습니다.");
    },
  });

  const checkServerTodoMutation = useCheckServerTodo({
    onSuccess: (overview) => {
      queryClient.setQueryData(queryKey, overview);
    },
    onError: () => {
      toast.error("서버 숙제를 체크하지 못했습니다.");
    },
  });

  const deleteServerTodoMutation = useDeleteServerTodo({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("서버 숙제가 삭제되었습니다.");
    },
    onError: () => {
      toast.error("서버 숙제 삭제에 실패했습니다.");
    },
  });

  if (!canView || uniqueServers.length === 0) {
    return null;
  }

  if (serverTodosQuery.isLoading) {
    return (
      <SectionWrapper>
        <PlaceholderBox>서버 공통 숙제를 불러오는 중...</PlaceholderBox>
      </SectionWrapper>
    );
  }

  const overview = serverTodosQuery.data;

  if (!overview || overview.todos.length === 0) {
    return null;
  }

  const statesByKey = overview.states.reduce<Record<string, ServerTodoState>>(
    (acc, state) => {
      acc[getStateKey(state.serverName, state.todoId)] = state;
      return acc;
    },
    {}
  );

  const sections = uniqueServers.map((serverName) => {
    const mapped = overview.todos.map<DerivedServerTodo>((todo) => {
      const state = statesByKey[getStateKey(serverName, todo.todoId)];
      const enabled =
        state?.enabled !== undefined ? state.enabled : todo.defaultEnabled;
      const checked = state?.checked ?? false;

      return {
        ...todo,
        serverName,
        enabled,
        checked,
        isVisibleToday: todo.visibleWeekdays.includes(todayWeekday),
      };
    });

    const items = showAllWeekdays
      ? mapped
      : mapped.filter((item) => item.enabled && item.isVisibleToday);

    return {
      serverName,
      items,
    };
  });

  const isBusy =
    toggleEnabledMutation.isPending || checkServerTodoMutation.isPending;

  const handleToggle = (
    todoId: number,
    serverName: ServerName,
    enabled: boolean
  ) => {
    if (!canToggle) {
      toast.error("깐부 설정 권한이 없어 변경할 수 없습니다.");
      return;
    }

    toggleEnabledMutation.mutate({
      friendUsername,
      todoId,
      serverName,
      enabled,
    });
  };

  const handleCheck = async (todo: DerivedServerTodo, shouldCheck: boolean) => {
    if (!todo.enabled || (!showAllWeekdays && !todo.isVisibleToday)) {
      return;
    }

    if (!canCheck) {
      toast.error("깐부 체크 권한이 없어 완료 표시를 할 수 없습니다.");
      return;
    }

    if (!statesByKey[getStateKey(todo.serverName, todo.todoId)]) {
      try {
        await toggleEnabledMutation.mutateAsync({
          friendUsername,
          todoId: todo.todoId,
          serverName: todo.serverName,
          enabled: true,
        });
      } catch (error) {
        return;
      }
    }

    checkServerTodoMutation.mutate({
      friendUsername,
      todoId: todo.todoId,
      serverName: todo.serverName,
      checked: shouldCheck,
    });
  };

  const handleDeleteTodo = (todoId: number, todoName: string) => {
    if (window.confirm(`"${todoName}" 숙제를 삭제하시겠습니까?`)) {
      deleteServerTodoMutation.mutate({ todoId });
    }
  };

  const getFrequencyLabel = (frequency?: CustomTodoFrequency) => {
    if (!frequency) return null;
    return frequency === "DAILY" ? "매일" : "주간";
  };

  return (
    <SectionWrapper>
      {sections.map((section) => (
        <ServerBox key={section.serverName}>
          <ServerHeader>
            <ServerHeaderLeft>
              <ServerNameText>{section.serverName}</ServerNameText>
              <SubTitle>원정대 공통 숙제</SubTitle>
            </ServerHeaderLeft>
          </ServerHeader>

          {section.items.length === 0 ? (
            <EmptyRow>
              {showAllWeekdays
                ? "표시할 숙제가 없습니다."
                : "오늘 노출되는 숙제가 없습니다."}
            </EmptyRow>
          ) : (
            section.items.map((todo) => {
              const isDisabled = !todo.enabled;
              const isCustom = todo.custom === true;
              const frequencyLabel = getFrequencyLabel(todo.frequency);

              return (
                <Row key={`${section.serverName}-${todo.todoId}`}>
                  <Check
                    indicatorColor={isCustom ? theme.app.palette.purple[300] : theme.app.palette.blue[350]}
                    totalCount={1}
                    currentCount={todo.checked ? 1 : 0}
                    onClick={() => {
                      if (!isBusy) {
                        handleCheck(todo, !todo.checked);
                      }
                    }}
                    onRightClick={() => {
                      if (!isBusy) {
                        handleCheck(todo, !todo.checked);
                      }
                    }}
                  >
                    <TodoTitle>
                      <span>{todo.contentName}</span>
                      {isCustom && frequencyLabel && (
                        <CustomBadge>{frequencyLabel}</CustomBadge>
                      )}
                      {!isCustom && (
                        <WeekdayBadge>
                          {formatWeekdays(todo.visibleWeekdays)}
                        </WeekdayBadge>
                      )}
                      {isDisabled && <StatusTag>미출력</StatusTag>}
                    </TodoTitle>
                  </Check>
                  <RowActions>
                    {isOwnTodo && isCustom && (
                      <DeleteButton
                        type="button"
                        onClick={() => handleDeleteTodo(todo.todoId, todo.contentName)}
                        disabled={deleteServerTodoMutation.isPending}
                        title="삭제"
                      >
                        <MdClose size={16} />
                      </DeleteButton>
                    )}
                    <ToggleButton
                      type="button"
                      onClick={() =>
                        !isBusy &&
                        handleToggle(todo.todoId, todo.serverName, !todo.enabled)
                      }
                      $enabled={todo.enabled}
                      disabled={isBusy || !canToggle}
                      aria-pressed={todo.enabled}
                    >
                      <ToggleHandle />
                    </ToggleButton>
                  </RowActions>
                </Row>
              );
            })
          )}
        </ServerBox>
      ))}
    </SectionWrapper>
  );
};

export default ServerTodos;

const getStateKey = (serverName: ServerName, todoId: number) => {
  return `${serverName}-${todoId}`;
};

const formatWeekdays = (weekdays: Weekday[]) => {
  return weekdays.map((weekday) => weekdayLabelMap[weekday]).join("·");
};

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ServerBox = styled.div`
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  border-radius: 8px;
  overflow: hidden;
`;

const ServerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.gray2};
`;

const ServerHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ServerNameText = styled.span`
  font-weight: 700;
  font-size: 15px;
`;

const SubTitle = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.gray1};
`;

const EmptyRow = styled.div`
  padding: 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.gray1};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  border-top: 1px solid ${({ theme }) => theme.app.border};

  ${CheckStyledComponents.Wrapper} {
    flex: 1;
  }
`;

const TodoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`;

const WeekdayBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  color: ${({ theme }) => theme.app.palette.blue[350]};
  background: ${({ theme }) => theme.app.palette.blue[50]};
`;

const StatusTag = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.app.text.gray1};
  border: 1px solid ${({ theme }) => theme.app.border};
  padding: 1px 6px;
  border-radius: 6px;
`;

const toggleBase = css<{ $enabled: boolean }>`
  position: relative;
  width: 44px;
  height: 22px;
  border-radius: 999px;
  border: none;
  background: ${({ theme, $enabled }) =>
    $enabled ? theme.app.palette.blue[350] : theme.app.border};
  cursor: pointer;
  transition: background 0.2s ease;
  padding: 0;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ToggleButton = styled.button<{ $enabled: boolean }>`
  ${toggleBase};
`;

const ToggleHandle = styled.span`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ theme }) => theme.app.bg.white};
  transform: translateX(0);
  transition: transform 0.2s ease;

  ${ToggleButton}[aria-pressed="true"] & {
    transform: translateX(22px);
  }
`;

const PlaceholderBox = styled.div`
  border: 1px dashed ${({ theme }) => theme.app.border};
  border-radius: 8px;
  padding: 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.gray1};
`;

const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: ${({ theme }) => theme.app.text.gray1};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.app.palette.red[100]};
    color: ${({ theme }) => theme.app.palette.red[450]};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const CustomBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  color: ${({ theme }) => theme.app.palette.purple[300]};
  background: ${({ theme }) => theme.app.palette.purple[50]};
`;
