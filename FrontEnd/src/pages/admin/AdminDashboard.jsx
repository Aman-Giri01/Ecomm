import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp, FiArrowRight, FiAlertCircle } from 'react-icons/fi'
import AdminLayout from '../../component/AdminLayout'
import { adminProductService, adminOrderService } from '../../services/adminService'

const StatCard = ({ icon: Icon, label, value, sub, color, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-5 ${onClick ? 'cursor-pointer hover:shadow-md dark:hover:shadow-gray-950 hover:-translate-y-0.5 transition-all' : ''}`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {onClick && <FiArrowRight className="w-4 h-4 text-slate-300 dark:text-gray-600" />}
    </div>
    <p className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">{value}</p>
    <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">{label}</p>
    {sub && <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{sub}</p>}
  </div>
)

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const [pData, oData] = await Promise.all([
          adminProductService.getProducts(),
          adminOrderService.getOrders(),
        ])
        setProducts(pData.payload || [])
        setOrders(oData.payload || [])
      } catch {
        setProducts([]); setOrders([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const totalRevenue  = orders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.totalAmount, 0)
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length
  const lowStock      = products.filter(p => p.stock <= 5).length

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const STATUS_COLOR = {
    Pending:    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    Processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    Placed:     'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    Shipped:    'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
    Delivered:  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    Cancelled:  'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 dark:text-gray-500 mt-0.5">Welcome back. Here's what's happening.</p>
        </div>

        {/* Stats grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-5 h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FiPackage}     label="Total Products" value={products.length}  color="bg-amber-500"   onClick={() => navigate('/admin/products')} />
            <StatCard icon={FiShoppingBag} label="Total Orders"   value={orders.length}    color="bg-violet-500"  onClick={() => navigate('/admin/orders')}   />
            <StatCard icon={FiDollarSign}  label="Revenue"        value={`₹${totalRevenue.toLocaleString()}`} sub="From paid orders" color="bg-emerald-500" />
            <StatCard icon={FiTrendingUp}  label="Pending Orders" value={pendingOrders}    color="bg-sky-500"     onClick={() => navigate('/admin/orders')}   />
          </div>
        )}

        {/* Alerts */}
        {!loading && lowStock > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3">
            <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {lowStock} product{lowStock > 1 ? 's' : ''} {lowStock > 1 ? 'are' : 'is'} low on stock (≤ 5 units)
            </p>
            <button onClick={() => navigate('/admin/products')} className="ml-auto text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline whitespace-nowrap">
              View →
            </button>
          </div>
        )}

        {/* Recent orders */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-gray-800">
            <h2 className="font-black text-slate-800 dark:text-white text-sm">Recent Orders</h2>
            <button onClick={() => navigate('/admin/orders')} className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">See all →</button>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-gray-800">
                    {['Order ID', 'Items', 'Amount', 'Payment', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order._id}
                      onClick={() => navigate('/admin/orders')}
                      className="border-b border-slate-50 dark:border-gray-800/50 hover:bg-slate-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors last:border-0">
                      <td className="px-5 py-3 font-mono text-xs text-slate-500 dark:text-gray-400">#{order._id?.slice(-8).toUpperCase()}</td>
                      <td className="px-5 py-3 text-slate-700 dark:text-gray-300">{order.cartItems?.length ?? 0}</td>
                      <td className="px-5 py-3 font-bold text-slate-800 dark:text-white">₹{order.totalAmount}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-gray-400">{order.paymentMethod}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${STATUS_COLOR[order.orderStatus] ?? ''}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400 dark:text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low stock products */}
        {!loading && lowStock > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-gray-800">
              <h2 className="font-black text-slate-800 dark:text-white text-sm">Low Stock Products</h2>
              <button onClick={() => navigate('/admin/products')} className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">Manage →</button>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.filter(p => p.stock <= 5).map(p => (
                <div key={p._id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-gray-800 rounded-xl">
                  <img src={p.images?.[0]?.url} alt={p.name} className="w-10 h-10 object-contain bg-white dark:bg-gray-700 rounded-lg p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 truncate">{p.name}</p>
                    <p className={`text-xs font-bold ${p.stock === 0 ? 'text-rose-500' : 'text-amber-500'}`}>
                      {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard