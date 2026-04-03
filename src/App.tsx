import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import QuizHistory from "./pages/QuizHistory";
import FlashcardsPage from "./pages/FlashcardsPage";
import Analytics from "./pages/Analytics";
import AITutor from "./pages/AITutor";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import Friends from "./pages/Friends";
import StudyRooms from "./pages/StudyRooms";
import AdminPage from "./pages/AdminPage";

import AIPlanGenerator from "./pages/AIPlanGenerator";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ReportPage from "./components/features/report/ReportPage";
import ReportPreview from "./components/features/report/ReportPreview";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ Default Root Redirect */}
       <Route path="/" element={<Home />} />

        {/* 🔐 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
  path="/quiz-history"
  element={
    <ProtectedRoute>
      <QuizHistory />
    </ProtectedRoute>
  }
/>

        <Route
          path="/flashcards"
          element={
            <ProtectedRoute>
              <FlashcardsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-tutor"
          element={
            <ProtectedRoute>
              <AITutor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          }
        />

       <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportPreview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />

        <Route
          path="/study-rooms"
          element={
            <ProtectedRoute>
              <StudyRooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/study-planner"
          element={
            <ProtectedRoute>
              <AIPlanGenerator />
            </ProtectedRoute>
          }
        />

        {/* ❌ 404 Page */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;








