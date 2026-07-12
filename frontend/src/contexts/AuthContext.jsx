// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ── Computed helpers ─────────────────────────────────────────────────────
  const isAuthenticated = !!user;

  // ── Session restore on mount ──────────────────────────────────────────────
  useEffect(() => {
    const token = Cookies.get("magicalKey");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .post("/api/auth/verify-session", {})
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
        Cookies.remove("magicalKey");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Refresh user from server ──────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.post("/api/auth/verify-session", {});
      setUser(res.data.user);
      return res.data.user;
    } catch {
      setUser(null);
      Cookies.remove("magicalKey");
      navigate("/auth/login");
    }
  }, [navigate]);



  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", { email, password });

      if (res.data.user) {
        const { user: userData, token } = res.data;
        setUser(userData);

        const isSecure = window.location.protocol === "https:";
        Cookies.set("magicalKey", token, {
          expires: 7,
          path: "/",
          secure: isSecure,
          sameSite: "strict",
        });

        toast.success("Login successful!");

        // ✅ Role-based redirect
        if (userData.role === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/app/dashboard");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed ❌");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {});
    } catch {
      // Always clear locally even if server call fails
    } finally {
      setUser(null);
      Cookies.remove("magicalKey");
      toast.info("Logged out successfully! 👋");
      navigate("/auth/login");
    }
  };

  // ── Email Verification ────────────────────────────────────────────────────
  const verify = async (token, email) => {
    return await api.post("/api/auth/verify", { token, email });
  };

  // ── Employee Account Activation ────────────────────────────────────────────
  const activateAccount = async (token, password) => {
    return await api.post("/api/auth/activate", { token, password });
  };

  // ── Forgot Password ────────────────────────────────────────────────────────
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/forgot-password", { email });
      if (res.data.success) {
        toast.success(res.data.message || "Password reset link sent to email");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link ❌");
    } finally {
      setLoading(false);
    }
  };

  // ── Reset Password ─────────────────────────────────────────────────────────
  const resetPassword = async (token, email, newPassword) => {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/reset-password", { token, email, newPassword });
      if (res.data.success) {
        toast.success(res.data.message || "Password reset successful!");
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed ❌");
      navigate("/auth/forgot-password");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ── One-time Org Setup (first-time Admin) ──────────────────────────────────
  const setupOrganization = async (data) => {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/setup", data);
      if (res.data.success) {
        toast.success(res.data.message || "Organization created! Please verify your email to log in.");
        navigate("/auth/login");
      }
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Setup failed ❌";
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        // State
        user,
        loading,
        isAuthenticated,
        // Actions
        login,
        logout,
        verify,
        activateAccount,
        forgotPassword,
        resetPassword,
        setupOrganization,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
