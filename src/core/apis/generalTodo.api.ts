import mainAxios from "@core/apis/mainAxios";
import type {
  CreateGeneralTodoFolderRequest,
  GeneralTodoFolder,
  GeneralTodoOverviewResponse,
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
