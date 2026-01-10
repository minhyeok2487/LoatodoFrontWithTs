import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as adminApi from "@core/apis/admin.api";
import type {
  AdminMemberListParams,
  AdminMemberUpdateRequest,
} from "@core/types/admin";

export const useMembers = (params: AdminMemberListParams = {}) => {
  return useQuery({
    queryKey: ["admin", "members", params],
    queryFn: () => adminApi.getMembers(params),
    staleTime: 1000 * 60 * 2, // 2분
  });
};

export const useMember = (memberId: number | null) => {
  return useQuery({
    queryKey: ["admin", "members", memberId],
    queryFn: () => adminApi.getMember(memberId!),
    enabled: memberId !== null,
    staleTime: 1000 * 60 * 2,
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: number;
      data: AdminMemberUpdateRequest;
    }) => adminApi.updateMember(memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "members"] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number) => adminApi.deleteMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "members"] });
    },
  });
};
