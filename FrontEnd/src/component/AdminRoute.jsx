import { Navigate } from 'react-router-dom'
import { UseAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, loading, isLoggedIn } = UseAuth()

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />

  return children
}

export default AdminRoute