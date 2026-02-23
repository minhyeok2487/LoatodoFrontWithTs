import mainAxios from "@core/apis/mainAxios";
import type {
  CheckServerTodoRequest,
  CreateServerTodoRequest,
  DeleteServerTodoRequest,
  ServerTodoItem,
  ServerTodoOverviewResponse,
  ToggleServerTodoEnabledRequest,
} from "@core/types/todo";

export const getServerTodos = (
  friendUsername?: string
): Promise<ServerTodoOverviewResponse> => {
  return mainAxios
    .get("/api/v1/server-todos", {
      params: {
        friendUsername,
      },
    })
    .then((res) => res.data);
};

export const toggleServerTodoEnabled = ({
  friendUsername,
  todoId,
  serverName,
  enabled,
}: ToggleServerTodoEnabledRequest): Promise<ServerTodoOverviewResponse> => {
  return mainAxios
    .patch(
      `/api/v1/server-todos/${todoId}/toggle-enabled`,
      {
        serverName,
        enabled,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const checkServerTodo = ({
  friendUsername,
  todoId,
  serverName,
  checked,
}: CheckServerTodoRequest): Promise<ServerTodoOverviewResponse> => {
  return mainAxios
    .post(
      `/api/v1/server-todos/${todoId}/check`,
      {
        serverName,
        checked,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

// 서버 숙제 생성 (사용자 커스텀)
export const createServerTodo = ({
  contentName,
  defaultEnabled,
  frequency,
  custom,
}: CreateServerTodoRequest): Promise<ServerTodoItem> => {
  return mainAxios
    .post("/api/v1/server-todos", {
      contentName,
      defaultEnabled,
      frequency,
      custom,
    })
    .then((res) => res.data);
};

// 서버 숙제 삭제 (사용자 커스텀만 가능)
export const deleteServerTodo = ({
  todoId,
}: DeleteServerTodoRequest): Promise<void> => {
  return mainAxios.delete(`/api/v1/server-todos/${todoId}`);
};
