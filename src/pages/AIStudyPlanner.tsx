import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  subject: string;
  date: string;
  completed: boolean;
}

export default function AIStudyPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");

  const token = localStorage.getItem("token");
const BASE_URL =
  "https://edunex-backend-rj22.onrender.com/api/study-plan";


  // 
// FETCH TASKS 
const fetchTasks = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error("API error:", res.status);
      setTasks([]);
      return;
    }

    const data = await res.json();

    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      console.error("Unexpected response:", data);
      setTasks([]);
    }

  } catch (err) {
    console.error("Fetch Tasks Error:", err);
    setTasks([]);
  }
};


  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ ADD TASK
  const addTask = async () => {
    if (!title || !subject || !date) return;

    try {
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
    } catch (err) {
      console.error("Add Task Error:", err);
    }
  };

  // ✅ TOGGLE COMPLETE
  const toggleComplete = async (id: string) => {
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTasks();
    } catch (err) {
      console.error("Toggle Error:", err);
    }
  };

  // ✅ DELETE TASK
  const deleteTask = async (id: string) => {
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTasks();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter((t) => t.completed).length /
            tasks.length) *
            100
        );

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-bold">
        📅 AI Study Planner
      </h1>

      {/* Add Task */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="mb-2 font-semibold">
          Completion Progress: {progress}%
        </p>
        <div className="w-full bg-gray-200 h-3 rounded">
          <div
            className="bg-green-500 h-3 rounded transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`p-4 rounded-xl shadow flex justify-between items-center ${
              task.completed
                ? "bg-green-50"
                : "bg-white"
            }`}
          >
            <div>
              <p className="font-semibold">
                {task.title}
              </p>
              <p className="text-sm text-gray-500">
                {task.subject} —{" "}
                {new Date(task.date).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleComplete(task._id)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {task.completed
                  ? "Completed"
                  : "Mark Complete"}
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

