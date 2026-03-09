import { NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiPackage, FiShoppingBag, FiLogOut, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'
import { UseAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  { to: '/admin',          icon: FiGrid,        label: 'Dashboard'  },
  { to: '/admin/products', icon: FiPackage,     label: 'Products'   },
  { to: '/admin/orders',   icon: FiShoppingBag, label: 'Orders'     },
]

const AdminLayout = ({ children }) => {
  const { logout, user } = UseAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800 dark:border-gray-800">
        <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md shadow-amber-500/30">
          E
        </div>
        <div>
          <p className="font-black text-white text-sm tracking-tight">EliteMart</p>
          <p className="text-xs text-slate-500">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-800 dark:border-gray-800 space-y-1">
        <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1">
          <div className="w-7 h-7 bg-amber-500/20 rounded-lg flex items-center justify-center text-xs font-black text-amber-400">
            {user?.username?.slice(0, 2).toUpperCase() ?? 'AD'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.username}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-gray-800 transition-colors">
          {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-900/20 transition-colors">
          <FiLogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex transition-colors duration-300">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-slate-900 dark:bg-gray-900 sticky top-0 h-screen border-r border-slate-800 dark:border-gray-800">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-56 bg-slate-900 dark:bg-gray-900 z-50 lg:hidden border-r border-slate-800">
            <Sidebar />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 dark:bg-gray-900 border-b border-slate-800 dark:border-gray-800 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="text-slate-400 hover:text-white">
            <FiMenu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center font-black text-white text-xs">E</div>
            <span className="font-black text-white text-sm">Admin Panel</span>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout