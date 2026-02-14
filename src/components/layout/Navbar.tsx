import React from 'react';
import { User } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="h-16 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left Side - Logo and Subtitle */}
        <div className="flex items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              EDUNEX
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              AI Study Assistant
            </p>
          </div>
        </div>

        {/* Right Side - User Avatar */}
        <div className="flex items-center">
          <button
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white hover:shadow-md transition-shadow duration-200"
            aria-label="User profile"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
