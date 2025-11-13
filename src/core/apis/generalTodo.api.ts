import mainAxios from "@core/apis/mainAxios";
import type { NoDataResponse } from "@core/types/api";
import type {
  CreateGeneralTodoCategoryRequest,
  CreateGeneralTodoFolderRequest,
  GeneralTodoCategory,
  GeneralTodoFolder,
  GeneralTodoOverviewResponse,
  UpdateGeneralTodoCategoryRequest,
  UpdateGeneralTodoFolderRequest,
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
