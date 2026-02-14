import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AITutor() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const askTutor = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://edunex-backend-rj22.onrender.com/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: userMessage.content }),
        }
      );

      const data = await res.json();

      const aiMessage: Message = {
        role: "ai",
        content: data.reply || "AI could not respond.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Tutor Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error connecting to AI service." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold mb-6">🤖 AI Tutor</h1>

        {/* Chat Messages */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl ${
                msg.role === "user"
                  ? "bg-orange-100 text-right"
                  : "bg-gray-100 text-left"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="p-4 bg-gray-100 rounded-xl">
              AI is thinking...
            </div>
          )}
        </div>

        {/* Input */}
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-4 border rounded-lg"
          placeholder="Ask your study question..."
        />

        <button
          onClick={askTutor}
          className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg"
        >
          Ask Tutor
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 px-6 py-2 bg-gray-600 text-white rounded-lg"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}



