import axiosInstance from "./axiosInstance";

export const getInsightsApi = async () => {
  try {
    const res = await axiosInstance.get("/insight");
    console.log(res, "res from get insights api");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
