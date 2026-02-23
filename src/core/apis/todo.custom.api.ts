import mainAxios from "@core/apis/mainAxios";
import type { NoDataResponse } from "@core/types/api";
import type {
  AddCustomTodoRequest,
  CheckCustomTodoRequest,
  CustomTodoItem,
  RemoveCustomTodoRequest,
  UpdateCustomTodoRequest,
} from "@core/types/todo";

// 커스텀 투두
export const getCustomTodos = (
  friendUsername?: string
): Promise<CustomTodoItem[]> => {
  return mainAxios
    .get(
      "/api/v1/custom",
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const addCustomTodo = ({
  friendUsername,
  characterId,
  contentName,
  frequency,
}: AddCustomTodoRequest): Promise<NoDataResponse> => {
  return mainAxios
    .post(
      "/api/v1/custom",
      {
        characterId,
        contentName,
        frequency
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const checkCustomTodo = ({
  friendUsername,
  characterId,
  customTodoId,
}: CheckCustomTodoRequest): Promise<NoDataResponse> => {
  return mainAxios
    .post(
      "/api/v1/custom/check",
      {
        characterId,
        customTodoId,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const updateCustomTodo = ({
  friendUsername,
  customTodoId,
  characterId,
  contentName,
}: UpdateCustomTodoRequest): Promise<NoDataResponse> => {
  return mainAxios
    .patch(
      `/api/v1/custom/${customTodoId}`,
      {
        characterId,
        contentName,
      },
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};

export const removeCustomtodo = ({
  friendUsername,
  customTodoId,
}: RemoveCustomTodoRequest): Promise<NoDataResponse> => {
  return mainAxios
    .delete(
      `/api/v1/custom/${customTodoId}`,
      {
        params: {
          friendUsername,
        },
      }
    )
    .then((res) => res.data);
};
