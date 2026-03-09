import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiSearch, FiShoppingCart, FiUser, FiLogOut,
  FiPackage, FiChevronDown, FiX, FiSun, FiMoon, FiGrid
} from 'react-icons/fi'
import { UseAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { productService } from '../services/productService'

const Navbar = () => {
  const { user,isLoggedIn, logout, loading: authLoading } = UseAuth()
  const { cartCount } = useCart()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)

  const searchRef = useRef(null)
  const userMenuRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (val) => {
    setSearchQuery(val)
    clearTimeout(debounceRef.current)
    if (!val.trim()) { setSearchResults([]); setShowDropdown(false); return }
    debounceRef.current = setTimeout(async () => {
      try {
        setSearching(true)
        const data = await productService.searchProducts(val)
        setSearchResults(data.payload?.slice(0, 6) || [])
        setShowDropdown(true)
      } catch {
        setSearchResults([])
        setShowDropdown(false)
      } finally {
        setSearching(false)
      }
    }, 400)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowDropdown(false)
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    setShowUserMenu(false)
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900 dark:bg-gray-950 border-b border-slate-800 dark:border-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 bg-amber-500 group-hover:bg-amber-400 transition-colors rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md shadow-amber-500/30">
            E
          </div>
          <span className="text-lg font-black text-white hidden sm:block tracking-tight">EliteMart</span>
        </Link>

        {/* Search — desktop */}
        <div ref={searchRef} className="flex-1 relative hidden sm:block">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products, brands..."
                className="w-full pl-9 pr-9 py-2 bg-slate-800 dark:bg-gray-900 border border-slate-700 dark:border-gray-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              />
              {searchQuery && (
                <button type="button"
                  onClick={() => { setSearchQuery(''); setShowDropdown(false) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-2xl overflow-hidden z-50">
              {searching ? (
                <div className="p-4 text-center text-sm text-slate-400">Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((p) => (
                  <button key={p._id}
                    onClick={() => { navigate(`/product/${p._id}`); setShowDropdown(false); setSearchQuery('') }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-gray-800 text-left transition-colors">
                    <img src={p.images?.[0]?.url} alt={p.name}
                      className="w-9 h-9 object-cover rounded-xl bg-slate-100 dark:bg-gray-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-gray-100 truncate">{p.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{p.category}</p>
                    </div>
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400">₹{p.salePrice}</span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-slate-400">No results found</div>
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 ml-auto sm:ml-0 shrink-0">

          {/* Mobile search */}
          <button onClick={() => setMobileSearch(!mobileSearch)}
            className="sm:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <FiSearch className="w-5 h-5" />
          </button>

          {/* Dark mode */}
          <button onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 dark:hover:bg-gray-800 transition-colors"
            title={darkMode ? 'Light mode' : 'Dark mode'}>
            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>

          {/* Cart */}
          <Link to="/cart"
            className="relative flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-3 py-2 rounded-xl transition-colors text-sm font-bold shadow-md shadow-amber-500/20">
            <FiShoppingCart className="w-4 h-4" />
            <span className="hidden sm:block">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {authLoading ? (
            <div className="w-9 h-9 rounded-xl bg-slate-800 animate-pulse" />
          ) : isLoggedIn ? (
            <div ref={userMenuRef} className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 px-2 py-2 rounded-xl hover:bg-slate-800 dark:hover:bg-gray-800 transition-colors">
                <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center shadow-sm">
                  <FiUser className="w-3.5 h-3.5 text-white" />
                </div>
                <FiChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-2xl overflow-hidden z-50">
                  <Link to="/profile" onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-800 text-sm font-medium text-slate-700 dark:text-gray-200 transition-colors">
                    <FiUser className="w-4 h-4 text-slate-400" /> Profile
                  </Link>
                  <Link to="/orders" onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-800 text-sm font-medium text-slate-700 dark:text-gray-200 transition-colors">
                    <FiPackage className="w-4 h-4 text-slate-400" /> My Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-3 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm font-medium text-amber-600 dark:text-amber-400 transition-colors">
                      <FiGrid className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <hr className="border-slate-100 dark:border-gray-800" />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm font-medium text-rose-500 transition-colors">
                    <FiLogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login"
              className="px-3 py-2 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile search */}
      {mobileSearch && (
        <div className="sm:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input autoFocus type="text" value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </form>
        </div>
      )}
    </header>
  )
}

export default Navbar