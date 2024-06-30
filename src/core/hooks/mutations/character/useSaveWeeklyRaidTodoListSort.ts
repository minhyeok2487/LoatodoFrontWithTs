import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type {
  Character,
  SaveWeeklyRaidTodoListSortRequest,
} from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<
    SaveWeeklyRaidTodoListSortRequest,
    Character
  >
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.saveWeeklyRaidTodoListSort(params),
  });

  return mutation;
};
