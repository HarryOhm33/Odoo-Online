// src/pages/Verify.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verify } = useAuth();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const email = query.get("email");

    const verifyAccount = async () => {
      try {
        const res = await verify(token, email);

        if (res.data.success) {
          setMessage(res.data.message || "Account verified successfully!");
          setIsSuccess(true);
          setTimeout(() => navigate("/auth/login"), 3000);
        } else {
          setMessage(
            res.data.message || "Verification failed. Please try again.",
          );
          setIsSuccess(false);
          setTimeout(() => navigate("/auth/signup"), 3000);
        }
      } catch (error) {
        setMessage(error.response?.data?.message || "Verification failed.");
        setIsSuccess(false);
        setTimeout(() => navigate("/auth/signup"), 3000);
      } finally {
        setLoading(false);
      }
    };

    if (token && email) {
      verifyAccount();
    } else {
      setMessage("Invalid verification link");
      setIsSuccess(false);
      setLoading(false);
      setTimeout(() => navigate("/auth/signup"), 3000);
    }
  }, []); // 👈 run only once

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center"
      >
        {loading ? (
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-purple-500 mb-4"
            >
              <FiLoader className="h-12 w-12" />
            </motion.div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Verifying your account
            </h2>
            <p className="text-gray-400">
              Please wait while we confirm your details
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                isSuccess ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              {isSuccess ? (
                <FiCheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <FiXCircle className="h-8 w-8 text-red-500" />
              )}
            </div>
            <h2
              className={`text-xl font-semibold mb-2 ${
                isSuccess ? "text-green-400" : "text-red-400"
              }`}
            >
              {isSuccess ? "Verification Successful!" : "Verification Failed"}
            </h2>
            <p className="text-gray-300 mb-6">{message}</p>
            <p className="text-gray-500 text-sm">
              Redirecting you to {isSuccess ? "login" : "signup"} page...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Verify;
