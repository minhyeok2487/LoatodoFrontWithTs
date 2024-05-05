import axios from "axios";
import { DEV_URL, PROD_URL } from "../constants";
const api = axios.create({
  baseURL: DEV_URL
});

api.interceptors.request.use(
  (config) => {
    var accessToken = localStorage.getItem('ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
