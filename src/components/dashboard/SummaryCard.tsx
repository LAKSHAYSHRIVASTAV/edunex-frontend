import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";
import API from "../../config/api";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

export default function SummaryCard() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [fileReading, setFileReading] = useState(false);

  const navigate = useNavigate();

  const getFileExtension = (fileName) =>
    fileName.split(".").pop()?.trim().toLowerCase() || "";

  const isPdfFile = (file) =>
    file.type === "application/pdf" || getFileExtension(file.name) === "pdf";

  const isDocxFile = (file) =>
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    getFileExtension(file.name) === "docx";

  // ================= FILE UPLOAD =================

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadedFileName(file.name || "");
    setFileReading(true);

    if (isPdfFile(file)) {
      const reader = new FileReader();

      reader.onload = async function () {
        try {
          const typedarray = new Uint8Array(this.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;

          let extractedText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            const strings = content.items
              .map((item) => ("str" in item ? item.str : ""))
              .filter(Boolean);

            extractedText += strings.join(" ") + "\n";
          }

          const cleanedText = extractedText.replace(/\s+/g, " ").trim();

          if (!cleanedText) {
            alert(
              "This PDF has no selectable text. Upload text-based file."
            );
            setText("");
            return;
          }

          setText(cleanedText);
        } catch (error) {
          console.error("PDF extraction failed:", error);
          alert("PDF read failed");
        } finally {
          setFileReading(false);
        }
      };

      reader.onerror = () => {
        setFileReading(false);
        alert("Could not open PDF");
      };

      reader.readAsArrayBuffer(file);
    } else if (isDocxFile(file)) {
      const reader = new FileReader();

      reader.onload = async function () {
        try {
          const result = await mammoth.extractRawText({
            arrayBuffer: this.result as ArrayBuffer,
          });

          const cleanedText = result.value.replace(/\s+/g, " ").trim();

          if (!cleanedText) {
            alert("Empty DOCX file");
            setText("");
            return;
          }

          setText(cleanedText);
        } catch (error) {
          console.error("DOCX extraction failed:", error);
          alert("DOCX read failed");
        } finally {
          setFileReading(false);
        }
      };

      reader.onerror = () => {
        setFileReading(false);
        alert("Could not open DOCX");
      };

      reader.readAsArrayBuffer(file);
    } else {
      setFileReading(false);
      alert("Only PDF and DOCX supported");
    }
  };

  // ================= SUMMARY =================

  const generateSummary = async () => {
    if (!text.trim()) {
      alert("Please enter content");
      return;
    }

    setSummaryLoading(true);
    setSummary("");

    try {
      const { data } = await API.post("/ai/summary", { text });
      setSummary(data.summary);
    } catch (error) {
      alert("Summary failed");
    } finally {
      setSummaryLoading(false);
    }
  };

  // ================= QUIZ (🔥 FIXED) =================

  const generateQuiz = async () => {
    if (quizLoading) return;

    if (!text.trim()) {
      alert("Please enter content");
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

      // ✅ FIXED EXTRACTION
      const questions =
        data?.quiz ||
        data?.questions ||
        (Array.isArray(data) ? data : []);

      console.log("QUIZ API RESPONSE:", data);
      console.log("FINAL QUESTIONS:", questions);

      // ✅ SAFETY CHECK
      if (!questions || questions.length === 0) {
        alert("Quiz not generated. Add more detailed content.");
        return;
      }

      // ✅ SAVE FOR REFRESH
      localStorage.setItem("quiz", JSON.stringify(questions));

      // ✅ NAVIGATE
      navigate("/quiz", {
        state: {
          quiz: questions,
          difficulty: data?.difficulty || difficulty,
          subject: data?.subject || "General",
          sourceTitle: uploadedFileName || "Pasted Content",
          sourceText: text,
        },
      });

    } catch (error) {
      console.error("Quiz error:", error);
      alert("Quiz generation failed");
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl shadow-xl border border-white/40 rounded-2xl p-8 space-y-6"
    >
      <h3 className="text-2xl font-bold text-indigo-600">
        AI Document Intelligence
      </h3>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) =>
          e.target.files && handleFileUpload(e.target.files[0])
        }
      />

      {uploadedFileName && (
        <p className="text-sm text-gray-500">
          Loaded file: {uploadedFileName}
        </p>
      )}

      {fileReading && <p className="text-indigo-600">Reading file...</p>}

      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your study material..."
        className="w-full p-4 border rounded-xl"
      />

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="w-full p-3 border rounded-xl"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <div className="flex gap-4">
        <button
          onClick={generateSummary}
          disabled={summaryLoading || fileReading}
          className="px-6 py-3 bg-indigo-500 text-white rounded-xl"
        >
          {summaryLoading ? "Generating..." : "Summary"}
        </button>

        <button
          onClick={generateQuiz}
          disabled={quizLoading || fileReading}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl"
        >
          {quizLoading ? "Generating..." : "Quiz"}
        </button>
      </div>

      {summary && (
        <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
          <h4 className="font-semibold">Summary</h4>
          <p>{summary}</p>
        </div>
      )}
    </motion.div>
  );
}