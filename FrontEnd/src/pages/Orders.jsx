import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiPackage, FiArrowLeft, FiChevronDown, FiChevronUp,
  FiClock, FiTruck, FiCheck, FiX, FiShoppingBag
} from 'react-icons/fi'
import Navbar from '../component/Navbar'
import { UseAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'

// ── Status config ────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending:    { label: 'Pending',    color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-900/20',   icon: FiClock   },
  Processing: { label: 'Processing', color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-900/20',     icon: FiPackage },
  Placed:     { label: 'Placed',     color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: FiCheck   },
  Shipped:    { label: 'Shipped',    color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20', icon: FiTruck   },
  Delivered:  { label: 'Delivered',  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: FiCheck },
  Cancelled:  { label: 'Cancelled',  color: 'text-rose-600 dark:text-rose-400',     bg: 'bg-rose-50 dark:bg-rose-900/20',     icon: FiX       },
}

// ── Order Status Timeline ────────────────────────────────────────
const ORDER_STEPS = ['Placed', 'Processing', 'Shipped', 'Delivered']

const StatusTimeline = ({ status }) => {
  if (status === 'Cancelled') return (
    <div className="flex items-center gap-2 text-rose-500 text-sm font-semibold">
      <FiX className="w-4 h-4" /> Order Cancelled
    </div>
  )

  const currentIdx = ORDER_STEPS.indexOf(status)

  return (
    <div className="flex items-center gap-0">
      {ORDER_STEPS.map((step, i) => {
        const done    = i <= currentIdx
        const current = i === currentIdx
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black transition-colors ${
                done
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'border-slate-200 dark:border-gray-700 text-slate-400'
              } ${current ? 'ring-2 ring-amber-300 ring-offset-1' : ''}`}>
                {done ? <FiCheck className="w-3 h-3" /> : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block whitespace-nowrap ${
                done ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-gray-600'
              }`}>{step}</span>
            </div>
            {i < ORDER_STEPS.length - 1 && (
              <div className={`w-12 sm:w-16 h-0.5 mx-1 transition-colors ${
                i < currentIdx ? 'bg-amber-500' : 'bg-slate-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Order Card ───────────────────────────────────────────────────
const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  const cfg = STATUS_CONFIG[order.orderStatus] ?? STATUS_CONFIG.Pending
  const Icon = cfg.icon
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 overflow-hidden hover:shadow-md dark:hover:shadow-gray-950 transition-shadow">

      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs text-slate-400 dark:text-gray-500 mb-1">Order ID</p>
            <p className="text-xs font-mono font-bold text-slate-600 dark:text-gray-300">
              #{order._id?.slice(-8).toUpperCase()}
            </p>
          </div>

          <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl ${cfg.color} ${cfg.bg}`}>
            <Icon className="w-3 h-3" /> {cfg.label}
          </span>
        </div>

        {/* Timeline */}
        <div className="mb-4 overflow-x-auto pb-1">
          <StatusTimeline status={order.orderStatus} />
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div>
            <span className="text-slate-400 dark:text-gray-500 text-xs">Placed on</span>
            <p className="font-semibold text-slate-700 dark:text-gray-300">{date}</p>
          </div>
          <div>
            <span className="text-slate-400 dark:text-gray-500 text-xs">Items</span>
            <p className="font-semibold text-slate-700 dark:text-gray-300">{order.cartItems?.length ?? 0}</p>
          </div>
          <div>
            <span className="text-slate-400 dark:text-gray-500 text-xs">Payment</span>
            <p className="font-semibold text-slate-700 dark:text-gray-300">
              {order.paymentMethod} · {order.paymentStatus}
            </p>
          </div>
          <div className="ml-auto">
            <span className="text-slate-400 dark:text-gray-500 text-xs">Total</span>
            <p className="text-lg font-black text-slate-900 dark:text-white">₹{order.totalAmount}</p>
          </div>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-gray-800/50 border-t border-slate-100 dark:border-gray-800 text-sm font-semibold text-slate-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
      >
        <span>{expanded ? 'Hide' : 'View'} order details</span>
        {expanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-gray-800">

          {/* Items list */}
          <div className="p-5 space-y-3">
            <p className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wide mb-3">Items Ordered</p>
            {order.cartItems?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  onClick={() => navigate(`/product/${item.productId}`)}
                  className="w-12 h-12 bg-slate-50 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer shrink-0 p-1">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 dark:text-gray-200 truncate">{item.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <span className="text-sm font-black text-slate-800 dark:text-white shrink-0">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery address */}
          {order.addressInfo && (
            <div className="px-5 pb-5 border-t border-slate-100 dark:border-gray-800 pt-4">
              <p className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wide mb-2">Delivery Address</p>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                {order.addressInfo.addressLine}, {order.addressInfo.city},
                {' '}{order.addressInfo.city} – {order.addressInfo.pincode}
              </p>
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{order.addressInfo.phone}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Orders Page ──────────────────────────────────────────────────
const Orders = () => {
  const navigate = useNavigate()
  const { user } = UseAuth()

  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('All')

  const FILTERS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return
      try {
        setLoading(true)
        const data = await orderService.getOrder(user._id)
        const list = Array.isArray(data.payload) ? data.payload : []
        setOrders(list.reverse()) // newest first
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user])

  const filtered = filter === 'All' ? orders : orders.filter(o => o.orderStatus === filter)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-slate-200 dark:hover:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-all">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Orders</h1>
            <p className="text-sm text-slate-400 dark:text-gray-500 mt-0.5">{orders.length} total orders</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                  : 'bg-white dark:bg-gray-900 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700'
              }`}>
              {f}
              {f !== 'All' && orders.filter(o => o.orderStatus === f).length > 0 && (
                <span className={`ml-1.5 text-xs ${filter === f ? 'text-white/80' : 'text-amber-500'}`}>
                  {orders.filter(o => o.orderStatus === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-5 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-4 bg-slate-100 dark:bg-gray-800 rounded w-32" />
                  <div className="h-6 bg-slate-100 dark:bg-gray-800 rounded-xl w-20" />
                </div>
                <div className="h-8 bg-slate-100 dark:bg-gray-800 rounded-xl mb-4" />
                <div className="flex gap-6">
                  {[1,2,3].map(j => <div key={j} className="h-4 bg-slate-100 dark:bg-gray-800 rounded w-20" />)}
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-gray-900 rounded-3xl flex items-center justify-center mb-5 border border-slate-200 dark:border-gray-800">
              <FiShoppingBag className="w-9 h-9 text-slate-300 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-gray-300 mb-2">
              {filter === 'All' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p className="text-sm text-slate-400 dark:text-gray-500 mb-6">
              {filter === 'All' ? 'Start shopping to see your orders here.' : 'Try a different filter.'}
            </p>
            {filter === 'All' && (
              <button onClick={() => navigate('/products')}
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-7 py-3 rounded-2xl text-sm transition-colors shadow-lg shadow-amber-500/30">
                Browse Products
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => <OrderCard key={order._id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders