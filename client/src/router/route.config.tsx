import AddExpensePage from "@/pages/private/AddExpense";
import AllExpense from "@/pages/private/AllExpense";
import Dashboard from "@/pages/private/Dashboard";
import LoginPage from "@/pages/public/LoginPage";
import RegisterPage from "@/pages/public/RegisterPage";

export const publicRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
];

export const privateRoutes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/add-expense",
    element: <AddExpensePage />,
  },
  {
    path: "/all-expense",
    element: <AllExpense />,
  },
  // {
  //   path: "/tweets",
  //   element: <TweetPage />,
  // },
  // {
  //   path: "/subscriptions",
  //   element: <SubscriptionPage />,
  // },
  // {
  //   path: "/channel/:username",
  //   element: <ChannelPage />,
  // },
];
