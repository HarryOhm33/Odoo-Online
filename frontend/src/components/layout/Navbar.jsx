// // src/components/Navbar.jsx
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiHome,
//   FiUser,
//   FiLogIn,
//   FiLogOut,
//   FiLoader,
//   FiMenu,
//   FiX,
//   FiGrid,
// } from "react-icons/fi";
// import { useState, useRef, useEffect } from "react";

// const Navbar = () => {
//   const { user, logout, loading } = useAuth();
//   const location = useLocation();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const mobileMenuRef = useRef(null);

//   // Close mobile menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         mobileMenuRef.current &&
//         !mobileMenuRef.current.contains(event.target)
//       ) {
//         setIsMobileMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false);
//   };

//   const handleLogout = () => {
//     logout();
//     closeMobileMenu();
//   };

//   // Navigation items based on authentication state
//   const getNavItems = () => {
//     if (loading) {
//       // Only show Home when loading
//       return [
//         { path: "/", label: "Home", icon: <FiHome className="h-5 w-5" /> },
//       ];
//     }

//     if (user) {
//       // User is authenticated
//       return [
//         { path: "/", label: "Home", icon: <FiHome className="h-5 w-5" /> },
//         {
//           path: "/dashboard",
//           label: "Dashboard",
//           icon: <FiGrid className="h-5 w-5" />,
//         },
//         {
//           path: "/profile",
//           label: "Profile",
//           icon: <FiUser className="h-5 w-5" />,
//         },
//       ];
//     }

//     // User is not authenticated
//     return [
//       { path: "/", label: "Home", icon: <FiHome className="h-5 w-5" /> },
//       {
//         path: "/auth/signup",
//         label: "Signup",
//         icon: <FiUser className="h-5 w-5" />,
//       },
//       {
//         path: "/auth/login",
//         label: "Login",
//         icon: <FiLogIn className="h-5 w-5" />,
//       },
//     ];
//   };

//   const navItems = getNavItems();

//   return (
//     <nav className="bg-gray-800 border-b border-gray-700 shadow-lg relative">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo/Brand */}
//           <div className="flex items-center">
//             <Link
//               to="/"
//               className="flex-shrink-0 flex items-center text-xl font-bold text-white"
//             >
//               <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
//                 AuthApp
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-4">
//             {navItems.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                   location.pathname === item.path
//                     ? "text-white bg-gray-900"
//                     : "text-gray-300 hover:text-white hover:bg-gray-700"
//                 }`}
//               >
//                 <span className="mr-1">{item.icon}</span>
//                 {item.label}
//               </Link>
//             ))}

//             {/* Show logout button only when user is authenticated and not loading */}
//             {user && !loading && (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleLogout}
//                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
//               >
//                 <FiLogOut className="h-5 w-5 mr-1" />
//                 Logout
//               </motion.button>
//             )}

//             {/* Show loading indicator during authentication */}
//             {loading && (
//               <div className="flex items-center text-gray-400 px-3 py-2">
//                 <FiLoader className="h-5 w-5 animate-spin mr-2" />
//                 Authenticating...
//               </div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={toggleMobileMenu}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//             >
//               {isMobileMenuOpen ? (
//                 <FiX className="block h-6 w-6" />
//               ) : (
//                 <FiMenu className="block h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation - Positioned in top right corner */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <div className="absolute top-full right-0 z-50 md:hidden">
//             <motion.div
//               ref={mobileMenuRef}
//               initial={{ opacity: 0, scale: 0.95, y: -10 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: -10 }}
//               transition={{ duration: 0.15 }}
//               className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-48 mt-1 mr-2 overflow-hidden"
//             >
//               <div className="py-1">
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     onClick={closeMobileMenu}
//                     className={`flex items-center px-4 py-2 text-sm transition-colors ${
//                       location.pathname === item.path
//                         ? "text-white bg-gray-900"
//                         : "text-gray-300 hover:text-white hover:bg-gray-700"
//                     }`}
//                   >
//                     <span className="mr-2">{item.icon}</span>
//                     {item.label}
//                   </Link>
//                 ))}

//                 {/* Show logout button only when user is authenticated and not loading */}
//                 {user && !loading && (
//                   <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
//                   >
//                     <FiLogOut className="h-5 w-5 mr-2" />
//                     Logout
//                   </button>
//                 )}

//                 {/* Show loading indicator during authentication */}
//                 {loading && (
//                   <div className="flex items-center px-4 py-2 text-sm text-gray-400">
//                     <FiLoader className="h-5 w-5 animate-spin mr-2" />
//                     Authenticating...
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;


import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Boxes,
} from "lucide-react";

const navLinks = [
  {
    name: "Home",
    href: "#",
  },
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "Workflow",
    href: "#workflow",
  },
  {
    name: "About",
    href: "#about",
  },
];

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{
          y: -80,
        }}
        animate={{
          y: 0,
        }}
        transition={{
          duration: .6,
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-2xl bg-[#08111F]/80 border-b border-white/10 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Logo */}

          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_35px_rgba(59,130,246,.35)]">

              <Boxes size={26} className="text-white" />

            </div>

            <div>

              <h2 className="text-2xl font-black text-white">

                AssetFlow

              </h2>

              <p className="-mt-1 text-xs tracking-widest text-cyan-400">

                ERP PLATFORM

              </p>

            </div>

          </motion.div>

          {/* Desktop Menu */}

          <div className="hidden items-center gap-10 lg:flex">

            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative font-medium text-slate-300 transition hover:text-cyan-400"
              >
                {item.name}

                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 hover:w-full" />
              </a>
            ))}

          </div>

          {/* Buttons */}

          <div className="hidden items-center gap-4 lg:flex">

            <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">

              Login

            </button>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: .95,
              }}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,.35)]"
            >

              Get Started

              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />

            </motion.button>

          </div>

          {/* Mobile */}

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-xl border border-white/10 bg-white/5 p-3 text-white lg:hidden"
          >

            {mobileMenu ? <X /> : <Menu />}

          </button>

        </div>
      </motion.header>

      {/* Mobile Menu */}

      <AnimatePresence>

        {mobileMenu && (

          <motion.div
            initial={{
              opacity: 0,
              y: -30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -30,
            }}
            className="fixed top-20 left-4 right-4 z-40 rounded-3xl border border-white/10 bg-[#0D1728]/95 p-8 backdrop-blur-2xl lg:hidden"
          >

            <div className="space-y-6">

              {navLinks.map((item) => (

                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className="block text-lg font-medium text-slate-300 transition hover:text-cyan-400"
                >

                  {item.name}

                </a>

              ))}

              <hr className="border-white/10" />

              <button className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-white">

                Login

              </button>

              <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white">

                Get Started

              </button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>
    </>
  );
}