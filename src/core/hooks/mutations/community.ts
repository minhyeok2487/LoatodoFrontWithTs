import { useMutation } from "@tanstack/react-query";

import * as communityApi from "@core/apis/community.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type {
  EditCommunityPostRequest,
  UploadCommunityPostRequest,
  UploadedCommunityImage,
} from "@core/types/community";

export const useUploadCommunityPost = (
  options?: CommonUseMutationOptions<UploadCommunityPostRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => communityApi.uploadCommunityPost(params),
  });

  return mutation;
};

export const useRemoveCommunityPost = (
  options?: CommonUseMutationOptions<number>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (communityId) => communityApi.removeCommunityPost(communityId),
  });

  return mutation;
};

export const useEditCommunityPost = (
  options?: CommonUseMutationOptions<EditCommunityPostRequest>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => communityApi.editCommunityPostRequest(params),
  });

  return mutation;
};

export const useUploadCommunityImage = (
  options?: CommonUseMutationOptions<File, UploadedCommunityImage>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (image) => communityApi.uploadCommunityImage(image),
  });

  return mutation;
};
