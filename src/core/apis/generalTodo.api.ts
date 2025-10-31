import mainAxios from "@core/apis/mainAxios";
import type {
  CreateGeneralTodoCategoryRequest,
  CreateGeneralTodoFolderRequest,
  CreateGeneralTodoItemRequest,
  GeneralTodoCategoryResponse,
  GeneralTodoFolderResponse,
  GeneralTodoItemResponse,
  GeneralTodoOverviewResponse,
  ReorderGeneralTodoCategoriesRequest,
  ReorderGeneralTodoFoldersRequest,
  CreateGeneralTodoStatusRequest,
  GeneralTodoStatusResponse,
  ReorderGeneralTodoStatusesRequest,
  UpdateGeneralTodoStatusRequest,
  UpdateGeneralTodoCategoryRequest,
  UpdateGeneralTodoFolderRequest,
  UpdateGeneralTodoItemRequest,
} from "@core/types/generalTodo";

export const getGeneralTodoOverview =
  (): Promise<GeneralTodoOverviewResponse> => {
    return mainAxios
      .get("/api/v1/general-todos")
      .then((response) => response.data);
  };

export const createGeneralTodoFolder = (
  payload: CreateGeneralTodoFolderRequest
): Promise<GeneralTodoFolderResponse> => {
  return mainAxios
    .post("/api/v1/general-todos/folders", payload)
    .then((response) => response.data);
};

export const updateGeneralTodoFolder = (
  folderId: number,
  payload: UpdateGeneralTodoFolderRequest
): Promise<GeneralTodoFolderResponse> => {
  return mainAxios
    .patch(`/api/v1/general-todos/folders/${folderId}`, payload)
    .then((response) => response.data);
};

export const reorderGeneralTodoFolders = (
  payload: ReorderGeneralTodoFoldersRequest
): Promise<void> => {
  return mainAxios
    .patch("/api/v1/general-todos/folders/reorder", payload)
    .then(() => undefined);
};

export const deleteGeneralTodoFolder = (folderId: number): Promise<void> => {
  return mainAxios
    .delete(`/api/v1/general-todos/folders/${folderId}`)
    .then(() => undefined);
};

export const createGeneralTodoCategory = (
  folderId: number,
  payload: CreateGeneralTodoCategoryRequest
): Promise<GeneralTodoCategoryResponse> => {
  return mainAxios
    .post(`/api/v1/general-todos/categories/folders/${folderId}`, payload)
    .then((response) => response.data);
};

export const updateGeneralTodoCategory = (
  categoryId: number,
  payload: UpdateGeneralTodoCategoryRequest
): Promise<GeneralTodoCategoryResponse> => {
  return mainAxios
    .patch(`/api/v1/general-todos/categories/${categoryId}`, payload)
    .then((response) => response.data);
};

export const reorderGeneralTodoCategories = (
  folderId: number,
  payload: ReorderGeneralTodoCategoriesRequest
): Promise<void> => {
  return mainAxios
    .patch(
      `/api/v1/general-todos/categories/folders/${folderId}/reorder`,
      payload
    )
    .then(() => undefined);
};

export const deleteGeneralTodoCategory = (
  categoryId: number
): Promise<void> => {
  return mainAxios
    .delete(`/api/v1/general-todos/categories/${categoryId}`)
    .then(() => undefined);
};

export const createGeneralTodoItem = (
  payload: CreateGeneralTodoItemRequest
): Promise<GeneralTodoItemResponse> => {
  return mainAxios
    .post("/api/v1/general-todos/items", payload)
    .then((response) => response.data);
};

export const updateGeneralTodoItem = (
  itemId: number,
  payload: UpdateGeneralTodoItemRequest
): Promise<GeneralTodoItemResponse> => {
  return mainAxios
    .patch(`/api/v1/general-todos/items/${itemId}`, payload)
    .then((response) => response.data);
};

export const toggleGeneralTodoItemCompletion = (
  itemId: number,
  completed: boolean
): Promise<void> => {
  return mainAxios
    .patch(
      `/api/v1/general-todos/items/${itemId}/toggle-completion`,
      { completed }
    )
    .then(() => undefined);
};

export const createGeneralTodoStatus = (
  categoryId: number,
  payload: CreateGeneralTodoStatusRequest
): Promise<GeneralTodoStatusResponse> => {
  return mainAxios
    .post(
      `/api/v1/general-todos/categories/${categoryId}/statuses`,
      payload
    )
    .then((response) => response.data);
};

export const updateGeneralTodoStatus = (
  statusId: number,
  payload: UpdateGeneralTodoStatusRequest
): Promise<GeneralTodoStatusResponse> => {
  return mainAxios
    .patch(`/api/v1/general-todos/statuses/${statusId}`, payload)
    .then((response) => response.data);
};

export const deleteGeneralTodoStatus = (statusId: number): Promise<void> => {
  return mainAxios
    .delete(`/api/v1/general-todos/statuses/${statusId}`)
    .then(() => undefined);
};

export const reorderGeneralTodoStatuses = (
  categoryId: number,
  payload: ReorderGeneralTodoStatusesRequest
): Promise<void> => {
  return mainAxios
    .patch(
      `/api/v1/general-todos/categories/${categoryId}/statuses/reorder`,
      payload
    )
    .then(() => undefined);
};

export const deleteGeneralTodoItem = (itemId: number): Promise<void> => {
  return mainAxios
    .delete(`/api/v1/general-todos/items/${itemId}`)
    .then(() => undefined);
};
