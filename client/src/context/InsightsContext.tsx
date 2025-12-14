import { getInsightsApi } from "@/api/insightsApi";
import { createContext, useContext } from "react";

const InsightsContext = createContext<any>(null);

export const InsightsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const getInsights = async () => {
    try {
      const res = await getInsightsApi();
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <InsightsContext.Provider value={{ getInsights }}>
      {children}
    </InsightsContext.Provider>
  );
};

export const useInsights = () => useContext(InsightsContext);
