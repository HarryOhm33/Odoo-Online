import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";

const ProtectedAuth = () => {
  const { user, loading } = useAuth();

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
  //         <p className="text-gray-400 font-medium">
  //           Checking authentication...
  //         </p>
  //       </motion.div>
  //     </div>
  //   );
  // }

  // ✅ If user is logged in, redirect to their dashboard instead of login/signup
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedAuth;
