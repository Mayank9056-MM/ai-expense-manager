import axiosInstance from "./axiosInstance";

export interface ReceiptData {
  receipt: string;
}

export const uploadReceiptApi = async (data: ReceiptData) => {
  try {
    const res = await axiosInstance.post("/receipt/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res, "res from upload receipt api");
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getReceiptApi = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/receipt/:${id}`);
    console.log(res, "res from get receipt api");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
