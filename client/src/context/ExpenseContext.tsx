import {
  addExpenseApi,
  categoryBreakdownApi,
  deleteExpenseApi,
  getExpensesApi,
  getMonthlySummaryApi,
  updateExpenseApi,
  type addExenseData,
} from "@/api/expenseApi";
import { createContext, useContext, useEffect, useState } from "react";

const ExpenseContext = createContext<any>(null);

export const ExpenseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [expenses, setExpenses] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [categorySummary, setCategorySummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getExpensesApi();
      setExpenses(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlySummary = async () => {
    try {
      const res = await getMonthlySummaryApi();
      setMonthlySummary(res);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategoryBreakdown = async () => {
    try {
      const res = await categoryBreakdownApi();
      setCategorySummary(res);
    } catch (err) {
      console.log(err);
    }
  };

  const addExpense = async (data: addExenseData) => {
    const res = await addExpenseApi(data);
    await refreshAll();
    return res;
  };

  const updateExpense = async (id: string, data: addExenseData) => {
    const res = await updateExpenseApi(id, data);
    await refreshAll();
    return res;
  };

  const deleteExpense = async (id: string) => {
    const res = await deleteExpenseApi(id);
    await refreshAll();
    return res;
  };

  const refreshAll = async () => {
    await Promise.all([
      fetchExpenses(),
      fetchMonthlySummary(),
      fetchCategoryBreakdown(),
    ]);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const getExpenses = async () => {
    try {
      const res = await getExpensesApi();
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
        fetchCategoryBreakdown,
        fetchMonthlySummary,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => useContext(ExpenseContext);
