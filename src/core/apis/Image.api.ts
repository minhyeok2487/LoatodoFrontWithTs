import api from "./api";

export async function uploadImage(image: any): Promise<any> {
  const formData = new FormData();
  formData.append("image", image);
  return await api
    .patch("/v3/boards/image", formData)
    .then((res) => res.data)
    .catch((error) => console.log(error));
}
