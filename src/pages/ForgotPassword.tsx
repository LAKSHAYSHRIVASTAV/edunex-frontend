import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Sun, Moon, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const emailError = submitted && !email ? 'Email is required' : submitted && !isValidEmail(email) ? 'Please enter a valid email' : '';

  /**
   * Backend-ready forgot password handler
   * Placeholder API call to POST /api/auth/forgot-password
   * Easy to connect to real backend later
   */
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!isValidEmail(email)) {
      return;
    }

    setLoading(true);

    try {
      // Placeholder API call - replace with real endpoint later
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Handle response - do NOT hardcode success
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to send reset link. Please try again.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      // Show success message
      setSuccessMessage('If this email exists, a reset link has been sent.');
      setEmail('');
      setLoading(false);
    } catch (error) {
      // Handle network or parsing errors
      const errorMsg = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      setErrorMessage(errorMsg);
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Animated background elements */}
      <div className={`absolute top-20 right-1/4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse ${
        darkMode ? 'bg-blue-500' : 'bg-blue-300'
      }`} />
      <div className={`absolute -bottom-8 left-1/3 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse ${
        darkMode ? 'bg-purple-500' : 'bg-purple-300'
      }`} />

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 ${
          darkMode
            ? 'bg-white/10 text-yellow-300 hover:bg-white/20'
            : 'bg-gray-900/10 text-gray-700 hover:bg-gray-900/20'
        }`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className={`${
          darkMode
            ? 'bg-white/10 border border-white/20'
            : 'bg-white/80 border border-gray-200'
        } backdrop-blur-2xl rounded-3xl p-8 shadow-2xl transition-colors duration-300`}>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className={`text-3xl font-black mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ${
              !darkMode ? 'from-blue-600 to-purple-600' : ''
            }`}>
              Reset Password
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter your email to receive a password reset link
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              darkMode
                ? 'bg-green-500/20 border border-green-500/50'
                : 'bg-green-100 border border-green-300'
            }`}>
              <CheckCircle className={`flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} size={20} />
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                  {successMessage}
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-green-400/70' : 'text-green-600/70'}`}>
                  Check your email (including spam folder) for the reset link.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              darkMode
                ? 'bg-red-500/20 border border-red-500/50'
                : 'bg-red-100 border border-red-300'
            }`}>
              <AlertCircle className={`flex-shrink-0 ${darkMode ? 'text-red-400' : 'text-red-600'}`} size={20} />
              <p className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                {errorMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleForgotPassword} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode
                      ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                      : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'
                  } ${emailError ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {emailError && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                  <AlertCircle size={14} />
                  <span>{emailError}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !!successMessage}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${
                loading || successMessage
                  ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${darkMode ? 'border-white/10' : 'border-gray-300'}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${darkMode ? 'bg-slate-900 text-gray-400' : 'bg-white text-gray-600'}`}>Remember your password?</span>
            </div>
          </div>

          {/* Back to Login Button */}
          <button
            type="button"
            onClick={handleBackToLogin}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              darkMode
                ? 'bg-white/5 border border-white/20 text-gray-200 hover:bg-white/10 hover:border-white/30'
                : 'bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200 hover:border-gray-400'
            }`}
          >
            <ArrowLeft size={18} />
            Back to Sign In
          </button>
        </div>

        {/* Info Box */}
        <div className={`mt-6 p-4 rounded-lg border ${
          darkMode
            ? 'bg-blue-500/10 border-blue-500/30'
            : 'bg-blue-100 border-blue-300'
        }`}>
          <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            <strong>Note:</strong> This is a backend-ready form. The API endpoint is configured at <code className="font-mono">/api/auth/forgot-password</code>. Connect your backend server to enable password reset functionality.
          </p>
        </div>
      </div>
    </div>
  );
}
