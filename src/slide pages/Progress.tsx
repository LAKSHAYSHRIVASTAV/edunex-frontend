import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { Sparkles, BarChart3, Clock, Zap, CheckCircle } from "lucide-react";
import ProgressChart from "../components/dashboard/ProgressChart";

export default function Progress() {
  const metrics = [
    { id: 'hours', label: 'Total Hours', value: '34.2', hint: 'Last 7 days' },
    { id: 'avg', label: 'Avg / day', value: '4.9h', hint: 'Consistent pace' },
    { id: 'streak', label: 'Streak', value: '7 days', hint: 'Keep going!' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 ml-64 p-12">
          {/* Slide header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-1.5 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              <Sparkles className="text-blue-600" size={18} />
              <h1 className="text-4xl font-extrabold">Progress Analytics</h1>
            </div>
            <p className="text-gray-600 max-w-3xl">Simple, explanation-friendly layout for presenting study progress and insights during demos.</p>
          </div>

          {/* Top metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {metrics.map((m) => (
              <div key={m.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{m.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
                  </div>
                  <div className="text-gray-400 text-sm">{m.hint}</div>
                </div>
              </div>
            ))}
          </section>

          {/* Main content: left - chart, right - indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Weekly Study & Progress</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <BarChart3 size={16} />
                    <span>Interactive overview</span>
                  </div>
                </div>

                {/* Reuse ProgressChart for visual */}
                <ProgressChart />
              </div>
            </div>

            {/* Right column: indicators and quick insights */}
            <aside className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Quick Insights</h3>
                  <Clock size={16} className="text-gray-400" />
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="text-green-500 mt-1"><CheckCircle size={16} /></div>
                    <div>
                      <p className="text-sm font-medium">Consistent study pattern</p>
                      <p className="text-xs text-gray-400">High engagement on weekdays</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-orange-500 mt-1"><Zap size={16} /></div>
                    <div>
                      <p className="text-sm font-medium">Opportunities for quizzes</p>
                      <p className="text-xs text-gray-400">Target weak topics next session</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-1">
                <div className="bg-white/95 rounded-xl p-5 backdrop-blur">
                  <h4 className="text-lg font-bold">Presentation Tip</h4>
                  <p className="text-sm text-gray-600 mt-2">Use the left chart to narrate weekly effort, then call out the insights on the right as action items.</p>
                </div>
              </div>
            </aside>
          </div>

          {/* Footer actions */}
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600">Need a downloadable report? Export analytics for sharing.</p>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:scale-105 transition-transform">Export Report</button>
          </div>
        </main>
      </div>
    </div>
  );
}
