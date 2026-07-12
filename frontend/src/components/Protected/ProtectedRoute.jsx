import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { FiLoader, FiAlertCircle } from "react-icons/fi";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // 🔄 Redirect after delay if not logged in
  useEffect(() => {
    if (!loading && !user) {
      const timer = setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 3000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [loading, user, navigate]);

  // ⏳ Show loading while auth state is being checked
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-900 flex items-center justify-center">
  //       <motion.div
  //         initial={{ opacity: 0, scale: 0.8 }}
  //         animate={{ opacity: 1, scale: 1 }}
  //         transition={{ duration: 0.3 }}
  //         className="flex flex-col items-center"
  //       >
  //         <motion.div
  //           animate={{ rotate: 360 }}
  //           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  //           className="text-purple-500 mb-4"
  //         >
  //           <FiLoader className="h-8 w-8" />
  //         </motion.div>
  //         <p className="text-gray-400 font-medium">Verifying access...</p>
  //       </motion.div>
  //     </div>
  //   );
  // }

  // 🚫 If no user, show access denied screen before redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
            <FiAlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            You need to be logged in to access this page.
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Redirecting you to the login page...
          </p>
        </motion.div>
      </div>
    );
  }

  // ✅ Otherwise render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
