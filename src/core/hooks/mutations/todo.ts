import { useMutation } from "@tanstack/react-query";

import * as todoApi from "@core/apis/todo.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { Character } from "@core/types/character";
import type {
  AddCustomTodoRequest,
  CheckCustomTodoRequest,
  CheckDailyTodoAllRequest,
  CheckDailyTodoRequest,
  CheckElysianRequest,
  CheckRaidTodoRequest,
  CheckServerTodoRequest,
  CheckSilmaelExchangeRequest,
  CheckAllElysianRequest,
  RemoveCustomTodoRequest,
  ServerTodoOverviewResponse,
  ToggleGoldCharacterRequest,
  ToggleGoldRaidRequest,
  ToggleGoldVersionRequest,
  ToggleServerTodoEnabledRequest,
  UpdateCharacterMemoRequest,
  UpdateCharacterSortRequest,
  UpdateCubeTicketRequest,
  UpdateCustomTodoRequest,
  UpdateDayTodoAllCharactersRequest,
  UpdateDayTodoAllCharactersResponse,
  UpdateRaidBusGoldRequest,
  UpdateRaidMoreRewardCheckRequest,
  UpdateRaidTodoMemoRequest,
  UpdateRaidTodoRequest,
  UpdateRaidTodoSortRequest,
  UpdateRestGaugeRequest,
} from "@core/types/todo";

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

// 일간 투두 All
export const useCheckDailyTodoAll = (
  options?: CommonUseMutationOptions<CheckDailyTodoAllRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.checkDailyTodoAll(params),
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
  options?: CommonUseMutationOptions<ToggleGoldRaidRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.toggleGoldRaid(params),
  });

  return mutation;
};

// 주간 투두
export const useUpdateCubeTicket = (
  options?: CommonUseMutationOptions<UpdateCubeTicketRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateCubeTicket(params),
  });

  return mutation;
};

export const useCheckSilmaelExchange = (
  options?: CommonUseMutationOptions<CheckSilmaelExchangeRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.checkSilmaelExchange(params),
  });

  return mutation;
};

export const useCheckElysian = (
  options?: CommonUseMutationOptions<CheckElysianRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.checkElysian(params),
  });

  return mutation;
};

export const useCheckAllElysian = (
  options?: CommonUseMutationOptions<CheckAllElysianRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.checkAllElysian(params),
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

export const useToggleServerTodoEnabled = (
  options?: CommonUseMutationOptions<
    ToggleServerTodoEnabledRequest,
    ServerTodoOverviewResponse
  >
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.toggleServerTodoEnabled(params),
  });

  return mutation;
};

export const useCheckServerTodo = (
  options?: CommonUseMutationOptions<
    CheckServerTodoRequest,
    ServerTodoOverviewResponse
  >
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.checkServerTodo(params),
  });

  return mutation;
};

export const useUpdateRaidBusGold = (
  options?: CommonUseMutationOptions<UpdateRaidBusGoldRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateWeekRaidBusGold(params),
  });

  return mutation;
};

export const useUpdateRaidMoreRewardCheck = (
  options?: CommonUseMutationOptions<UpdateRaidMoreRewardCheckRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateRaidMoreRewardCheck(params),
  });

  return mutation;
};

export const useUpdateDayTodoAllCharacters = (
  options?: CommonUseMutationOptions<UpdateDayTodoAllCharactersRequest, UpdateDayTodoAllCharactersResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => todoApi.updateDayTodoAllCharacters(params),
  });

  return mutation;
};
