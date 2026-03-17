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

  // FETCH TASKS
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

  // ADD TASK
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

  // TOGGLE COMPLETE
  const toggleComplete = async (id: string) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);

    fetchTasks();
  };

  // DELETE
  const deleteTask = async (id: string) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTasks();
  };

  // PROGRESS
  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter((t) => t.completed).length / tasks.length) * 100
        );

  // STREAK CALCULATION
  const streak = tasks.filter((t) => t.completed).length;

  // CHART DATA
  const chartData = [
    { name: "Completed", value: tasks.filter((t) => t.completed).length },
    { name: "Pending", value: tasks.filter((t) => !t.completed).length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">

      {showConfetti && <Confetti />}

      {/* BACK */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 px-5 py-2 bg-white rounded-xl shadow hover:scale-105 transition"
      >
        ← Dashboard
      </button>

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-6">🚀 AI Study Planner</h1>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          {/* ADD TASK */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded mb-3"
            />

            <input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border rounded mb-3"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border rounded mb-3"
            />

            <button
              onClick={addTask}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              Add Task
            </button>
          </div>

          {/* TASKS */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`p-4 rounded-xl shadow flex justify-between ${
                  task.completed ? "bg-green-50" : "bg-white"
                }`}
              >
                <div>
                  <p className="font-bold">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    {task.subject} — {new Date(task.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleComplete(task._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    ✓
                  </button>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

         <Calendar
  onChange={(value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value)) {
      setSelectedDate(value[0]); // pick first date
    }
  }}
  value={selectedDate}
/>

          </div>

          {/* PROGRESS */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <p>Progress: {progress}%</p>
            <div className="w-full bg-gray-200 h-3 rounded mt-2">
              <div
                className="bg-green-500 h-3 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* STREAK */}
          <div className="bg-white p-4 rounded-2xl shadow">
            🔥 Streak: {streak} tasks completed
          </div>

          {/* CHART */}
          <div className="bg-white p-4 rounded-2xl shadow h-64">
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
    
  );

}

