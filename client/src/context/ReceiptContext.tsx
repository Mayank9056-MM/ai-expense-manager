import {
  getReceiptApi,
  uploadReceiptApi,
  type ReceiptData,
} from "@/api/receiptApi";
import { createContext, useContext } from "react";

const ReceiptContext = createContext<any>(null);

export const ReceiptProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const uploadReceipt = async (data: ReceiptData) => {
    try {
      const res = await uploadReceiptApi(data);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getReceipt = async (id: string) => {
    try {
      const res = await getReceiptApi(id);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <ReceiptContext.Provider value={{ uploadReceipt, getReceipt }}>
      {children}
    </ReceiptContext.Provider>
  );
};

export const useReceipt = () => useContext(ReceiptContext);
