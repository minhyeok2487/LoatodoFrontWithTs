import api from "./api";

export const uploadImage = (image: any): Promise<any> => {
  const formData = new FormData();
  formData.append("image", image);
  return api
    .patch("/v3/boards/image", formData)
    .then((res) => res.data)
    .catch((error) => console.log(error));
};
