import { useMutation } from "@tanstack/react-query";

import * as recruiting from "@core/apis/recruiting.api";
import type { NoDataResponse } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type {
  AddRecruitingImageResponse,
  AddRecruitingRequest,
  AddRecruitingResponse,
  EditRecruitingRequest,
} from "@core/types/recruiting";

export const useAddRecruiting = (
  options?: CommonUseMutationOptions<
    AddRecruitingRequest,
    AddRecruitingResponse
  >
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => recruiting.addRecruiting(params),
  });

  return mutation;
};

export const useAddRecruitingImage = (
  options?: CommonUseMutationOptions<File, AddRecruitingImageResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => recruiting.addRecruitingImage(params),
  });

  return mutation;
};

export const useEditRecruiting = (
  options?: CommonUseMutationOptions<EditRecruitingRequest, NoDataResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => recruiting.editRecruiting(params),
  });

  return mutation;
};

export const useRemoveRecruiting = (
  options?: CommonUseMutationOptions<number, NoDataResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => recruiting.removeRecruiting(params),
  });

  return mutation;
};
