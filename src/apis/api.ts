import axios from "axios";
import { TEST_ACCESS_TOKEN } from "../constants";
const api = axios.create({
  baseURL: "https://api.loatodo.com",
  headers: {
    'Content-Type' : 'aplication/json'
  }
});

api.interceptors.request.use(
  (config) => {
    var accessToken = localStorage.getItem('ACCESS_TOKEN');
    if (!accessToken) {
      localStorage.setItem("ACCESS_TOKEN", TEST_ACCESS_TOKEN);
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
