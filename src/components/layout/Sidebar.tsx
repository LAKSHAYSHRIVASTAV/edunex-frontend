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
    { name: "Quiz", path: "/quiz", icon: Brain },
    { name: "Flashcards", path: "/flashcards", icon: BookOpen },
    { name: "AI Tutor", path: "/ai-tutor", icon: MessageCircle },
    { name: "Analytics", path: "/analytics", icon: BarChart },
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
        className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 group ${
          isActive
            ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 font-semibold shadow-sm"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        {/* Active Indicator Bar */}
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r-lg"></div>
        )}

        <Icon
          size={18}
          className={`transition-transform duration-300 ${
            isActive ? "scale-110" : "group-hover:scale-105"
          }`}
        />

        <span>{item.name}</span>
      </div>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-xl fixed flex flex-col border-r border-gray-100">
      <div className="p-6 text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        EDUNEX
      </div>

      <nav className="mt-4 space-y-2 px-4 flex-1 overflow-y-auto">
        {mainMenu.map(renderItem)}

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Admin Section */}
        <p className="text-xs text-gray-400 uppercase tracking-wider px-2 mb-2">
          System Controls
        </p>

        {adminMenu.map(renderItem)}
      </nav>
    </aside>
  );
}


