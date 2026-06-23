import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosInstance";
import { clearAuthData, getToken, getUser, saveAuthData } from "../utils/authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [authLoading, setAuthLoading] = useState(false);

  const isAuthenticated = Boolean(token && user);

  const register = async (formData) => {
    setAuthLoading(true);

    try {
      const { data } = await api.post("/auth/register", formData);

      saveAuthData({
        token: data.token,
        user: data.user,
      });

      setToken(data.token);
      setUser(data.user);

      toast.success("Account created successfully");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Please try again.";

      toast.error(message);
      return { success: false, message };
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (formData) => {
    setAuthLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);

      saveAuthData({
        token: data.token,
        user: data.user,
      });

      setToken(data.token);
      setUser(data.user);

      toast.success("Logged in successfully");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";

      toast.error(message);
      return { success: false, message };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authLoading,
        isAuthenticated,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};