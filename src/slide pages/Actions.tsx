import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import {
  FileText,
  HelpCircle,
  BookOpen,
  User,
  BarChart3,
  Check,
} from "lucide-react";

const actions = [
  {
    id: 'summary',
    title: 'Smart Summary',
    icon: <FileText size={20} />,
    bullets: ['Instant concise notes', 'Topic highlights', 'Citation-ready'],
  },
  {
    id: 'quiz',
    title: 'Adaptive Quiz',
    icon: <HelpCircle size={20} />,
    bullets: ['Personalized difficulty', 'Instant feedback', 'Retry suggestions'],
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    icon: <BookOpen size={20} />,
    bullets: ['Spaced repetition', 'Quick review mode', 'Import/export decks'],
  },
  {
    id: 'tutor',
    title: 'AI Tutor',
    icon: <User size={20} />,
    bullets: ['Ask clarifying questions', 'Step-by-step solutions', 'Study scheduling'],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: <BarChart3 size={20} />,
    bullets: ['Progress trends', 'Weak-topic alerts', 'Exportable reports'],
  },
];

export default function Actions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 ml-64 p-12">
          {/* Slide Header */}
          <header className="mb-10">
            <h1 className="text-5xl font-extrabold leading-tight mb-3">
              AI Actions — Feature Overview
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Presentation-style overview of the core AI actions. Each card
              represents a capability explained as concise bullet points — suitable
              for demos, slides, or quick handoffs.
            </p>
          </header>

          {/* Actions Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((a, idx) => (
              <article
                key={a.id}
                className="relative bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center shadow">
                    {a.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{a.title}</h3>
                    <p className="text-xs text-gray-500">Key capabilities</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {a.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 text-green-500">
                        <Check size={14} />
                      </span>
                      <div>
                        <p className="text-sm text-gray-700 font-medium">{b}</p>
                        <p className="text-xs text-gray-400">Presentation bullet point</p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Slide-style footnote */}
                <div className="mt-6 text-xs text-gray-400">Use case: classroom demo • 20–60s talking points</div>
              </article>
            ))}
          </section>

          {/* Bottom CTA */}
          <div className="mt-12 flex items-center justify-between">
            <div className="text-sm text-gray-600">Toggle demos or export slides from this view.</div>
            <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:scale-105 transition-transform duration-200">
              Export as Slide
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
