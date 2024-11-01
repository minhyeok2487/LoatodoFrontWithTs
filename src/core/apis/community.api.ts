import mainAxios from '@core/apis/mainAxios';
import type { CommunityListResponse } from "../types/community";

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