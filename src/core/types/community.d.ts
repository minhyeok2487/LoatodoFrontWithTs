import { CommunityCategory } from '../constants/index';

export interface CommunityPost {
    communityId: string;
    name: string;
    createdDate: string;
    category: CommunityCategory;
    body: string;
    likeCount: number;
    commentCount: number;
}

export interface CommunityListResponse {
    content: CommunityPost[];
    hasNext: boolean;
}

export interface CommunitySaveRequest {
    body: string;
    category: CommunityCategory;
    showName: boolean;
    commentParentId?: number;
    rootParentId?: number;
    imageList: number[];
}