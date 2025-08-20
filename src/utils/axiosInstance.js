import axios from "axios";
import store from "../app/store";
import { logout } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired response
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(err);
  }
);

export default api;
