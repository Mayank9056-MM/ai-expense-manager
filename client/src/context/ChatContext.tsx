import { chatApi } from "@/api/chatApi";
import { createContext, useContext } from "react";

const ChatContext = createContext<any>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const chatWithAI = async (prompt: string) => {
    try {
      const res = await chatApi(prompt);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <ChatContext.Provider value={{ chatWithAI }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
