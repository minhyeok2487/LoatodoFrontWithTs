import type { AdsList, GetAdsListRequest, UpdateAdsDateRequest } from "@core/types/admin.ads";
import mainAxios from "./mainAxios";

export const getAdsList = ({ adsId }: GetAdsListRequest): Promise<AdsList> => {
    return mainAxios.get("/admin/api/v1/ads", { params: { adsId } }).then((res) => res.data);
};

export const updateAdsDate = ({ proposerEmail, price }: UpdateAdsDateRequest) => {
    return mainAxios.post("/admin/api/v1/ads/date", { proposerEmail, price }).then((res) => res.data);
};