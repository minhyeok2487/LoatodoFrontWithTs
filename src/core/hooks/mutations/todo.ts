import { useMutation } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character, TodoRaid } from "@core/types/character";
import type {
  AddCustomTodoRequest,
  CheckCustomTodoRequest,
  CheckDailyTodoRequest,
  CheckRaidTodoRequest,
  CheckWeeklyTodoRequest,
  RemoveCustomTodoRequest,
  ToggleGoldCharacterRequest,
  ToggleGoldRaidRequest,
  ToggleGoldVersionRequest,
  UpdateCharacterMemoRequest,
  UpdateCharacterSortRequest,
  UpdateCustomTodoRequest,
  UpdateRaidTodoMemoRequest,
  UpdateRaidTodoRequest,
  UpdateRaidTodoSortRequest,
  UpdateRestGaugeRequest,
} from "@core/types/todo";

// 캐릭터
export const useRefreshCharacters = (
  options?: CommonUseMutationOptions<string | undefined>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (friendUsername) => todoApi.refreshCharacters(friendUsername),
  });

  return mutation;
};

export const useUpdateCharacterMemo = (
  options?: CommonUseMutationOptions<UpdateCharacterMemoRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateCharacterMemo(params),
  });

  return mutation;
};

export const useUpdateCharacterSort = (
  options?: CommonUseMutationOptions<UpdateCharacterSortRequest, Character[]>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateCharactersSort(params),
  });

  return mutation;
};

export const useToggleGoldCharacter = (
  options?: CommonUseMutationOptions<ToggleGoldCharacterRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.toggleGoldCharacter(params),
  });

  return mutation;
};

// 일간 투두
export const useCheckDailyTodo = (
  options?: CommonUseMutationOptions<CheckDailyTodoRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.checkDailyTodo(params),
  });

  return mutation;
};

export const useUpdateRestGauge = (
  options?: CommonUseMutationOptions<UpdateRestGaugeRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateRestGauge(params),
  });

  return mutation;
};

// 레이드 투두
export const useUpdateRaidTodo = (
  options?: CommonUseMutationOptions<UpdateRaidTodoRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateRaidTodo(params),
  });

  return mutation;
};

export const useCheckRaidTodo = (
  options?: CommonUseMutationOptions<CheckRaidTodoRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.checkRaidTodo(params),
  });

  return mutation;
};

export const useUpdateRaidTodoSort = (
  options?: CommonUseMutationOptions<UpdateRaidTodoSortRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateRaidTodoSort(params),
  });

  return mutation;
};

export const useUpdateRaidTodoMemo = (
  options?: CommonUseMutationOptions<UpdateRaidTodoMemoRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateRaidTodoMemo(params),
  });

  return mutation;
};

export const useToggleGoldVersion = (
  options?: CommonUseMutationOptions<ToggleGoldVersionRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.toggleGoldVersion(params),
  });

  return mutation;
};

export const useToggleGoldRaid = (
  options?: CommonUseMutationOptions<ToggleGoldRaidRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.toggleGoldRaid(params),
  });

  return mutation;
};

// 주간 투두
export const useCheckWeeklyTodo = (
  options?: CommonUseMutationOptions<CheckWeeklyTodoRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.checkWeeklyTodo(params),
  });

  return mutation;
};

// 커스텀 투두
export const useAddCustomTodo = (
  options?: CommonUseMutationOptions<AddCustomTodoRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.addCustomTodo(params),
  });

  return mutation;
};

export const useUpdateCustomTodo = (
  options?: CommonUseMutationOptions<UpdateCustomTodoRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateCustomTodo(params),
  });

  return mutation;
};

export const useRemoveCustomTodo = (
  options?: CommonUseMutationOptions<RemoveCustomTodoRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.removeCustomtodo(params),
  });

  return mutation;
};

export const useCheckCustomTodo = (
  options?: CommonUseMutationOptions<CheckCustomTodoRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.checkCustomTodo(params),
  });

  return mutation;
};
