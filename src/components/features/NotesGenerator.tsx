import React, { useState } from "react";
import axios from "axios";

const NotesGenerator = () => {
  const [content, setContent] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!content) {
      alert("Please enter content");
      return;
    }

    try {
      setLoading(true);
      setNotes("");

      const res = await axios.post("/api/notes/generate", {
        content,
        difficulty,
      });

      setNotes(res.data.notes);
    } catch (err) {
      console.error(err);
      alert("Error generating notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">AI Notes Generator</h2>

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
        className="bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        Generate Notes
      </button>

      {loading && <p className="mt-4">Generating...</p>}

      {notes && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg whitespace-pre-wrap">
          {notes}
        </div>
      )}
    </div>
  );
};

export default NotesGenerator;