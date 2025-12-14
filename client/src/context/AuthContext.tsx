import { createContext, useContext, useEffect, useState } from "react";
import {
  getUserApi,
  loginUserApi,
  logoutUserApi,
  refreshAccessTokenApi,
  registerUserApi,
  type LoginUserData,
  type RegisterData,
} from "@/api/userApi";

interface AuthContextType {
  user: any;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  initialized: boolean;
  setLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(true);

  console.log(accessToken, "access token");

  const isAuthenticated = true
  // !!accessToken;

  const login = async (data: LoginUserData) => {
    try {
      setLoading(true);
      const res = await loginUserApi(data);
      setAccessToken(res.accessToken);
      setUser(res.loggedInUser);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const res = await registerUserApi(data);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await logoutUserApi();
      setAccessToken(null);
      setUser(null);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
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

  const fetchCurrentUser = async () => {
    try {
      const res = await getUserApi();
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    } catch {
      setAccessToken(null);
      setUser(null);
    } finally {
      setInitialized(true);
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //   fetchCurrentUser();
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        logout,
        fetchCurrentUser,
        isAuthenticated,
        initialized,
        loading,
        accessToken,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
