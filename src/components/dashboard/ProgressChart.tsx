import React from "react";
import { TrendingUp, Flame, BookOpen } from "lucide-react";

interface DashboardData {
  readingProgress: number;
  quizCompletion: number;
  flashcardsReviewed: number;
  weeklyActivity: { date: string; hours: number }[];
  subjectDistribution: { subject: string; count: number }[];
  studyStreak: number;
  totalHours: number;
  avgDailyHours: number;
}

interface Props {
  dashboardData?: DashboardData | null;
}

const ProgressChart: React.FC<Props> = ({ dashboardData }) => {
  if (!dashboardData) return null;

  const weeklyData = dashboardData.weeklyActivity || [];
  const subjects = dashboardData.subjectDistribution || [];

  const maxHours =
    weeklyData.length > 0
      ? Math.max(...weeklyData.map((d) => d.hours))
      : 1;

  return (
    <div className="space-y-8">
      
      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-lg border border-gray-200/50 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1.5 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          <h2 className="text-3xl font-bold text-gray-900">
            Progress Overview
          </h2>
        </div>
        <p className="text-gray-600">
          Track your learning journey and achievements
        </p>
      </div>

      {/* ================= WEEKLY + SUBJECT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= WEEKLY STUDY ================= */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200/50 p-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-600" size={20} />
            <h3 className="text-lg font-bold text-gray-900">
              Weekly Study Hours
            </h3>
          </div>

          <div className="space-y-4">
            {weeklyData.map((day, idx) => {
              const percentage = (day.hours / maxHours) * 100;

              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {day.date}
                    </span>
                    <span className="font-bold text-gray-600">
                      {day.hours}h
                    </span>
                  </div>

                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 font-medium">
                Total Hours
              </p>
              <p className="text-lg font-bold text-blue-600 mt-1">
                {dashboardData.totalHours}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 font-medium">
                Avg Daily
              </p>
              <p className="text-lg font-bold text-purple-600 mt-1">
                {dashboardData.avgDailyHours}h
              </p>
            </div>
          </div>
        </div>

        {/* ================= SUBJECT + STREAK ================= */}
        <div className="space-y-6">

          {/* ===== SUBJECT DISTRIBUTION (MODERN) ===== */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200/50 p-8">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="text-green-600" size={20} />
              <h3 className="text-lg font-bold text-gray-900">
                Subject Distribution
              </h3>
            </div>

            <div className="space-y-4">
              {subjects.map((subject, idx) => (
                <div key={idx} className="space-y-2">
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {idx === 0 ? "📐" :
                         idx === 1 ? "⚛️" :
                         idx === 2 ? "🧪" :
                         idx === 3 ? "🔬" :
                         "📚"}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {subject.subject}
                      </span>
                    </div>

                    <span className="text-sm font-bold text-gray-700">
                      {subject.count}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                          : idx === 1
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : idx === 2
                          ? "bg-gradient-to-r from-emerald-500 to-green-500"
                          : idx === 3
                          ? "bg-gradient-to-r from-green-500 to-teal-500"
                          : "bg-gradient-to-r from-amber-500 to-orange-500"
                      }`}
                      style={{
                        width: `${subject.count}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== STUDY STREAK (MODERN) ===== */}
          <div className="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-2xl shadow-lg border border-orange-200/50 p-8">
            <div className="flex items-center justify-between">
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="text-orange-600 animate-pulse" size={24} />
                  <h3 className="text-lg font-bold text-gray-900">
                    Study Streak
                  </h3>
                </div>

                <p className="text-sm text-gray-600">
                  Keep the momentum going!
                </p>
              </div>

              <div className="text-right">
                <p className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  {dashboardData.studyStreak}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Days
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProgressChart;


