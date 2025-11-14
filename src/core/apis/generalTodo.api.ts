import mainAxios from "@core/apis/mainAxios";
import type { NoDataResponse } from "@core/types/api";
import type {
  CreateGeneralTodoCategoryRequest,
  CreateGeneralTodoFolderRequest,
  CreateGeneralTodoItemRequest,
  CreateGeneralTodoStatusRequest,
  GeneralTodoItem,
  GeneralTodoCategory,
  GeneralTodoFolder,
  GeneralTodoOverviewResponse,
  GeneralTodoStatus,
  ReorderGeneralTodoStatusesRequest,
  UpdateGeneralTodoCategoryRequest,
  UpdateGeneralTodoFolderRequest,
  UpdateGeneralTodoItemRequest,
  UpdateGeneralTodoStatusRequest,
  UpdateGeneralTodoItemStatusRequest,
} from "@core/types/generalTodo";

export const getGeneralTodoOverview =
  (): Promise<GeneralTodoOverviewResponse> => {
    return mainAxios
      .get("/api/v1/general-todos")
      .then((response) => response.data);
  };

export const createGeneralTodoFolder = (
  payload: CreateGeneralTodoFolderRequest
): Promise<GeneralTodoFolder> => {
  return mainAxios
    .post("/api/v1/general-todos/folders", payload)
    .then((response) => response.data);
};

export const deleteGeneralTodoFolder = (
  folderId: number
): Promise<NoDataResponse> => {
  return mainAxios
    .delete(`/api/v1/general-todos/folders/${folderId}`)
    .then((response) => response.data);
};

export const updateGeneralTodoFolder = (
  folderId: number,
  payload: UpdateGeneralTodoFolderRequest
): Promise<NoDataResponse> => {
  return mainAxios
    .patch(`/api/v1/general-todos/folders/${folderId}`, payload)
    .then((response) => response.data);
};

export const reorderGeneralTodoFolders = (
  folderIds: number[]
): Promise<NoDataResponse> => {
  return mainAxios
    .patch("/api/v1/general-todos/folders/reorder", { folderIds })
    .then((response) => response.data);
};

export const reorderGeneralTodoCategories = (
  folderId: number,
  categoryIds: number[]
): Promise<NoDataResponse> => {
  return mainAxios
    .patch(
      `/api/v1/general-todos/categories/folders/${folderId}/reorder`,
      {
        categoryIds,
      }
    )
    .then((response) => response.data);
};

export const createGeneralTodoCategory = (
  folderId: number,
  payload: CreateGeneralTodoCategoryRequest
): Promise<GeneralTodoCategory> => {
  return mainAxios
    .post(
      `/api/v1/general-todos/categories/folders/${folderId}`,
      payload
    )
    .then((response) => response.data);
};

export const updateGeneralTodoCategory = (
  categoryId: number,
  payload: UpdateGeneralTodoCategoryRequest
): Promise<NoDataResponse> => {
  return mainAxios
    .patch(`/api/v1/general-todos/categories/${categoryId}`, payload)
    .then((response) => response.data);
};

export const deleteGeneralTodoCategory = (
  categoryId: number
): Promise<NoDataResponse> => {
  return mainAxios
    .delete(`/api/v1/general-todos/categories/${categoryId}`)
    .then((response) => response.data);
};

export const createGeneralTodoItem = (
  payload: CreateGeneralTodoItemRequest
): Promise<GeneralTodoItem> => {
  return mainAxios
    .post("/api/v1/general-todos/items", payload)
    .then((response) => response.data);
};

export const updateGeneralTodoItem = (
  todoId: number,
  payload: UpdateGeneralTodoItemRequest
): Promise<GeneralTodoItem> => {
  return mainAxios
    .patch(`/api/v1/general-todos/items/${todoId}`, payload)
    .then((response) => response.data);
};

export const updateGeneralTodoItemStatus = (
  todoId: number,
  payload: UpdateGeneralTodoItemStatusRequest
): Promise<NoDataResponse> => {
  return mainAxios
    .patch(`/api/v1/general-todos/items/${todoId}/status`, payload)
    .then((response) => response.data);
};

export const deleteGeneralTodoItem = (
  todoId: number
): Promise<NoDataResponse> => {
  return mainAxios
    .delete(`/api/v1/general-todos/items/${todoId}`)
    .then((response) => response.data);
};

export const createGeneralTodoStatus = (
  categoryId: number,
  payload: CreateGeneralTodoStatusRequest
): Promise<GeneralTodoStatus> => {
  return mainAxios
    .post(
      `/api/v1/general-todos/categories/${categoryId}/statuses`,
      payload
    )
    .then((response) => response.data);
};

export const updateGeneralTodoStatus = (
  categoryId: number,
  statusId: number,
  payload: UpdateGeneralTodoStatusRequest
): Promise<GeneralTodoStatus> => {
  return mainAxios
    .patch(
      `/api/v1/general-todos/categories/${categoryId}/statuses/${statusId}`,
      payload
    )
    .then((response) => response.data);
};

export const reorderGeneralTodoStatuses = (
  categoryId: number,
  payload: ReorderGeneralTodoStatusesRequest
): Promise<NoDataResponse> => {
  return mainAxios
    .patch(
      `/api/v1/general-todos/categories/${categoryId}/statuses/reorder`,
      payload
    )
    .then((response) => response.data);
};

export const deleteGeneralTodoStatus = (
  categoryId: number,
  statusId: number
): Promise<NoDataResponse> => {
  return mainAxios
    .delete(
      `/api/v1/general-todos/categories/${categoryId}/statuses/${statusId}`
    )
    .then((response) => response.data);
};
