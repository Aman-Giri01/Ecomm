import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiHome } from 'react-icons/fi'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center max-w-sm">
        <div className="w-24 h-24 bg-slate-100 dark:bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-200 dark:border-gray-800">
          <span className="text-4xl font-black text-slate-300 dark:text-gray-600">?</span>
        </div>
        <h1 className="text-7xl font-black text-slate-200 dark:text-gray-800 mb-2">404</h1>
        <h2 className="text-xl font-black text-slate-700 dark:text-gray-300 mb-3">Page Not Found</h2>
        <p className="text-sm text-slate-400 dark:text-gray-500 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 font-bold rounded-2xl text-sm hover:bg-slate-100 dark:hover:bg-gray-900 transition-colors">
            <FiArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-2xl text-sm transition-colors shadow-lg shadow-amber-500/30">
            <FiHome className="w-4 h-4" /> Home
          </button>
        </div>
      </div>
    </div>
  )
}
export default NotFound