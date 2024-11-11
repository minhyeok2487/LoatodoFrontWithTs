import mainAxios from "@core/apis/mainAxios";
import { NoDataResponse } from "@core/types/api";
import type {
  CommunityDetail,
  CommunityList,
  EditCommunityPostRequest,
  GetCommunityListRequest,
  UploadCommunityPostRequest,
  UploadedCommunityImage,
} from "@core/types/community";

export const getCommunityList = ({
  category,
  communityId,
  limit,
}: GetCommunityListRequest): Promise<CommunityList> => {
  return mainAxios
    .get("/api/v1/community", {
      params: {
        category,
        communityId,
        limit,
      },
    })
    .then((res) => res.data);
};

export const getCommunityPost = (
  communityId: number
): Promise<CommunityDetail> => {
  return mainAxios
    .get(`/api/v1/community/${communityId}`)
    .then((res) => res.data);
};

export const uploadCommunityPost = ({
  body,
  category,
  imageList,
  showName,
  rootParentId = 0,
  commentParentId = 0,
}: UploadCommunityPostRequest) => {
  return mainAxios
    .post("/api/v1/community", {
      body,
      category,
      imageList,
      showName,
      commentParentId,
      rootParentId,
    })
    .then((res) => res.data);
};

export const editCommunityPostRequest = ({
  communityId,
  body,
}: EditCommunityPostRequest): Promise<NoDataResponse> => {
  return mainAxios.patch("/api/v1/community", { communityId, body });
};

export const removeCommunityPost = (
  communityId: number
): Promise<NoDataResponse> => {
  return mainAxios.delete(`/api/v1/community/${communityId}`);
};

export const uploadCommunityImage = (
  image: File
): Promise<UploadedCommunityImage> => {
  const formData = new FormData();
  formData.append("image", image);

  return mainAxios
    .post("/api/v1/community/image", formData)
    .then((res) => res.data);
};

export const likeCommunityPost = (
  communityId: number
): Promise<NoDataResponse> => {
  return mainAxios.post(`/api/v1/community/like/${communityId}`);
};
