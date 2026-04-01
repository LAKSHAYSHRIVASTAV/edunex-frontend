import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dashboardImg from "../assets/dashboard.png";

function Home() {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

 const handleGenerate = async () => {
  if (!input.trim()) {
    setOutput("⚠️ Please enter some text");
    return;
  }
  setLoading(true);
  setOutput("");

  try {
    const res = await fetch(
      "https://edunex-backend-rj22.onrender.com/api/ai/summary",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      }
    );

    const data = await res.json();

    setOutput(
      data?.summary ||
      data?.result ||
      "No response from AI"
    );

  } catch (err) {
    setOutput("⚠️ Backend connection failed");
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen bg-gray-50 scroll-smooth">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          EDUNEX
          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
            Beta
          </span>
        </h1>

        <div className="space-x-6 hidden md:flex">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#demo" className="hover:text-blue-600">Demo</a>
        </div>

        <div className="space-x-4">
          <button onClick={handleLogin}>Login</button>
          <button
            onClick={handleRegister}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* 🥇 HERO */}
      <motion.section
        className="text-center py-20 px-6 bg-gradient-to-r from-blue-50 via-purple-50 to-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Turn Your Notes Into <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            AI-Powered Learning 🚀
          </span>
        </h1>

        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Save 10+ hours/week with AI summaries, quizzes, and smart insights.
        </p>

        <motion.button
          onClick={handleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl shadow-xl hover:shadow-2xl transition"
        >
          Try Now
        </motion.button>

        <p className="text-sm text-gray-400 mt-4">
          ⭐ Trusted by 10,000+ students worldwide
        </p>
      </motion.section>

      {/* 🔥 PROBLEM SECTION */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Stop Wasting Hours on Notes 😫
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto">
          Students spend hours reading and still forget everything.
          EDUNEX turns your notes into smart learning instantly.
        </p>
      </section>

      {/* 🥈 TRUST */}
      <div className="text-center py-10">
        <div className="flex justify-center gap-12 flex-wrap">

          {[
            { value: "10K+", label: "Users" },
            { value: "50K+", label: "Notes Generated" },
            { value: "4.8★", label: "Rating" }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <h3 className="text-4xl font-bold text-blue-600">
                {item.value}
              </h3>
              <p className="text-gray-500">{item.label}</p>
            </motion.div>
          ))}

        </div>
      </div>

      {/* 🥉 FEATURES */}
      <section id="features" className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">
          Powerful AI Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8 px-10">

          {[
            { icon: "📄", title: "AI Summary" },
            { icon: "🧠", title: "Quiz Generator" },
            { icon: "🗂️", title: "Flashcards" },
            { icon: "🤖", title: "AI Tutor" },
            { icon: "📊", title: "Analytics" },
            { icon: "🔗", title: "Knowledge Graph" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition hover:-translate-y-2"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold">{item.title}</h3>
            </motion.div>
          ))}

        </div>
      </section>

      {/* 🏆 DEMO */}
      <section id="demo" className="py-20 px-10 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-6">Try AI Demo</h2>

        <motion.div
          className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your notes here..."
            className="w-full p-4 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <motion.button
            onClick={handleGenerate}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:scale-105 transition"
          >
            Generate
          </motion.button>

          {loading && (
            <div className="animate-pulse mt-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          )}

          {output && (
            <div className="mt-4 bg-blue-50 p-4 rounded-xl text-left whitespace-pre-line">
              {output}
            </div>
          )}
        </motion.div>
      </section>

      {/* 💻 DASHBOARD */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Powerful Dashboard Experience
        </h2>

        <motion.img
          src={dashboardImg}
          alt="Dashboard"
          className="mx-auto rounded-2xl shadow-xl max-w-4xl"
          whileHover={{ scale: 1.03 }}
        />
      </section>

      {/* 💬 TESTIMONIALS */}
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Loved by Students 💬
        </h2>

        <div className="grid md:grid-cols-3 gap-8 px-10">

          {["Rahul", "Priya", "Aman"].map((name, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition"
            >
              <p className="text-gray-600 mb-4">
                This saved me hours of study time!
              </p>
              <h4 className="font-semibold">{name}</h4>
              <p className="text-yellow-500">★★★★★</p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* 🚀 CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Study Smarter, Not Harder?
        </h2>

        <p className="text-gray-500 mb-6">
          Join thousands of students already using EDUNEX.
        </p>

        <motion.button
          onClick={handleRegister}
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Get Started Free
        </motion.button>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 bg-gray-100">
        <p className="text-gray-500">
          © 2026 EDUNEX. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default Home;