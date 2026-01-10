import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as adminApi from "@core/apis/admin.api";
import type { AdminContentCreateRequest, ContentCategory } from "@core/types/admin";

export const useContents = (category?: ContentCategory) => {
  return useQuery({
    queryKey: ["admin", "contents", category],
    queryFn: () => adminApi.getContents(category),
    staleTime: 1000 * 60 * 2,
  });
};

export const useContent = (contentId: number | null) => {
  return useQuery({
    queryKey: ["admin", "contents", contentId],
    queryFn: () => adminApi.getContent(contentId!),
    enabled: contentId !== null,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminContentCreateRequest) => adminApi.createContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contents"] });
    },
  });
};

export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentId,
      data,
    }: {
      contentId: number;
      data: Partial<AdminContentCreateRequest>;
    }) => adminApi.updateContent(contentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contents"] });
    },
  });
};

export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: number) => adminApi.deleteContent(contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contents"] });
    },
  });
};
