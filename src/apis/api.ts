import axios from "axios";

const api = axios.create({
  // baseURL: "https://api.loatodo.com",
  baseURL: "http://localhost:5000",
});

export default api;
