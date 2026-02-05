import type { NoDataResponse } from "@core/types/api";
import type {
  InspectionCharacter,
  InspectionDashboard,
  CreateInspectionCharacterRequest,
  UpdateInspectionCharacterRequest,
  UpdateInspectionScheduleRequest,
  InspectionScheduleResponse,
} from "@core/types/inspection";

import mainAxios from "./mainAxios";

export const getInspectionCharacters = (): Promise<InspectionCharacter[]> => {
  return mainAxios.get("/api/v1/inspection/characters").then((res) => res.data);
};

export const getInspectionCharacterDetail = (
  inspectionCharacterId: number,
  startDate?: string,
  endDate?: string
): Promise<InspectionDashboard> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const query = params.toString();
  return mainAxios
    .get(
      `/api/v1/inspection/characters/${inspectionCharacterId}${query ? `?${query}` : ""}`
    )
    .then((res) => res.data);
};

export const createInspectionCharacter = (
  request: CreateInspectionCharacterRequest
): Promise<InspectionCharacter> => {
  return mainAxios
    .post("/api/v1/inspection/characters", request)
    .then((res) => res.data);
};

export const updateInspectionCharacter = (
  inspectionCharacterId: number,
  request: UpdateInspectionCharacterRequest
): Promise<NoDataResponse> => {
  return mainAxios.patch(
    `/api/v1/inspection/characters/${inspectionCharacterId}`,
    request
  );
};

export const deleteInspectionCharacter = (
  inspectionCharacterId: number
): Promise<NoDataResponse> => {
  return mainAxios.delete(
    `/api/v1/inspection/characters/${inspectionCharacterId}`
  );
};

export const refreshInspectionCharacter = (
  inspectionCharacterId: number
): Promise<InspectionDashboard> => {
  return mainAxios
    .post(`/api/v1/inspection/characters/${inspectionCharacterId}/refresh`)
    .then((res) => res.data);
};

export const getInspectionSchedule =
  (): Promise<InspectionScheduleResponse> => {
    return mainAxios
      .get("/api/v1/inspection/schedule")
      .then((res) => res.data);
  };

export const updateInspectionSchedule = (
  request: UpdateInspectionScheduleRequest
): Promise<NoDataResponse> => {
  return mainAxios.patch("/api/v1/inspection/schedule", request);
};
