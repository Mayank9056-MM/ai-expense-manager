import axiosInstance from "./axiosInstance";

export interface addExenseData {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
  receipt: string;
}

export const addExpenseApi = async (data: addExenseData) => {
  try {
    const res = await axiosInstance.post("/expense/add", data);
    console.log(res, "res from add expense api");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateExpenseApi = async (id: string, data: addExenseData) => {
  try {
    const res = await axiosInstance.patch(`/expense/:${id}`, data);
    console.log(res, "res from update expense api");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteExpenseApi = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/expense/${id}`);
    console.log(res, "res from delete expense api");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getExpensesApi = async () => {
  try {
    const res = await axiosInstance.get("/expense");
    console.log(res, "res from get expense api");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMonthlySummaryApi = async () => {
  try {
    const res = await axiosInstance.get("/expense/monthly-summary");
    console.log(res, "res from get monthly summary api");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const categoryBreakdownApi = async () => {
  try {
    const res = await axiosInstance.get("/expense/category-breakdown");
    console.log(res, "res from get category breakdown api");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
