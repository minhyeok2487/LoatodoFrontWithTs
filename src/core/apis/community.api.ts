import mainAxios from "@core/apis/mainAxios";
import type {
  CommunityList,
  GetCommunityListRequest,
  RegistCommunityPostRequest,
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

export const createCommunityPost = (data: RegistCommunityPostRequest) => {
  return mainAxios.post("/api/v1/community", data).then((res) => res.data);
};
