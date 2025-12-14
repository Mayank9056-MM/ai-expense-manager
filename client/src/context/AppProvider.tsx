import { AuthProvider } from "./AuthContext";
import { ChatProvider } from "./ChatContext";
import { ExpenseProvider } from "./ExpenseContext";
import { InsightsProvider } from "./InsightsContext";
import { ReceiptProvider } from "./ReceiptContext";

// AppProviders.tsx
export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <ExpenseProvider>
      <ReceiptProvider>
        <InsightsProvider>
          <ChatProvider>{children}</ChatProvider>
        </InsightsProvider>
      </ReceiptProvider>
    </ExpenseProvider>
  </AuthProvider>
);
