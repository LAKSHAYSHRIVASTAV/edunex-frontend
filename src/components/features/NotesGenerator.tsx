import React, { useState } from "react";
import axios from "axios";

const NotesGenerator = () => {
  const [content, setContent] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FORCE correct backend (avoid env issues for now)
  const API_URL = "https://edunex-backend-rj22.onrender.com";

  const handleGenerate = async () => {
    if (!content.trim()) {
      alert("Please enter content");
      return;
    }

    // 🔍 DEBUG (remove later)
    console.log("API_URL:", API_URL);
    console.log("FINAL URL:", `${API_URL}/api/notes/generate`);

    try {
      setLoading(true);
      setNotes("");

      const res = await axios.post(
        `${API_URL}/api/notes/generate`,
        {
          content,
          difficulty,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setNotes(res.data.notes);
      } else {
        alert(res.data.message || "Failed to generate notes");
      }
    } catch (err: any) {
      console.error("ERROR:", err?.response?.data || err.message);

      alert(
        err?.response?.data?.message ||
          "Error generating notes. Check backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">🧠 AI Notes Generator</h2>

      <textarea
        placeholder="Paste your study material..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-40 p-3 border rounded-lg mb-4"
      />

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Generating..." : "Generate Notes"}
      </button>

      {notes && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg whitespace-pre-wrap">
          {notes}
        </div>
      )}
    </div>
  );
};

export default NotesGenerator;