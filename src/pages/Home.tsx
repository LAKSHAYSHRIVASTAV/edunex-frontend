import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ FIXED: correct image name
import dashboardImg from "../assets/dashboard.png";

function Home() {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  const handleGenerate = () => {
    if (!input) return;

    setLoading(true);
    setOutput("");

    setTimeout(() => {
      setOutput(
        "This is an AI-generated summary of your content. It simplifies your text and highlights key concepts for faster learning."
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 scroll-smooth">

      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600">EDUNEX</h1>

        <div className="space-x-6 hidden md:flex">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#demo" className="hover:text-blue-600">Demo</a>
        </div>

        <div className="space-x-4">
          <button onClick={handleLogin} className="text-gray-700 hover:text-blue-600">
            Login
          </button>
          <button
            onClick={handleRegister}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Turn Any Document Into <br />
          <span className="text-blue-600">Smart Learning 🚀</span>
        </h1>

        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Generate summaries, quizzes, flashcards, insights, and more using AI.
        </p>

        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-lg"
        >
          Try Now
        </button>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-20 px-10 bg-white text-center">
        <h2 className="text-3xl font-bold mb-12">Powerful AI Features</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            "AI Summary",
            "Quiz Generator",
            "Flashcards",
            "AI Tutor",
            "Analytics",
            "Knowledge Graph"
          ].map((feature, index) => (
            <div key={index} className="p-6 shadow rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-semibold">{feature}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DEMO ================= */}
      <section id="demo" className="py-20 px-10 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-6">Try AI Demo</h2>

        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your notes here..."
            className="w-full p-3 border rounded mb-4"
          />

          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            Generate
          </button>

          {loading && (
            <p className="mt-4 text-blue-600">Analyzing your document...</p>
          )}

          {output && (
            <div className="mt-4 bg-blue-100 p-3 rounded text-left">
              {output}
            </div>
          )}
        </div>
      </section>

      {/* ================= DASHBOARD PREVIEW ================= */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Powerful Dashboard Experience
        </h2>

        <p className="text-gray-600 mb-10">
          Track progress, insights, and learning performance.
        </p>

        <img
          src={dashboardImg}
          alt="Dashboard Preview"
          className="mx-auto rounded-xl shadow-lg max-w-4xl"
        />
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold mb-6">
          Start Learning Smarter 🚀
        </h2>

        <button
          onClick={handleRegister}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Get Started Free
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center py-6 bg-gray-100">
        <p className="text-gray-500">
          © 2026 EDUNEX. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default Home;