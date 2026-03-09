import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft, FiSun, FiMoon, FiSend, FiCheck } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const { darkMode, toggleDarkMode } = useTheme()
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await authService.passwordForgot({ email })
      setSent(true)
      toast.success('Reset link sent! Check your inbox.')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to send reset link'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">

      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 shadow-sm transition-colors"
      >
        {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
      </button>

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-white font-black text-2xl">E</span>
            </div>
            <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">EliteMart</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-gray-800 p-8">

          {sent ? (
            /* ── Success state ── */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FiCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Email Sent!</h2>
              <p className="text-slate-400 dark:text-gray-500 text-sm mb-2">
                We've sent a password reset link to:
              </p>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-6 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl inline-block">
                {email}
              </p>
              <p className="text-xs text-slate-400 dark:text-gray-500 mb-7 leading-relaxed">
                Didn't receive it? Check your spam folder or try again in a few minutes.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="w-full border-2 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 font-bold py-3 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
              >
                Try a different email
              </button>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Forgot Password?</h2>
              <p className="text-slate-400 dark:text-gray-500 text-sm mb-7">
                No worries! Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 w-4 h-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 font-semibold transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword