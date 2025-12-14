import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { conf } from "@/conf/conf";
import axios from "axios";

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

const axiosInstance = axios.create({
  baseURL: conf.baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach(({ reject }) => reject(error));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Network error
    if (!error.response) {
      return Promise.reject(new Error("Network error. Please try again."));
    }

    const status = error.response.status;

    // Handle access token expiry
    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        await axios.post(
          `${conf.baseUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        failedQueue.forEach(({ resolve }) => resolve());
        failedQueue = [];

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Other errors
    const message =
      (error.response.data as any)?.message ||
      (status >= 500 ? "Server error" : "Something went wrong");

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
