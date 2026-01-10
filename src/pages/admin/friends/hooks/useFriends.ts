import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as adminApi from "@core/apis/admin.api";
import type { AdminFriendListParams } from "@core/types/admin";

export const useFriends = (params: AdminFriendListParams = {}) => {
  return useQuery({
    queryKey: ["admin", "friends", params],
    queryFn: () => adminApi.getFriends(params),
    staleTime: 1000 * 60 * 2,
  });
};

export const useDeleteFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId: number) => adminApi.deleteFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "friends"] });
    },
  });
};
