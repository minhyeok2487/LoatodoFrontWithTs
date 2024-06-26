import axios from "axios";
import { toast } from "react-toastify";

import { BASE_URL, TEST_ACCESS_TOKEN } from "@core/constants";
import type { CustomError } from "@core/types/api";

const mainAxiosClient = axios.create({
  baseURL: BASE_URL,
});

mainAxiosClient.interceptors.request.use(
  (config) => {
    const newConfig = { ...config };
    let accessToken = localStorage.getItem("ACCESS_TOKEN");

    if (!accessToken) {
      localStorage.setItem("ACCESS_TOKEN", TEST_ACCESS_TOKEN);
      accessToken = TEST_ACCESS_TOKEN;
    }

    newConfig.headers.Authorization = `Bearer ${accessToken}`;
    return newConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

mainAxiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const errorData: CustomError = {
        errorCode: error.response.status,
        errorMessage: error.response.data.errorMessage,
        exceptionName: error.response.data.exceptionName,
      };

      console.log("Error details:", errorData);

      toast.error(errorData.errorMessage);
    }
    return Promise.reject(error);
  }
);

export default mainAxiosClient;
