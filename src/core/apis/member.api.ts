import type {
  EditMainCharacterType,
  MemberType,
  UpdateApiKeyRequest,
} from "@core/types/member";

import mainAxios from "./mainAxios";

export const getMyInformation = (): Promise<MemberType> => {
  return mainAxios.get("/v4/member").then((res) => res.data);
};

export const editMainCharacter = (
  data: EditMainCharacterType
): Promise<any> => {
  return mainAxios
    .patch("/v4/member/main-character", data)
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const editApikey = ({
  apiKey,
  characterName,
}: UpdateApiKeyRequest): Promise<any> => {
  return mainAxios
    .patch("/member/api-key", { apiKey, characterName })
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const deleteUserCharacters = (): Promise<any> => {
  return mainAxios
    .delete("/v3/member/setting/characters")
    .then((res) => res.data)
    .catch((error) => console.log(error));
};
