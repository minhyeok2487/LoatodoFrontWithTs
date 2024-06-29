import { useMutation } from "@tanstack/react-query";

import * as imageApi from "@core/apis/image.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { UploadImageResponse } from "@core/types/image";

export default (
  options?: CommonUseMutationOptions<Blob, UploadImageResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (blob) => imageApi.uploadImage(blob),
  });

  return mutation;
};
