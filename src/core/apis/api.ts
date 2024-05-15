import axios from "axios";
import { DEV_URL, PROD_URL, TEST_ACCESS_TOKEN } from "../Constants";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: PROD_URL
});

interface ErrorType {
  errorCode: Number,
  errorMessage: String,
  exceptionName: String
}

api.interceptors.request.use(
  (config) => {
    let accessToken = localStorage.getItem('ACCESS_TOKEN');
    if (!accessToken) {
      localStorage.setItem('ACCESS_TOKEN', TEST_ACCESS_TOKEN);
      accessToken = TEST_ACCESS_TOKEN;
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const errorData: ErrorType = {
        errorCode: error.response.status,
        errorMessage: error.response.data.errorMessage,
        exceptionName: error.response.data.exceptionName
      };
      console.log('Error details:', errorData);
      toast.error(errorData.errorMessage);
    }
    return Promise.reject(error);
  }
);

export default api;
