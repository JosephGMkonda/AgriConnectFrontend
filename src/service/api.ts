import axios from "axios";


export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("Attaching token:", token); 
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


