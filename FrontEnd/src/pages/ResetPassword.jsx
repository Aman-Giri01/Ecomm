import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FiLock, FiEye, FiEyeOff, FiArrowLeft, FiSun, FiMoon, FiCheck } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const { resetPasswordToken } = useParams()
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 5) {
      toast.error('Password must be at least 5 characters')
      return
    }
    try {
      setLoading(true)
      await authService.resetPassword(resetPasswordToken, { password })
      setSuccess(true)
      toast.success('Password reset successfully!')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to reset password. The link may have expired.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Password strength indicator
  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' }
    if (pwd.length < 5) return { level: 1, label: 'Too short', color: 'bg-rose-500' }
    if (pwd.length < 8) return { level: 2, label: 'Weak',      color: 'bg-amber-500' }
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { level: 3, label: 'Fair', color: 'bg-yellow-400' }
    return { level: 4, label: 'Strong', color: 'bg-emerald-500' }
  }

  const strength = getStrength(password)

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

          {success ? (
            /* ── Success state ── */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FiCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Password Reset!</h2>
              <p className="text-slate-400 dark:text-gray-500 text-sm mb-8">
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-amber-500/30 transition-colors"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Set New Password</h2>
              <p className="text-slate-400 dark:text-gray-500 text-sm mb-7">
                Choose a strong password you haven't used before.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* New password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 w-4 h-4" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Min. 5 characters"
                      className="w-full pl-10 pr-11 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              i <= strength.level ? strength.color : 'bg-slate-200 dark:bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-semibold ${
                        strength.level <= 1 ? 'text-rose-500' :
                        strength.level === 2 ? 'text-amber-500' :
                        strength.level === 3 ? 'text-yellow-500' :
                        'text-emerald-500'
                      }`}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 w-4 h-4" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      required
                      placeholder="Repeat new password"
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border rounded-xl text-sm text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                        confirm && confirm !== password
                          ? 'border-rose-400 focus:ring-rose-400'
                          : confirm && confirm === password
                          ? 'border-emerald-400 focus:ring-emerald-400'
                          : 'border-slate-200 dark:border-gray-700 focus:ring-amber-400'
                      }`}
                    />
                    {confirm && confirm === password && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        <FiCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                    )}
                  </div>
                  {confirm && confirm !== password && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || password !== confirm}
                  className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {!success && (
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 font-semibold transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResetPassword