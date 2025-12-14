import { conf } from "@/conf/conf";
import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: conf.baseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (!err.response) {
      // Network error / server unreachable
      return Promise.reject(new Error("Network error"));
    }

    const { status, data, config } = err.response;

    // Handle unauthorized
    if (status === 401) {
      window.location.href = "/login";
    }

    // Handle server error
    const message =
      (data as any)?.message ||
      (status >= 500 ? "Server error" : "something went wrong");

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
