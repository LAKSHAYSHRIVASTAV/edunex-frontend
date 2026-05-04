import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  HelpCircle,
  BookOpen,
  Calendar,
  BarChart3,
} from "lucide-react";

interface ActionButton {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  gradient: string;
  gradientIcon: string;
  accentColor: string;
}

interface Props {
  onFlashcardsClick?: () => void; // ✅ still optional (won’t break anything)
}

const ActionButtons: React.FC<Props> = ({ onFlashcardsClick }) => {
  const navigate = useNavigate(); // ✅ navigation added safely

  const buttons: ActionButton[] = [
    {
  id: "notes",
  label: "Notes",
  sublabel: "AI Notes Generation",
  icon: <FileText size={24} />,
  gradient: "from-blue-500 via-cyan-500 to-blue-600",
  gradientIcon: "from-blue-400 to-cyan-400",
  accentColor: "bg-blue-100/40",
},
     
    {
      id: "quiz",
      label: "Quiz",
      sublabel: "Test Knowledge",
      icon: <HelpCircle size={24} />,
      gradient: "from-purple-500 via-violet-500 to-purple-600",
      gradientIcon: "from-purple-400 to-violet-400",
      accentColor: "bg-purple-100/40",
    },
    {
      id: "flashcards",
      label: "Flashcards",
      sublabel: "Quick Review",
      icon: <BookOpen size={24} />,
      gradient: "from-emerald-500 via-green-500 to-emerald-600",
      gradientIcon: "from-emerald-400 to-green-400",
      accentColor: "bg-emerald-100/40",
    },
    {
      id: "schedule",
      label: "AI Tutor",
      sublabel: "Personal Guide",
      icon: <Calendar size={24} />,
      gradient: "from-amber-500 via-orange-500 to-amber-600",
      gradientIcon: "from-amber-400 to-orange-400",
      accentColor: "bg-amber-100/40",
    },
    {
      id: "report",
      label: "Analytics",
      sublabel: "Track Progress",
      icon: <BarChart3 size={24} />,
      gradient: "from-rose-500 via-pink-500 to-rose-600",
      gradientIcon: "from-rose-400 to-pink-400",
      accentColor: "bg-rose-100/40",
    },
  ];

  const handleClick = (id: string) => {
    switch (id) {
      case "flashcards":
        if (onFlashcardsClick) {
          onFlashcardsClick();
        } else {
          navigate("/flashcards");
        }
        break;

      case "quiz":
        navigate("/quiz");
        break;

      case "schedule":
        navigate("/ai-tutor");
        break;

      case "report":
        navigate("/analytics");
        break;

      case "notes":
  navigate("/notes");
  break;

      default:
        break;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-lg border border-gray-200/50 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Quick Actions
          </h3>
        </div>
        <p className="text-sm text-gray-600 ml-11">
          Access powerful study tools instantly
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleClick(button.id)}
            className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl active:scale-95"
            aria-label={button.label}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${button.gradient} opacity-10 group-hover:opacity-15 transition-opacity duration-500`}
            />

            <div className="relative px-6 py-8 flex flex-col items-center justify-center text-center space-y-3 backdrop-blur-sm">
              <div
                className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${button.gradient}
                shadow-lg group-hover:shadow-2xl transition-all duration-500
                flex items-center justify-center text-white group-hover:-translate-y-1`}
              >
                <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                <div className="relative">{button.icon}</div>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                  {button.label}
                </h4>
                <p className="text-xs text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-300">
                  {button.sublabel}
                </p>
              </div>

              <div
                className={`w-8 h-1 bg-gradient-to-r ${button.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-12`}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionButtons;
