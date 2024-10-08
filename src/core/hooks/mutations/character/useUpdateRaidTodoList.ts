import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type {
  Character,
  UpdateRaidTodoListRequest,
} from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<UpdateRaidTodoListRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.updateRaidTodoList(params),
  });

  return mutation;
};
