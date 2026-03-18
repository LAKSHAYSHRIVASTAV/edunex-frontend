import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Book,
  BarChart,
  User,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menu = [
    { name: "Home", path: "/", icon: Home },
    { name: "Study Planner", path: "/study-planner", icon: Book },
    { name: "Progress Tracker", path: "/progress-tracker", icon: BarChart },
    { name: "Analytics", path: "/analytics", icon: User },
  ];

  return (
    <aside className="w-64 h-screen p-5 flex flex-col justify-between
    bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl
    border-r border-gray-200 dark:border-gray-800 shadow-lg">

      {/* 🔷 LOGO */}
      <div>
        <h2 className="text-2xl font-extrabold mb-10
        bg-gradient-to-r from-blue-500 to-purple-600
        text-transparent bg-clip-text tracking-wide">
          EDUNEX
        </h2>

        {/* 🔹 MENU */}
        <nav className="space-y-2">
          {menu.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-300 group
                
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-[1.03]"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-gray-800 dark:hover:to-gray-800 hover:text-blue-600 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition ${
                    isActive ? "text-white" : "group-hover:scale-110"
                  }`}
                />

                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 🔻 FOOTER */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-400">
        SYSTEM CONTROLS
      </div>
    </aside>
  );
};

export default Sidebar;