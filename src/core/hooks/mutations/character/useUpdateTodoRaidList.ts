import { useMutation } from "@tanstack/react-query";

import * as characterApi from "@core/apis/character.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type {
  Character,
  UpdateTodoRaidListRequest,
} from "@core/types/character";

export default (
  options?: CommonUseMutationOptions<UpdateTodoRaidListRequest, Character>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => characterApi.updateTodoRaidList(params),
  });

  return mutation;
};
