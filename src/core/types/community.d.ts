import { COMMUNITY_CATEGORY } from "@core/constants";

export type CommunityCategory = keyof typeof COMMUNITY_CATEGORY;

export interface GetCommunityListRequest {
  limit: number;
  token?: string;
  category?: CommunityCategory;
  communityId?: number;
}

export interface CommunityList {
  content: CommunityPost[];
  hasNext: boolean;
}

export interface CommunityDetail {
  community: CommunityPost;
  comments: Comment[];
}

export type Comment = Omit<
  CommunityPost,
  "communityId" | "category" | "commentCount"
> & {
  commentId: number;
  rootParentId: number;
  commentParentId: number;
};

export interface CommunityPost {
  communityId: number;
  memberId: number;
  category: CommunityCategory;
  name: string;
  body: string;
  likeCount: number;
  myLike: boolean;
  myPost: boolean;
  commentCount: number;
  createdDate: string;
}

export interface UploadCommunityPostRequest {
  body: string;
  category: CommunityCategory;
  showName: boolean;
  imageList: number[];
  rootParentId?: number;
  commentParentId?: number;
}

export interface EditCommunityPostRequest {
  body: string;
  communityId: number;
}

export interface UploadedCommunityImage {
  fileName: string;
  imageId: number;
  url: string;
}
