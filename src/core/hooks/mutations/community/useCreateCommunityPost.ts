import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommunityPost } from '@core/apis/community.api';
import queryKeyGenerator from '@core/utils/queryKeyGenerator';

export const useCreateCommunityPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCommunityPost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeyGenerator.getCommunityPosts(),
            });
        },
    });
};