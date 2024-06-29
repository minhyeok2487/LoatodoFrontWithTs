import type { UploadImageResponse } from "@core/types/image";

import mainAxios from "./mainAxios";

export const uploadImage = (blob: Blob): Promise<UploadImageResponse> => {
  const formData = new FormData();

  formData.append("image", blob);

  return mainAxios.post("/v3/boards/image", formData).then((res) => res.data);
};
