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

export interface CommunityPost {
  communityId: number;
  name: string;
  category: CommunityCategory;
  body: string;
  likeCount: number;
  myLike: boolean;
  myPost: boolean;
  commentCount: number;
  createdDate: string;
}

export interface RegistCommunityPostRequest {
  body: string;
  category: CommunityCategory;
  showName: boolean;
  imageList: number[];
  rootParentId?: number;
  commentParentId?: number;
}
