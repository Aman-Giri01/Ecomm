import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UseAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const Register = () => {
  const { register, loading } = UseAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [formdata, setFormData] = useState({
    username: '', email: '', contactNumber: '', password: ''
  })

  const handleChange = (e) =>
    setFormData({ ...formdata, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
  e.preventDefault()
  const result = await register(formdata)

  if (result.success) {
    if (result.message?.toLowerCase().includes("failed")) {
      toast.warning("Account created! Verification email failed — verify later from your profile.")
      navigate('/login')
    } else {
      toast.success("Registered! Please check your email to verify.")
      navigate('/verify-email', { state: { email: formdata.email } })
    }
  }
}

  const fields = [
    { name: 'username',      label: 'Username',      type: 'text',  placeholder: 'johndoe',         icon: FiUser  },
    { name: 'email',         label: 'Email address', type: 'email', placeholder: 'you@example.com', icon: FiMail  },
    { name: 'contactNumber', label: 'Phone number',  type: 'tel',   placeholder: '+91 98765 43210', icon: FiPhone },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">

      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 shadow-sm transition-colors"
      >
        {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-white font-black text-2xl">E</span>
            </div>
            <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">EliteMart</span>
          </Link>
          <p className="text-slate-400 dark:text-gray-500 text-sm mt-1">Create your account today</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-gray-800 p-8">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Create account</h2>
          <p className="text-slate-400 dark:text-gray-500 text-sm mb-7">Fill in the details below to get started</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, placeholder, icon: Icon }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type={type} name={name} value={formdata[name]}
                    onChange={handleChange} required placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" value={formdata.password}
                  onChange={handleChange} required placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors">
                  {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-amber-500/30 mt-1">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-600 dark:text-amber-400 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register