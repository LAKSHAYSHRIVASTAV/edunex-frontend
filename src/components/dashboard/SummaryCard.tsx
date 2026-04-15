import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import API from "../../config/api";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function SummaryCard() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const navigate = useNavigate();

  // ================= FILE UPLOAD =================

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const fileType = file.type;
    setUploadedFileName(file.name || "");

    if (fileType === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async function () {
        try {
          const typedarray = new Uint8Array(this.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;

          let extractedText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item: any) => item.str);
            extractedText += strings.join(" ") + "\n";
          }

          setText(extractedText.trim());
        } catch (error) {
          console.error("PDF extraction failed:", error);
          alert("Could not read text from this PDF.");
        }
      };

      reader.readAsArrayBuffer(file);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const reader = new FileReader();
      reader.onload = async function () {
        try {
          const result = await mammoth.extractRawText({
            arrayBuffer: this.result as ArrayBuffer,
          });

          setText(result.value.trim());
        } catch (error) {
          console.error("DOCX extraction failed:", error);
          alert("Could not read text from this DOCX file.");
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      alert("Only PDF and DOCX files are supported.");
    }
  };

  // ================= SUMMARY =================

  const generateSummary = async () => {
    if (!text.trim()) {
      alert("Please enter or upload content first.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again.");
      return;
    }

    setSummaryLoading(true);
    setSummary("");

    try {
      const { data } = await API.post("/ai/summary", { text });
      setSummary(data.summary);
    } catch (error: any) {
      alert(error?.response?.data?.message || error.message || "Summary failed");
    } finally {
      setSummaryLoading(false);
    }
  };

  // ================= QUIZ =================

  const generateQuiz = async () => {

  if (quizLoading) return; // prevents duplicate calls

  if (!text.trim()) {
    alert("Please enter or upload content first.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login again.");
    return;
  }

  setQuizLoading(true);

    try {
      const payload = {
        text,
        inputText: text,
        extractedText: text,
        content: text,
        difficulty,
        numQuestions: 5,
        title: uploadedFileName || "Pasted Content",
      };

      const { data } = await API.post("/ai/quiz", payload);
      const questions = Array.isArray(data?.quiz) ? data.quiz : [];

      navigate("/quiz", {
        state: {
          quiz: questions,
          difficulty: data.difficulty,
          subject: data.subject,
          sourceTitle: uploadedFileName || "Pasted Content",
          sourceText: text,
        },
      });

    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Quiz generation failed"
      );
    } finally {
     setQuizLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl shadow-xl border border-white/40 rounded-2xl p-8 space-y-6 transition-all"
    >
      <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        AI Document Intelligence
      </h3>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => {
          if (e.target.files) handleFileUpload(e.target.files[0]);
        }}
        className="block w-full text-sm text-gray-600"
      />

      {uploadedFileName && (
        <p className="text-sm text-gray-500">
          Loaded file: {uploadedFileName}
        </p>
      )}

      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your study material here..."
        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
      />

      {/* Difficulty */}
<div>
  <label className="block font-semibold mb-2 text-gray-900">
    Select Difficulty
  </label>

  <select
    value={difficulty}
    onChange={(e) => setDifficulty(e.target.value)}
    className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
  >
    <option value="easy" className="text-gray-900">Easy</option>
    <option value="medium" className="text-gray-900">Medium</option>
    <option value="hard" className="text-gray-900">Hard</option>
  </select>
</div>

      <div className="flex gap-4">
        <button
  onClick={generateSummary}
  disabled={summaryLoading}
  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow hover:scale-105 transition"
>
  {summaryLoading ? "Generating..." : "Generate Summary"}
</button>

        <button
  onClick={generateQuiz}
  disabled={quizLoading}
  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow hover:scale-105 transition"
>
  {quizLoading ? "Generating..." : "Generate Quiz"}
</button>
      </div>

      {summary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-6 bg-indigo-50 rounded-xl border border-indigo-100"
        >
          <h4 className="font-semibold mb-3 text-indigo-700">
            Summary
          </h4>
          <p className="whitespace-pre-line text-gray-700 leading-relaxed">
            {summary}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}




