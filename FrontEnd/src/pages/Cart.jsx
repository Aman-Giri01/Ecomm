import { useNavigate } from 'react-router-dom'
import {
  FiShoppingCart, FiPlus, FiMinus, FiTrash2,
  FiArrowLeft, FiArrowRight, FiTag
} from 'react-icons/fi'
import Navbar from '../component/Navbar'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, cartCount, addToCart, removeFromCart, clearCart, loading } = useCart()

  // ── Helper: safely extract a plain string ID from a cart item ──
  // After populate, item.productId is the full Product object.
  // We need its _id as a plain string for API calls.
  const getProductId = (item) => {
    const p = item.productId
    if (!p) return null
    // If productId was populated it's an object with _id
    if (typeof p === 'object' && p._id) return p._id.toString()
    // If productId is already a plain string / ObjectId
    return p.toString()
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productId?.salePrice ?? 0
    return sum + price * item.quantity
  }, 0)

  const mrpTotal = cartItems.reduce((sum, item) => {
    const price = item.productId?.price ?? 0
    return sum + price * item.quantity
  }, 0)

  const savings = mrpTotal - subtotal

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-4 flex gap-4 animate-pulse">
            <div className="w-20 h-20 bg-slate-100 dark:bg-gray-800 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-100 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-slate-100 dark:bg-gray-800 rounded w-1/3" />
              <div className="h-8 bg-slate-100 dark:bg-gray-800 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-slate-200 dark:hover:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-all">
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Cart</h1>
              <p className="text-sm text-slate-400 dark:text-gray-500 mt-0.5">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <button onClick={clearCart}
              className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-600 dark:text-rose-400 font-semibold transition-colors">
              <FiTrash2 className="w-4 h-4" /> Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-gray-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-200 dark:border-gray-800">
              <FiShoppingCart className="w-10 h-10 text-slate-300 dark:text-gray-600" />
            </div>
            <h2 className="text-xl font-black text-slate-700 dark:text-gray-300 mb-2">Your cart is empty</h2>
            <p className="text-sm text-slate-400 dark:text-gray-500 mb-7 max-w-xs">
              Looks like you haven't added anything yet. Start exploring products!
            </p>
            <button onClick={() => navigate('/products')}
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-lg shadow-amber-500/30">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item, idx) => {
                // ✅ Safe ID extraction — works whether productId is populated or not
                const productId = getProductId(item)

                const product  = item.productId
                const name     = typeof product === 'object' ? (product?.name  ?? 'Unknown product') : 'Unknown product'
                const image    = typeof product === 'object' ? (product?.images?.[0]?.url ?? '') : ''
                const price    = typeof product === 'object' ? (product?.salePrice ?? 0) : 0
                const mrp      = typeof product === 'object' ? (product?.price ?? 0) : 0
                const brand    = typeof product === 'object' ? (product?.brand ?? '') : ''
                const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0

                return (
                  <div key={idx}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-4 flex gap-4 hover:shadow-md dark:hover:shadow-gray-950 transition-shadow">

                    {/* Image */}
                    <div
                      onClick={() => productId && navigate(`/product/${productId}`)}
                      className="w-20 h-20 shrink-0 bg-slate-50 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity p-1">
                      {image
                        ? <img src={image} alt={name} className="w-full h-full object-contain" />
                        : <FiShoppingCart className="w-8 h-8 text-slate-300" />
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p
                            onClick={() => productId && navigate(`/product/${productId}`)}
                            className="text-sm font-semibold text-slate-800 dark:text-gray-100 leading-tight truncate cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                            {name}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-gray-600 mt-0.5 capitalize">{brand}</p>
                        </div>
                        {discount > 0 && (
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-lg shrink-0">
                            {discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Price + Qty */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-slate-900 dark:text-white">₹{price * item.quantity}</span>
                          {discount > 0 && (
                            <span className="text-xs text-slate-400 line-through">₹{mrp * item.quantity}</span>
                          )}
                        </div>

                        {/* Quantity controls — use productId string, never the object */}
                        <div className="flex items-center bg-amber-500 rounded-xl overflow-hidden shadow-sm">
                          <button
                            onClick={() => productId && removeFromCart(productId)}
                            disabled={!productId}
                            className="text-white px-3 py-1.5 hover:bg-amber-600 transition-colors disabled:opacity-40">
                            {item.quantity === 1 ? <FiTrash2 className="w-3.5 h-3.5" /> : <FiMinus className="w-3.5 h-3.5" />}
                          </button>
                          <span className="text-white font-black text-sm px-3 min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => productId && addToCart(productId)}
                            disabled={!productId}
                            className="text-white px-3 py-1.5 hover:bg-amber-600 transition-colors disabled:opacity-40">
                            <FiPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Continue shopping */}
              <button onClick={() => navigate('/products')}
                className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline mt-2">
                <FiArrowLeft className="w-4 h-4" /> Continue Shopping
              </button>
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-5 sticky top-24">
                <h2 className="text-base font-black text-slate-800 dark:text-white mb-5">Order Summary</h2>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-slate-600 dark:text-gray-400">
                    <span>MRP Total ({cartCount} items)</span>
                    <span>₹{mrpTotal}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="flex items-center gap-1"><FiTag className="w-3.5 h-3.5" /> Discount</span>
                      <span>- ₹{savings}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-100 dark:border-gray-800 pt-3 flex justify-between font-black text-slate-900 dark:text-white text-base">
                    <span>Total Payable</span>
                    <span>₹{subtotal}</span>
                  </div>
                </div>

                {savings > 0 && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-xl px-3 py-2 mb-4 text-center">
                    🎉 You're saving ₹{savings} on this order!
                  </div>
                )}

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-white font-black py-3.5 rounded-2xl transition-colors shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 text-sm"
                >
                  Proceed to Checkout <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Cart