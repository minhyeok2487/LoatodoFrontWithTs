export interface CommunityPost {
    communityId: string;
    name: string;
    createdDate: string;
    category: string;
    body: string;
    likeCount: number;
    commentCount: number;
}

export interface CommunityListResponse {
    content: CommunityPost[];
    hasNext: boolean;
}