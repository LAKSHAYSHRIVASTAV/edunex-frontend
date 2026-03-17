import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import Confetti from "react-confetti";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Task {
  _id: string;
  title: string;
  subject: string;
  date: string;
  completed: boolean;
}

export default function AIStudyPlanner() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showConfetti, setShowConfetti] = useState(false);

  const token = localStorage.getItem("token");

  const BASE_URL =
    "https://edunex-backend-rj22.onrender.com/api/study-plan";

  const fetchTasks = async () => {
    try {
      const res = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title || !subject || !date) return;

    await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, subject, date }),
    });

    setTitle("");
    setSubject("");
    setDate("");
    fetchTasks();
  };

  const toggleComplete = async (id: string) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);

    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTasks();
  };

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter((t) => t.completed).length / tasks.length) * 100
        );

  const streak = tasks.filter((t) => t.completed).length;

  const chartData = [
    { name: "Completed", value: tasks.filter((t) => t.completed).length },
    { name: "Pending", value: tasks.filter((t) => !t.completed).length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex text-gray-800">

      {showConfetti && <Confetti />}

      <div className="flex-1 p-6">

        {/* 🔥 IMPORTANT CHANGE: removed min-h-screen */}
        <div className="rounded-3xl p-6 text-white bg-gradient-to-br from-[#5f5cff] via-[#8b5cf6] to-[#ec4899] shadow-xl">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">
              🚀 AI Study Planner
            </h1>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-white/20 backdrop-blur-lg rounded-xl hover:scale-105 transition"
            >
              ← Dashboard
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="md:col-span-2 space-y-6">

              {/* ADD TASK */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl"
              >
                <input
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/20 mb-3 outline-none"
                />

                <input
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/20 mb-3 outline-none"
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/20 mb-3 outline-none"
                />

                <button
                  onClick={addTask}
                  className="w-full bg-gradient-to-r from-indigo-400 to-pink-500 py-2 rounded-xl font-semibold"
                >
                  ➕ Add Task
                </button>
              </motion.div>

              {/* TASKS */}
              <div className="space-y-4">
                {tasks.map((task) => (
                  <motion.div
                    key={task._id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl shadow flex justify-between ${
                      task.completed
                        ? "bg-green-500/20"
                        : "bg-white/10 backdrop-blur-xl"
                    }`}
                  >
                    <div>
                      <p className="font-bold">{task.title}</p>
                      <p className="text-sm text-gray-200">
                        {task.subject} —{" "}
                        {new Date(task.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleComplete(task._id)}
                        className="bg-green-500 px-3 py-1 rounded"
                      >
                        ✓
                      </button>

                      <button
                        onClick={() => deleteTask(task._id)}
                        className="bg-red-500 px-3 py-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="space-y-6">

              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl">
                <Calendar
                  onChange={(value) => {
                    if (value instanceof Date) setSelectedDate(value);
                    else if (Array.isArray(value)) setSelectedDate(value[0]);
                  }}
                  value={selectedDate}
                />
              </div>

              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl">
                <p>Progress: {progress}%</p>
                <div className="w-full bg-gray-300 h-3 rounded mt-2">
                  <div
                    className="bg-green-400 h-3 rounded"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl">
                🔥 Streak: {streak}
              </div>

              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
