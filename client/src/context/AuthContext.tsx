import { createContext, useContext } from "react";
import {
  loginUserApi,
  logoutUserApi,
  refreshAccessTokenApi,
  registerUserApi,
  type LoginUserData,
  type RegisterData,
} from "@/api/userApi";
import { register } from "module";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const login = async (data: LoginUserData) => {
    try {
      const res = await loginUserApi(data);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await registerUserApi(data);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const res = await logoutUserApi();
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const res = await refreshAccessTokenApi();
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
