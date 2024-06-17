import mainAxios from "./mainAxios";

export const uploadImage = (image: any): Promise<any> => {
  const formData = new FormData();
  formData.append("image", image);
  return mainAxios
    .patch("/v3/boards/image", formData)
    .then((res) => res.data)
    .catch((error) => console.log(error));
};
