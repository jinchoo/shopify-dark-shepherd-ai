import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

const NavBar = () => {
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white flex items-center justify-between px-8 py-4 shadow-md">
      <Link
        to="/"
        className="flex items-center gap-2 font-bold text-xl tracking-wide hover:text-green-400 transition-colors duration-150"
      >
        <div className="relative">
          <svg
            className="w-7 h-7 text-green-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3l7 4v5c0 5.25-3.5 9.75-7 11-3.5-1.25-7-5.75-7-11V7l7-4z"
            />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        DarkShepherd.ai
      </Link>
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className={`px-3 py-1 rounded transition-colors duration-150 ${
            location.pathname === "/"
              ? "bg-green-600 text-white"
              : "hover:bg-gray-800"
          }`}
        >
          Home
        </Link>
        {isLoggedIn && (
          <Link
            to="/dashboard"
            className={`px-3 py-1 rounded transition-colors duration-150 ${
              location.pathname === "/dashboard"
                ? "bg-green-600 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            Dashboard
          </Link>
        )}
        <Link
          to="/pricing"
          className={`px-3 py-1 rounded transition-colors duration-150 ${
            location.pathname === "/pricing"
              ? "bg-green-600 text-white"
              : "hover:bg-gray-800"
          }`}
        >
          Pricing
        </Link>
        {isLoggedIn && (
          <Link
            to="/settings"
            className={`px-3 py-1 rounded transition-colors duration-150 ${
              location.pathname === "/settings"
                ? "bg-green-600 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            Settings
          </Link>
        )}
        {isLoggedIn ? (
          <button
            className="ml-2 px-3 py-1 rounded hover:bg-gray-800 text-white font-semibold transition-colors duration-150"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className={`px-3 py-1 rounded transition-colors duration-150 ${
              location.pathname === "/login"
                ? "bg-green-600 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
