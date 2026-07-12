import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendURl = import.meta.env.VITE_BACKEND_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(""); // Store email for OTP-related actions
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const token = Cookies.get("magicalKey");
      if (token) {
        axios
          .post(
            `${backendURl}/api/auth/verify-session`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            },
          )
          .then((res) => {
            setUser(res.data.user);
            // toast.success(`Welcome back ${res.data.user.name}`);
          })
          .catch((err) => {
            setUser(null);
            Cookies.remove("magicalKey");
            toast.error(
              err.response?.data.error ||
                err.response?.data.message ||
                "Session expired, please log in again. ❌",
            );
            navigate("/auth/login");
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }, 500);
  }, [navigate]);

  // Signup Function
  const signup = async (name, email, password) => {
    try {
      const signupData = {
        name,
        email,
        password,
      };

      //   console.log(signupData);

      setLoading(true);
      const res = await axios.post(
        `${backendURl}/api/auth/signup`,
        signupData,
        { withCredentials: true },
      );

      // console.log(res);

      if (res.data.success) {
        setLoading(false);
        setEmail(email); // Store email for OTP verification and resend
        navigate("/auth/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed ❌");
      setLoading(false);
      throw error;
    }
  };

  // Verify accountFunction
  const verify = async (token, email) => {
    return await axios.post(
      `${backendURl}/api/auth/verify`,
      { token, email },
      { withCredentials: true },
    );
  };

  // Resend OTP Function
  // const resendOtp = async () => {
  //   try {
  //     const res = await axios.post(
  //       `${backendURl}/api/auth/resend-otp`,
  //       { email },
  //       { withCredentials: true }
  //     );
  //     toast.success(res.data.message || "OTP resent successfully!");
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to resend OTP ❌");
  //     throw error;
  //   }
  // };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendURl}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      );

      if (res.data.user) {
        setUser(res.data.user);

        const isSecure = window.location.protocol === "https:";
        Cookies.set("magicalKey", res.data.token, {
          expires: 7,
          path: "/",
          secure: isSecure,
          sameSite: "strict",
        });

        // console.log(res.data.token);

        toast.success("Login successful!");
        setLoading(false);
        navigate("/dashboard");
      } else {
        setLoading(false);
        toast.error(res.data.error || "Unknown error");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Login failed ❌");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = Cookies.get("magicalKey");
      await axios.post(
        `${backendURl}/api/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      setUser(null);
      Cookies.remove("magicalKey");
      toast.info("Logged out successfully! 👋");
      navigate("/auth/login");
    } catch (error) {
      toast.error("Logout failed ❌");
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendURl}/api/auth/forgot-password`,
        { email },
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password reset link sent to email");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Failed to send reset link ❌",
      );
    }
  };

  const resetPassword = async (token, email, newPassword) => {
    try {
      // console.log(token, email, newPassword);
      setLoading(true);
      const res = await axios.post(
        `${backendURl}/api/auth/reset-password`,
        { token, email, newPassword },
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password reset successful!");
        setLoading(false);
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed ❌");
      setLoading(false);
      navigate("/auth/forgot-password");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        verify,
        // resendOtp,
        login,
        logout,
        email,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
