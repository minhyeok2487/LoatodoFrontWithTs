import { useMutation } from "@tanstack/react-query";

import * as generalTodoApi from "@core/apis/generalTodo.api";
import type { NoDataResponse } from "@core/types/api";
import type {
  CreateGeneralTodoFolderRequest,
  GeneralTodoFolder,
} from "@core/types/generalTodo";
import type { CommonUseMutationOptions } from "@core/types/app";

export const useCreateGeneralTodoFolder = (
  options?: CommonUseMutationOptions<
    CreateGeneralTodoFolderRequest,
    GeneralTodoFolder
  >
) => {
  return useMutation({
    ...options,
    mutationFn: (payload: CreateGeneralTodoFolderRequest) =>
      generalTodoApi.createGeneralTodoFolder(payload),
  });
};

export const useDeleteGeneralTodoFolder = (
  options?: CommonUseMutationOptions<number>
) => {
  return useMutation({
    ...options,
    mutationFn: (folderId: number) =>
      generalTodoApi.deleteGeneralTodoFolder(folderId),
  });
};

type UpdateGeneralTodoFolderParams = {
  folderId: number;
  name: string;
};

type ReorderGeneralTodoCategoriesParams = {
  folderId: number;
  categoryIds: number[];
};

export const useUpdateGeneralTodoFolder = (
  options?: CommonUseMutationOptions<
    UpdateGeneralTodoFolderParams,
    NoDataResponse
  >
) => {
  return useMutation({
    ...options,
    mutationFn: ({ folderId, name }: UpdateGeneralTodoFolderParams) =>
      generalTodoApi.updateGeneralTodoFolder(folderId, { name }),
  });
};

export const useReorderGeneralTodoFolders = (
  options?: CommonUseMutationOptions<number[]>
) => {
  return useMutation({
    ...options,
    mutationFn: (folderIds: number[]) =>
      generalTodoApi.reorderGeneralTodoFolders(folderIds),
  });
};

export const useReorderGeneralTodoCategories = (
  options?: CommonUseMutationOptions<ReorderGeneralTodoCategoriesParams>
) => {
  return useMutation({
    ...options,
    mutationFn: ({ folderId, categoryIds }: ReorderGeneralTodoCategoriesParams) =>
      generalTodoApi.reorderGeneralTodoCategories(folderId, categoryIds),
  });
};
