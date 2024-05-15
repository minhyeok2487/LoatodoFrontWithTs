import axios from "axios";
import { DEV_URL, PROD_URL, TEST_ACCESS_TOKEN } from "../Constants";
const api = axios.create({
  baseURL: PROD_URL
});

api.interceptors.request.use(
  (config) => {
    var accessToken = localStorage.getItem('ACCESS_TOKEN');
    if(!accessToken) {
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

export default api;
