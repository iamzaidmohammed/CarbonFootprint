import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, History, Home, BarChart3 } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  // Helper to highlight the active link
  const isActive = (path) =>
    location.pathname === path
      ? "text-eco-accent"
      : "text-gray-400 hover:text-white";

  return (
    <nav className="sticky top-0 z-40 w-full bg-eco-dark/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-eco-green/20 p-2 rounded-lg group-hover:bg-eco-green/40 transition-all">
            <Leaf className="text-eco-accent w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Carbon<span className="text-eco-accent">FootSteps</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive("/")}`}
          >
            <Home size={18} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link
            to="/history"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive("/history")}`}
          >
            <History size={18} />
            <span className="hidden sm:inline">History</span>
          </Link>

          {/* This is a "Decorative" link for your project to look complete */}
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>

          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
            <BarChart3 size={14} />
            <span>SWD v2.1 Model</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
