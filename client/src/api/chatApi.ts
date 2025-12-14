import axiosInstance from "./axiosInstance";

export const chatApi = async (prompt: string) => {
  try {
    const res = await axiosInstance.post("/chat", { prompt });
    console.log(res, "res from get chat api");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
