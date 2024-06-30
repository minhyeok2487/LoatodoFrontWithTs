import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type {
  TodoRaid,
  UpdateWeeklyRaidMemoRequest,
} from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<UpdateWeeklyRaidMemoRequest, TodoRaid>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.updateWeeklyRaidMemo(params),
  });

  return mutation;
};
