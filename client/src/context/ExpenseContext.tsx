import {
  addExpenseApi,
  categoryBreakdownApi,
  deleteExpenseApi,
  getExpensesApi,
  getMonthlySummaryApi,
  updateExpenseApi,
  type addExenseData,
} from "@/api/expenseApi";
import { createContext, useContext } from "react";

const ExpenseContext = createContext<any>(null);

export const ExpenseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const addExpense = async (data: addExenseData) => {
    try {
      const res = await addExpenseApi(data);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateExpense = async (id: string, data: addExenseData) => {
    try {
      const res = await updateExpenseApi(id, data);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const res = await deleteExpenseApi(id);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getExpenses = async () => {
    try {
      const res = await getExpensesApi();
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getMonthlySummary = async () => {
    try {
      const res = await getMonthlySummaryApi();
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const categoryBreakdown = async () => {
    try {
      const res = await categoryBreakdownApi();
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        addExpense,
        updateExpense,
        deleteExpense,
        getExpenses,
        getMonthlySummary,
        categoryBreakdown,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => useContext(ExpenseContext);
