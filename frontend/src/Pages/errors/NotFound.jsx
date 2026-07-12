// src/pages/errors/NotFound.jsx
import { Link } from "react-router-dom";
import { FiCompass, FiArrowLeft } from "react-icons/fi";

const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiCompass className="h-9 w-9 text-blue-500" />
      </div>
      <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-slate-700 mb-3">Page Not Found</h2>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        <FiArrowLeft className="h-4 w-4" />
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFound;
