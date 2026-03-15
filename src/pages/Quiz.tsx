import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const quiz = location.state?.quiz || [];
  const difficulty = location.state?.difficulty || "medium";
  const subject = location.state?.subject || quiz[0]?.subject || "general";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
  } | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  if (!quiz || quiz.length === 0) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-bold">No Quiz Data Found</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleOptionSelect = (option: string) => {
    if (!checked) {
      setAnswers({ ...answers, [currentQuestion]: option });
    }
  };

  const handleCheckAnswer = () => {
    const selected = answers[currentQuestion];
    const correct = quiz[currentQuestion].correctAnswer;

    const isCorrect = selected === correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setFeedback({
      isCorrect,
      correctAnswer: correct,
      explanation: quiz[currentQuestion].explanation,
    });

    setChecked(true);
  };

  const handleNext = async () => {
    setChecked(false);
    setFeedback(null);

    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);

      // ✅ Send score to backend
      try {
        const token = localStorage.getItem("token");

        const finalScore = score;

        const res = await fetch(`${API_URL}/ai/score-quiz`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questions: quiz,
            userAnswers: Object.values(answers),
            score: finalScore,
            totalQuestions: quiz.length,
            difficulty: difficulty,
            subject: subject,
          }),
        });

        const data = await res.json();
        console.log("Quiz saved:", data);
      } catch (error) {
        console.error("Score save error:", error);
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {!showResult ? (
        <>
          <h2 className="text-xl font-bold mb-2">
            Subject: {subject.toUpperCase()}
          </h2>

          <h2 className="text-xl font-bold mb-2">
            Difficulty: {difficulty.toUpperCase()}
          </h2>

          <h2 className="text-xl font-bold mb-4">
            Question {currentQuestion + 1} of {quiz.length}
          </h2>

          <p className="font-semibold mb-4">
            {quiz[currentQuestion].question}
          </p>

          {quiz[currentQuestion].options.map((option: string, i: number) => {
            const selected = answers[currentQuestion] === option;
            const isCorrectOption =
              option === quiz[currentQuestion].correctAnswer;

            let bgColor = "bg-white";

            if (checked) {
              if (selected && !isCorrectOption) bgColor = "bg-red-200";
              if (isCorrectOption) bgColor = "bg-green-200";
            }

            return (
              <label
                key={i}
                className={`block p-3 mb-2 border rounded cursor-pointer ${bgColor}`}
              >
                <input
                  type="radio"
                  name="option"
                  value={option}
                  disabled={checked}
                  checked={selected}
                  onChange={() => handleOptionSelect(option)}
                  className="mr-2"
                />
                {option}

                {checked && isCorrectOption && " ✔"}
                {checked && selected && !isCorrectOption && " ❌"}
              </label>
            );
          })}

          {checked && feedback && (
            <div className="mt-4 p-4 bg-yellow-100 rounded">
              <p className="font-semibold">
                {feedback.isCorrect ? "✅ Correct!" : "❌ Incorrect!"}
              </p>

              {!feedback.isCorrect && (
                <>
                  <p>
                    Correct Answer:{" "}
                    <strong>{feedback.correctAnswer}</strong>
                  </p>
                  <p className="mt-2">
                    💡 Explanation: {feedback.explanation}
                  </p>
                </>
              )}
            </div>
          )}

          <div className="flex justify-between mt-6">
            {!checked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!answers[currentQuestion]}
                className="px-6 py-2 bg-blue-600 text-white rounded"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-600 text-white rounded"
              >
                {currentQuestion === quiz.length - 1
                  ? "Finish Quiz"
                  : "Next"}
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed 🎉</h2>

          <p className="text-lg">
            Score: {score} / {quiz.length}
          </p>

          <p className="text-lg">
            Percentage: {Math.round((score / quiz.length) * 100)}%
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}