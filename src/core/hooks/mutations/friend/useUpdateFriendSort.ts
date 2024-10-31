import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFriendSort } from "@core/apis/friend.api";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

export const useUpdateFriendSort = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateFriendSort,
        onSuccess: () => {
            // 친구 목록 쿼리 무효화
            queryClient.invalidateQueries({
                queryKey: queryKeyGenerator.getFriends(),
            });
        },
    });
};