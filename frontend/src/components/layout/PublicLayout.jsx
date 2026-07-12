// src/components/layout/PublicLayout.jsx
// Wraps public-facing pages (Home, Login, Setup, etc.) with the top Navbar.
// Portal pages (AdminLayout, EmployeeLayout) have their own navbar and don't use this.
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export default PublicLayout;
