import { useMutation } from "@tanstack/react-query";

import * as imageApi from "@core/apis/image.api";
import type { UseMutationWithParams } from "@core/types/app";
import type { UploadImageResponse } from "@core/types/image";

const useUploadImage = (
  options?: UseMutationWithParams<Blob, UploadImageResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (blob) => imageApi.uploadImage(blob),
  });

  return mutation;
};

export default useUploadImage;
