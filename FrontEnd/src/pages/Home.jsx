import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiShoppingCart, FiPlus, FiMinus, FiStar, FiShield, FiRefreshCw, FiCreditCard } from 'react-icons/fi'
import Navbar from '../component/Navbar'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'
import { UseAuth } from '../context/AuthContext'

const CATEGORIES = [
  { label: 'Vegetables',    value: 'vegetables', emoji: '🥦', light: 'bg-emerald-50 border-emerald-100 text-emerald-700',   dark: 'dark:bg-emerald-950/50 dark:border-emerald-900 dark:text-emerald-300' },
  { label: 'Dairy',         value: 'dairy',      emoji: '🥛', light: 'bg-sky-50 border-sky-100 text-sky-700',               dark: 'dark:bg-sky-950/50 dark:border-sky-900 dark:text-sky-300'             },
  { label: 'Snacks',        value: 'munchies',   emoji: '🍿', light: 'bg-amber-50 border-amber-100 text-amber-700',         dark: 'dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-300'       },
  { label: 'Beverages',     value: 'drinks',     emoji: '🥤', light: 'bg-blue-50 border-blue-100 text-blue-700',            dark: 'dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-300'           },
  { label: 'Instant Food',  value: 'instant',    emoji: '🍜', light: 'bg-rose-50 border-rose-100 text-rose-700',            dark: 'dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-300'           },
  { label: 'Tea & Coffee',  value: 'tea',        emoji: '☕', light: 'bg-orange-50 border-orange-100 text-orange-700',     dark: 'dark:bg-orange-950/50 dark:border-orange-900 dark:text-orange-300'    },
  { label: 'Cleaning',      value: 'cleaning',   emoji: '🧹', light: 'bg-cyan-50 border-cyan-100 text-cyan-700',            dark: 'dark:bg-cyan-950/50 dark:border-cyan-900 dark:text-cyan-300'           },
  { label: 'Personal Care', value: 'personal',   emoji: '🧴', light: 'bg-pink-50 border-pink-100 text-pink-700',           dark: 'dark:bg-pink-950/50 dark:border-pink-900 dark:text-pink-300'          },
]

const HERO_SLIDES = [
  {
    tag: 'New Arrivals',
    title: 'Shop the',
    highlight: 'Latest Picks',
    sub: 'Discover thousands of items across every category.',
    gradient: 'from-slate-900 via-slate-800 to-slate-900',
    accentColor: 'text-amber-400',
    btnClass: 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/30',
    blob1: 'bg-amber-500/10',
    blob2: 'bg-orange-500/10',
  },
  {
    tag: 'Best Sellers',
    title: 'Top Rated',
    highlight: 'Products',
    sub: 'Loved and rEliteMartended by thousands of customers.',
    gradient: 'from-slate-900 via-slate-800 to-zinc-900',
    accentColor: 'text-sky-400',
    btnClass: 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/30',
    blob1: 'bg-sky-500/10',
    blob2: 'bg-blue-500/10',
  },
  {
    tag: 'Exclusive Deals',
    title: 'Save More on',
    highlight: 'Every Order',
    sub: 'Exclusive discounts on thousands of products every day.',
    gradient: 'from-zinc-900 via-slate-800 to-slate-900',
    accentColor: 'text-rose-400',
    btnClass: 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/30',
    blob1: 'bg-rose-500/10',
    blob2: 'bg-pink-500/10',
  },
]

// ── Product Card ─────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems } = useCart()
  const { isLoggedIn } = UseAuth()
  const navigate = useNavigate()

  const cartItem = cartItems.find(
    i => (i.productId?._id || i.productId) === product._id
  )
  const qty = cartItem?.quantity || 0
  const discount = product.price > product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0

  const handleAdd = (e) => {
    e.stopPropagation()
    if (!isLoggedIn) { navigate('/login'); return }
    addToCart(product._id)
  }
  const handleRemove = (e) => {
    e.stopPropagation()
    removeFromCart(product._id)
  }

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-950 hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
    >
      <div className="relative bg-slate-50 dark:bg-gray-800 p-3 aspect-square flex items-center justify-center overflow-hidden">
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-black px-1.5 py-0.5 rounded-lg z-10">
            {discount}% OFF
          </span>
        )}
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-3">
        {product.averageReviews > 0 && (
          <div className="flex items-center gap-1 mb-1.5">
            <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs text-slate-500 dark:text-gray-500 font-medium">{product.averageReviews}</span>
          </div>
        )}

        <p className="text-sm font-semibold text-slate-800 dark:text-gray-100 leading-tight line-clamp-2 mb-1 min-h-[2.5rem]">
          {product.name}
        </p>
        <p className="text-xs text-slate-400 dark:text-gray-600 mb-3 capitalize">{product.brand}</p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-slate-900 dark:text-white">₹{product.salePrice}</span>
            {discount > 0 && (
              <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
            )}
          </div>

          {qty === 0 ? (
            <button onClick={handleAdd}
              className="border-2 border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white font-black text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
              ADD
            </button>
          ) : (
            <div className="flex items-center bg-amber-500 rounded-lg overflow-hidden">
              <button onClick={handleRemove} className="text-white px-2 py-1.5 hover:bg-amber-600 transition-colors">
                <FiMinus className="w-3 h-3" />
              </button>
              <span className="text-white font-black text-sm px-1.5 min-w-[1.25rem] text-center">{qty}</span>
              <button onClick={handleAdd} className="text-white px-2 py-1.5 hover:bg-amber-600 transition-colors">
                <FiPlus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ProductSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 overflow-hidden animate-pulse">
    <div className="bg-slate-100 dark:bg-gray-800 aspect-square" />
    <div className="p-3 space-y-2.5">
      <div className="h-3 bg-slate-100 dark:bg-gray-800 rounded-lg w-1/3" />
      <div className="h-4 bg-slate-100 dark:bg-gray-800 rounded-lg w-3/4" />
      <div className="h-3 bg-slate-100 dark:bg-gray-800 rounded-lg w-1/2" />
      <div className="flex justify-between pt-1">
        <div className="h-5 bg-slate-100 dark:bg-gray-800 rounded-lg w-1/4" />
        <div className="h-7 bg-slate-100 dark:bg-gray-800 rounded-lg w-14" />
      </div>
    </div>
  </div>
)

// ── Home ─────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length), 4500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const data = await productService.getProducts()
        setProducts(data.payload || [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const slide = HERO_SLIDES[heroIndex]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-12">

        {/* ── Hero Banner ── */}
        <section className={`relative bg-gradient-to-br ${slide.gradient} rounded-3xl overflow-hidden min-h-[220px] md:min-h-[300px] flex items-center transition-all duration-700`}>
          <div className="relative z-10 px-8 md:px-12 py-12">
            <span className="inline-block bg-white/10 backdrop-blur-sm text-white/70 text-xs font-bold px-3 py-1 rounded-full mb-5 uppercase tracking-widest border border-white/10">
              {slide.tag}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-1">
              {slide.title}
            </h1>
            <h1 className={`text-4xl md:text-5xl font-black ${slide.accentColor} leading-tight mb-5`}>
              {slide.highlight}
            </h1>
            <p className="text-white/40 text-sm mb-8 max-w-sm leading-relaxed">{slide.sub}</p>
            <button
              onClick={() => navigate('/products')}
              className={`${slide.btnClass} text-white font-bold px-7 py-3 rounded-xl transition-colors text-sm flex items-center gap-2 w-fit shadow-lg`}
            >
              Browse All Products <FiArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-8 md:left-12 flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setHeroIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>

          {/* Blobs */}
          <div className={`absolute -right-20 -top-20 w-72 h-72 ${slide.blob1} rounded-full pointer-events-none blur-3xl`} />
          <div className={`absolute right-20 -bottom-16 w-48 h-48 ${slide.blob2} rounded-full pointer-events-none blur-3xl`} />
        </section>

        {/* ── Categories ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Browse by Category</h2>
              <p className="text-sm text-slate-400 dark:text-gray-500 mt-0.5">Find what you're looking for</p>
            </div>
            <button onClick={() => navigate('/products')}
              className="text-amber-600 dark:text-amber-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View all <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => (
              <button key={cat.value} onClick={() => navigate(`/products/${cat.value}`)}
                className={`${cat.light} ${cat.dark} border rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-2 hover:scale-105 hover:shadow-md transition-all duration-200`}>
                <span className="text-2xl sm:text-3xl">{cat.emoji}</span>
                <span className="text-xs font-semibold text-center leading-tight hidden sm:block">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Popular Products ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Popular Products</h2>
              <p className="text-sm text-slate-400 dark:text-gray-500 mt-0.5">Most ordered by our customers</p>
            </div>
            <button onClick={() => navigate('/products')}
              className="text-amber-600 dark:text-amber-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
              See all <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {loading
              ? Array(12).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              : products.slice(0, 12).map(p => <ProductCard key={p._id} product={p} />)
            }
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiShoppingCart className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-gray-400 text-sm">No products available yet.</p>
            </div>
          )}
        </section>

        {/* ── Feature Cards ── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: FiShield,     title: 'Quality Assured',   sub: 'Every product is verified for quality',    bg: 'bg-slate-900 dark:bg-gray-900', accent: 'text-amber-400', iconBg: 'bg-amber-500/15' },
            { icon: FiCreditCard, title: 'Secure Checkout',   sub: 'PayPal & cash on delivery supported',      bg: 'bg-slate-900 dark:bg-gray-900', accent: 'text-sky-400',   iconBg: 'bg-sky-500/15'   },
            { icon: FiRefreshCw,  title: 'Easy Returns',      sub: 'Hassle-free returns, no questions asked',  bg: 'bg-slate-900 dark:bg-gray-900', accent: 'text-rose-400',  iconBg: 'bg-rose-500/15'  },
          ].map(f => {
            const Icon = f.icon
            return (
              <div key={f.title} className={`${f.bg} rounded-2xl p-6 flex items-start gap-4 border border-slate-800`}>
                <div className={`${f.iconBg} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${f.accent}`} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{f.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{f.sub}</p>
                </div>
              </div>
            )
          })}
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="mt-16 bg-slate-900 dark:bg-gray-950 border-t border-slate-800 dark:border-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md shadow-amber-500/30">E</div>
            <span className="font-black text-white text-lg tracking-tight">EliteMart</span>
          </div>
          <p className="text-sm text-slate-500">© 2025 EliteMart · All rights reserved</p>
          <div className="flex gap-5 text-sm text-slate-500">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home