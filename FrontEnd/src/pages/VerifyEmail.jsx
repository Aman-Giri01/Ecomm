import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiMail, FiCheck, FiArrowRight, FiRefreshCw } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'

const VerifyEmail = () => {
  const navigate   = useNavigate()
  const location   = useLocation()
  // email passed via navigate state from Register
  const email      = location.state?.email ?? ''

  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleResend = async () => {
    if (!email) { toast.error('Email not found. Please register again.'); return }
    try {
      setSending(true)
      await authService.resendEmailVerification({ email })
      setSent(true)
      toast.success('Verification email resent!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to resend email')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 mx-auto mb-3">
            <span className="text-white font-black text-2xl">E</span>
          </div>
          <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Ecomm</span>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-gray-800 p-8 text-center">

          {/* Icon */}
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FiMail className="w-8 h-8 text-amber-500" />
          </div>

          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
            Check your email
          </h2>
          <p className="text-slate-400 dark:text-gray-500 text-sm mb-1">
            We sent a verification link to
          </p>
          {email && (
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl inline-block mb-6">
              {email}
            </p>
          )}

          <p className="text-xs text-slate-400 dark:text-gray-500 mb-8">
            Click the link in the email to verify your account. Check your spam folder if you don't see it.
          </p>

          {/* Resend button */}
          <div className="space-y-3">
            {sent ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl py-3">
                <FiCheck className="w-4 h-4" /> Email resent successfully!
              </div>
            ) : (
              <button
                onClick={handleResend}
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-2xl text-sm transition-colors shadow-lg shadow-amber-500/30 disabled:opacity-50"
              >
                {sending ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending...</>
                ) : (
                  <><FiRefreshCw className="w-4 h-4" /> Resend Verification Email</>
                )}
              </button>
            )}

            {/* Skip button */}
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 font-bold py-3 rounded-2xl text-sm transition-colors"
            >
              Skip for now <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-gray-600 mt-6">
          You can verify your email later from your profile settings.
        </p>
      </div>
    </div>
  )
}

export default VerifyEmail