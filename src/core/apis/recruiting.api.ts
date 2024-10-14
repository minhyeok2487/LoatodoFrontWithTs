import type { NoDataResponse } from "@core/types/api";
import type {
  AddRecruitingImageResponse,
  AddRecruitingRequest,
  AddRecruitingResponse,
  EditRecruitingRequest,
  GetRecruitingsRequest,
  GetRecruitingsResponse,
  RecruitingDetail,
} from "@core/types/recruiting";

import mainAxios from "./mainAxios";

export const getRecruitingsIndex = (): Promise<GetRecruitingsResponse> => {
  return mainAxios.get("/api/v1/recruiting-board/main").then((res) => res.data);
};

export const getRecruitings = ({
  limit,
  page,
  recruitingCategory,
}: GetRecruitingsRequest): Promise<GetRecruitingsResponse> => {
  return mainAxios
    .get("/api/v1/recruiting-board", {
      params: {
        limit,
        page,
        recruitingCategory,
      },
    })
    .then((res) => res.data);
};

export const getRecruiting = (
  recruitingBoardId: number
): Promise<RecruitingDetail> => {
  return mainAxios
    .get(`/api/v1/recruiting-board/${recruitingBoardId}`)
    .then((res) => res.data);
};

export const removeRecruiting = (
  recruitingBoardId: number
): Promise<NoDataResponse> => {
  return mainAxios.delete(`/api/v1/recruiting-board/${recruitingBoardId}`);
};

export const addRecruiting = ({
  body,
  expeditionSetting,
  fileNames,
  recruiteingCategory,
  showMainCharacter,
  title,
  url,
  weekdaysPlay,
  weekendsPlay,
}: AddRecruitingRequest): Promise<AddRecruitingResponse> => {
  return mainAxios
    .post("/api/v1/recruiting-board", {
      body,
      expeditionSetting,
      fileNames,
      recruiteingCategory,
      showMainCharacter,
      title,
      url,
      weekdaysPlay,
      weekendsPlay,
    })
    .then((res) => res.data);
};

export const addRecruitingImage = (
  image: File
): Promise<AddRecruitingImageResponse> => {
  return mainAxios
    .post("/api/v1/recruiting-board/image", {
      image,
    })
    .then((res) => res.data);
};

export const editRecruiting = ({
  body,
  expeditionSetting,
  showMainCharacter,
  title,
  url1,
  url2,
  url3,
  weekdaysPlay,
  weekendsPlay,
}: EditRecruitingRequest): Promise<NoDataResponse> => {
  return mainAxios
    .put("/api/v1/recruiting-board", {
      body,
      expeditionSetting,
      showMainCharacter,
      title,
      url1,
      url2,
      url3,
      weekdaysPlay,
      weekendsPlay,
    })
    .then((res) => res.data);
};
