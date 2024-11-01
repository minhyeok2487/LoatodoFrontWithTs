import mainAxios from '@core/apis/mainAxios';
import type { CommunityListResponse, CommunitySaveRequest } from "../types/community";

export const getCommunityPosts = ({
    category,
    lastId,
    limit = 20,
}: {
    category?: string;
    lastId?: number;
    limit?: number;
}): Promise<CommunityListResponse> => {
    return mainAxios
        .get("/api/v1/community", {
            params: {
                category,
                lastId,
                limit,
            },
        })
        .then((res) => res.data);
};

export const createCommunityPost = async (data: CommunitySaveRequest) => {
    const response = await mainAxios.post('/api/v1/community', data);
    return response.data;
};