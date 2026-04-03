import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  BarChart,
  Trophy,
  Award,
  Users,
  MessageCircle,
  User,
  ShieldCheck,
  CalendarCheck,
  
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const mainMenu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
   { name: "Quiz History", path: "/quiz-history", icon: Brain },
    { name: "Flashcards", path: "/flashcards", icon: BookOpen },
    { name: "AI Tutor", path: "/ai-tutor", icon: MessageCircle },
    { name: "Analytics", path: "/analytics", icon: BarChart },
     { name: "Report", path: "/report", icon: BarChart },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Achievements", path: "/achievements", icon: Award },
    { name: "Friends", path: "/friends", icon: Users },
    { name: "Study Rooms", path: "/study-rooms", icon: MessageCircle },
    { name: "Study Planner", path: "/study-planner", icon: CalendarCheck },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const adminMenu = [
    { name: "Admin Panel", path: "/admin", icon: ShieldCheck },
  ];

  const renderItem = (item: any, index: number) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <div
        key={index}
        onClick={() => navigate(item.path)}
        className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer 
        transition-all duration-300 group hover:scale-[1.02]
        ${
          isActive
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg scale-[1.03]"
            : "text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-gray-800 dark:hover:to-gray-800 hover:text-blue-600 dark:hover:text-white"
        }`}
      >
        {/* 🔥 Active Indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-lg"></div>
        )}

        <Icon
          size={18}
          className={`transition-transform duration-300 ${
            isActive ? "scale-110 text-white" : "group-hover:scale-110"
          }`}
        />

        <span>{item.name}</span>
      </div>
    );
  };

  return (
    <aside
      className="w-64 min-h-screen fixed flex flex-col
      bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl
      border-r border-gray-200 dark:border-gray-800 shadow-xl"
    >
      {/* 🔷 LOGO */}
      <div
        className="p-6 text-2xl font-extrabold tracking-wide
        bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600
        bg-clip-text text-transparent"
      >
        EDUNEX
      </div>

      {/* 🔹 MENU */}
      <nav className="mt-4 space-y-2 px-4 flex-1 overflow-y-auto">
        {mainMenu.map(renderItem)}

        {/* Divider */}
        <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

        {/* System Controls */}
        <p className="text-xs text-gray-400 uppercase tracking-wider px-2 mb-2">
          System Controls
        </p>

        {adminMenu.map(renderItem)}
      </nav>
    </aside>
  );
}

