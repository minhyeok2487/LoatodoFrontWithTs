import { useMutation } from "@tanstack/react-query";

import * as generalTodoApi from "@core/apis/generalTodo.api";
import type { NoDataResponse } from "@core/types/api";
import type {
  CreateGeneralTodoCategoryRequest,
  CreateGeneralTodoFolderRequest,
  CreateGeneralTodoItemRequest,
  CreateGeneralTodoStatusRequest,
  GeneralTodoCategory,
  GeneralTodoFolder,
  GeneralTodoItem,
  GeneralTodoStatus,
  ReorderGeneralTodoStatusesRequest,
  UpdateGeneralTodoItemRequest,
  UpdateGeneralTodoStatusRequest,
  UpdateGeneralTodoItemStatusRequest,
  ViewMode,
} from "@core/types/generalTodo";
import type { CommonUseMutationOptions } from "@core/types/app";

type CreateGeneralTodoCategoryParams = CreateGeneralTodoCategoryRequest & {
  folderId: number;
};

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

export const useCreateGeneralTodoCategory = (
  options?: CommonUseMutationOptions<
    CreateGeneralTodoCategoryParams,
    GeneralTodoCategory
  >
) => {
  return useMutation({
    ...options,
    mutationFn: ({ folderId, ...payload }: CreateGeneralTodoCategoryParams) =>
      generalTodoApi.createGeneralTodoCategory(folderId, payload),
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

type UpdateGeneralTodoCategoryParams = {
  categoryId: number;
  name?: string;
  color?: string | null;
  viewMode?: ViewMode;
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

export const useUpdateGeneralTodoCategory = (
  options?: CommonUseMutationOptions<
    UpdateGeneralTodoCategoryParams,
    NoDataResponse
  >
) => {
  return useMutation({
    ...options,
    mutationFn: ({ categoryId, ...payload }: UpdateGeneralTodoCategoryParams) =>
      generalTodoApi.updateGeneralTodoCategory(categoryId, payload),
  });
};

export const useDeleteGeneralTodoCategory = (
  options?: CommonUseMutationOptions<number>
) => {
  return useMutation({
    ...options,
    mutationFn: (categoryId: number) =>
      generalTodoApi.deleteGeneralTodoCategory(categoryId),
  });
};

export const useCreateGeneralTodoItem = (
  options?: CommonUseMutationOptions<
    CreateGeneralTodoItemRequest,
    GeneralTodoItem
  >
) => {
  return useMutation({
    ...options,
    mutationFn: (payload: CreateGeneralTodoItemRequest) =>
      generalTodoApi.createGeneralTodoItem(payload),
  });
};

type UpdateGeneralTodoItemParams = {
  todoId: number;
  payload: UpdateGeneralTodoItemRequest;
};

export const useUpdateGeneralTodoItem = (
  options?: CommonUseMutationOptions<
    UpdateGeneralTodoItemParams,
    GeneralTodoItem
  >
) => {
  return useMutation({
    ...options,
    mutationFn: ({ todoId, payload }: UpdateGeneralTodoItemParams) =>
      generalTodoApi.updateGeneralTodoItem(todoId, payload),
  });
};

type UpdateTodoStatusParams = {
  todoId: number;
  payload: UpdateGeneralTodoItemStatusRequest;
};

export const useUpdateGeneralTodoItemStatus = (
  options?: CommonUseMutationOptions<UpdateTodoStatusParams, NoDataResponse>
) => {
  return useMutation({
    ...options,
    mutationFn: ({ todoId, payload }: UpdateTodoStatusParams) =>
      generalTodoApi.updateGeneralTodoItemStatus(todoId, payload),
  });
};

export const useDeleteGeneralTodoItem = (
  options?: CommonUseMutationOptions<number>
) => {
  return useMutation({
    ...options,
    mutationFn: (todoId: number) =>
      generalTodoApi.deleteGeneralTodoItem(todoId),
  });
};

type CreateStatusParams = CreateGeneralTodoStatusRequest & {
  categoryId: number;
};

export const useCreateGeneralTodoStatus = (
  options?: CommonUseMutationOptions<CreateStatusParams, GeneralTodoStatus>
) => {
  return useMutation({
    ...options,
    mutationFn: ({ categoryId, ...payload }: CreateStatusParams) =>
      generalTodoApi.createGeneralTodoStatus(categoryId, payload),
  });
};

type UpdateStatusParams = UpdateGeneralTodoStatusRequest & {
  categoryId: number;
  statusId: number;
};

export const useUpdateGeneralTodoStatus = (
  options?: CommonUseMutationOptions<UpdateStatusParams, GeneralTodoStatus>
) => {
  return useMutation({
    ...options,
    mutationFn: ({ categoryId, statusId, ...payload }: UpdateStatusParams) =>
      generalTodoApi.updateGeneralTodoStatus(categoryId, statusId, payload),
  });
};

type ReorderStatusesParams = ReorderGeneralTodoStatusesRequest & {
  categoryId: number;
};

export const useReorderGeneralTodoStatuses = (
  options?: CommonUseMutationOptions<ReorderStatusesParams, NoDataResponse>
) => {
  return useMutation({
    ...options,
    mutationFn: ({ categoryId, statusIds }: ReorderStatusesParams) =>
      generalTodoApi.reorderGeneralTodoStatuses(categoryId, { statusIds }),
  });
};

type DeleteStatusParams = {
  categoryId: number;
  statusId: number;
};

export const useDeleteGeneralTodoStatus = (
  options?: CommonUseMutationOptions<DeleteStatusParams>
) => {
  return useMutation({
    ...options,
    mutationFn: ({ categoryId, statusId }: DeleteStatusParams) =>
      generalTodoApi.deleteGeneralTodoStatus(categoryId, statusId),
  });
};
