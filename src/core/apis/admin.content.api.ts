import type { AddContentRequest } from "@core/types/admin.content";
import mainAxios from '@core/apis/mainAxios';

export const addContent = async (data: AddContentRequest) => {
  const response = await mainAxios.post("/admin/api/v1/content", data);
  return response.data;
};
