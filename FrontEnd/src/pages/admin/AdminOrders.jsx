import { useState, useEffect } from 'react'
import {
  FiSearch, FiChevronDown, FiChevronUp, FiShoppingBag,
  FiCheck, FiClock, FiTruck, FiX, FiPackage
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminLayout from '../../component/AdminLayout'
import { adminOrderService } from '../../services/adminService'

const STATUS_OPTIONS = ['Pending', 'Processing', 'Placed', 'Shipped', 'Delivered', 'Cancelled']

const STATUS_CONFIG = {
  Pending:    { color: 'text-amber-700 dark:text-amber-400',   bg: 'bg-amber-100 dark:bg-amber-900/30',   icon: FiClock   },
  Processing: { color: 'text-blue-700 dark:text-blue-400',     bg: 'bg-blue-100 dark:bg-blue-900/30',     icon: FiPackage },
  Placed:     { color: 'text-indigo-700 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30', icon: FiCheck   },
  Shipped:    { color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30', icon: FiTruck   },
  Delivered:  { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: FiCheck },
  Cancelled:  { color: 'text-rose-700 dark:text-rose-400',     bg: 'bg-rose-100 dark:bg-rose-900/30',     icon: FiX       },
}

// ── Order Row ────────────────────────────────────────────────────
const OrderRow = ({ order, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [localStatus, setLocalStatus] = useState(order.orderStatus)

  const cfg = STATUS_CONFIG[localStatus] ?? STATUS_CONFIG.Pending
  const Icon = cfg.icon

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true)
      await adminOrderService.updateOrderStatus(order._id, newStatus)
      setLocalStatus(newStatus)
      onStatusChange(order._id, newStatus)
      toast.success(`Status updated to ${newStatus}`)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className="border-b border-slate-100 dark:border-gray-800 last:border-0">
      {/* Main row */}
      <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">

        {/* Order id + date */}
        <div className="min-w-0 w-32 shrink-0">
          <p className="font-mono text-xs font-bold text-slate-600 dark:text-gray-300">#{order._id?.slice(-8).toUpperCase()}</p>
          <p className="text-xs text-slate-400 mt-0.5">{date}</p>
        </div>

        {/* Items count + amount */}
        <div className="flex-1 hidden sm:block">
          <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">
            {order.cartItems?.length ?? 0} item{order.cartItems?.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-slate-400">{order.paymentMethod} · {order.paymentStatus}</p>
        </div>

        {/* Total */}
        <div className="font-black text-slate-900 dark:text-white text-sm w-20 shrink-0">
          ₹{order.totalAmount}
        </div>

        {/* Status dropdown */}
        <div className="shrink-0">
          <select
            value={localStatus}
            onChange={e => handleStatusChange(e.target.value)}
            disabled={updating}
            className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-60 ${cfg.bg} ${cfg.color}`}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Expand */}
        <button onClick={() => setExpanded(e => !e)}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-400 transition-colors shrink-0">
          {expanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 bg-slate-50/50 dark:bg-gray-800/20 grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Items */}
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wide mb-3">Items Ordered</p>
            <div className="space-y-2">
              {order.cartItems?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl p-1 border border-slate-100 dark:border-gray-700 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400">Qty {item.quantity} × ₹{item.price}</p>
                  </div>
                  <span className="text-xs font-black text-slate-700 dark:text-gray-300">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Address + payment */}
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wide mb-3">Delivery Info</p>
            {order.addressInfo ? (
              <div className="text-xs text-slate-600 dark:text-gray-400 space-y-0.5">
                <p className="font-semibold text-slate-700 dark:text-gray-300">{order.addressInfo.addressLine}</p>
                <p>{order.addressInfo.city} – {order.addressInfo.pincode}</p>
                <p>{order.addressInfo.phone}</p>
              </div>
            ) : <p className="text-xs text-slate-400">No address info</p>}

            <p className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wide mt-4 mb-2">Payment</p>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${STATUS_CONFIG[order.paymentStatus] ? `${STATUS_CONFIG[order.paymentStatus]?.bg} ${STATUS_CONFIG[order.paymentStatus]?.color}` : 'bg-slate-100 dark:bg-gray-800 text-slate-500'}`}>
                {order.paymentStatus}
              </span>
              <span className="text-xs text-slate-500 dark:text-gray-400">via {order.paymentMethod}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Admin Orders Page ────────────────────────────────────────────
const AdminOrders = () => {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const load = async () => {
    try {
      setLoading(true)
      const data = await adminOrderService.getOrders()
      const list = Array.isArray(data.payload) ? data.payload : []
      setOrders(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: newStatus } : o))
  }

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'All' || o.orderStatus === filterStatus
    const matchSearch = !search || o._id?.slice(-8).toUpperCase().includes(search.toUpperCase())
    return matchStatus && matchSearch
  })

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.orderStatus === s).length
    return acc
  }, {})

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-400 dark:text-gray-500 mt-0.5">{orders.length} total orders</p>
        </div>

        {/* Filter tabs + search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
            {['All', ...STATUS_OPTIONS].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  filterStatus === s
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                    : 'bg-white dark:bg-gray-900 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-800 hover:border-amber-300'
                }`}>
                {s}
                {s !== 'All' && counts[s] > 0 && (
                  <span className={`ml-1 ${filterStatus === s ? 'text-white/80' : 'text-amber-500'}`}>
                    {counts[s]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative shrink-0">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search order ID..."
              className="pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 w-48"
            />
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 overflow-hidden">

          {/* Table header */}
          <div className="flex items-center gap-4 px-5 py-3 border-b border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50">
            <div className="w-32 shrink-0 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">Order</div>
            <div className="flex-1 hidden sm:block text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">Details</div>
            <div className="w-20 shrink-0 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">Amount</div>
            <div className="shrink-0 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">Status</div>
            <div className="w-8 shrink-0" />
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FiShoppingBag className="w-10 h-10 text-slate-300 dark:text-gray-600 mb-3" />
              <p className="text-slate-500 dark:text-gray-400 text-sm">No orders found</p>
            </div>
          ) : (
            filtered.map(order => (
              <OrderRow key={order._id} order={order} onStatusChange={handleStatusChange} />
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminOrders