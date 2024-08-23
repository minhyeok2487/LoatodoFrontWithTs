import mainAxios from "@core/apis/mainAxios";
import type { NoDataResponse } from "@core/types/api";
import type {
  AddCustomTodoRequest,
  CheckCustomTodoRequest,
  CustomTodoItem,
  UpdateCustomTodoRequest,
} from "@core/types/customTodo";

export const getCustomTodos = (): Promise<CustomTodoItem[]> => {
  return mainAxios.get("/v4/custom").then((res) => res.data);
};

export const addCustomTodo = ({
  characterId,
  contentName,
  frequency,
}: AddCustomTodoRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/v4/custom", { characterId, contentName, frequency });
};

export const checkCustomTodo = ({
  characterId,
  customTodoId,
}: CheckCustomTodoRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/v4/custom/check", { characterId, customTodoId });
};

export const updateCustomTodo = ({
  customTodoId,
  characterId,
  contentName,
}: UpdateCustomTodoRequest): Promise<NoDataResponse> => {
  return mainAxios.patch(`/v4/custom/${customTodoId}`, {
    characterId,
    contentName,
  });
};

export const removeCustomtodo = (
  customTodoId: number
): Promise<NoDataResponse> => {
  return mainAxios.delete(`/v4/custom/${customTodoId}`);
};
