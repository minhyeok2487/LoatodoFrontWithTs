import { useMutation } from "@tanstack/react-query";

import * as generalTodoApi from "@core/apis/generalTodo.api";
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
