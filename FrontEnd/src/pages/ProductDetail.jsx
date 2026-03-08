import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft, FiPlus, FiMinus, FiShoppingCart,
  FiStar, FiPackage, FiShield, FiRefreshCw, FiShare2
} from 'react-icons/fi'
import Navbar from '../component/Navbar'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'
import { UseAuth } from '../context/AuthContext'
import { ProductCard } from './ProductsPage'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, removeFromCart, cartItems } = useCart()
  const { isLoggedIn } = UseAuth()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [addedAnim, setAddedAnim] = useState(false)

  const cartItem = product
    ? cartItems.find(i => (i.productId?._id || i.productId) === product._id)
    : null
  const qty = cartItem?.quantity || 0

  const discount = product && product.price > product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0

  // Fetch product
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setActiveImage(0)
        const data = await productService.getProduct(id)
        const p = data.payload
        setProduct(p)

        // Fetch related by same category
        try {
          const relData = await productService.getProducts({ category: p.category })
          setRelated((relData.payload || []).filter(r => r._id !== id).slice(0, 6))
        } catch {
          setRelated([])
        }
      } catch {
        navigate('/404')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, navigate])

  const handleAdd = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    addToCart(product._id)
    setAddedAnim(true)
    setTimeout(() => setAddedAnim(false), 600)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
          <div className="bg-white dark:bg-gray-900 rounded-3xl aspect-square" />
          <div className="space-y-4 py-4">
            <div className="h-4 bg-slate-100 dark:bg-gray-800 rounded-xl w-1/4" />
            <div className="h-8 bg-slate-100 dark:bg-gray-800 rounded-xl w-3/4" />
            <div className="h-6 bg-slate-100 dark:bg-gray-800 rounded-xl w-1/3" />
            <div className="h-24 bg-slate-100 dark:bg-gray-800 rounded-xl" />
            <div className="h-12 bg-slate-100 dark:bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )

  if (!product) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium">
            <FiArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-slate-300 dark:text-gray-700">/</span>
          <button onClick={() => navigate(`/products/${product.category}`)}
            className="text-slate-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors capitalize">
            {product.category}
          </button>
          <span className="text-slate-300 dark:text-gray-700">/</span>
          <span className="text-slate-700 dark:text-gray-300 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* ── Main Product Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">

          {/* ── Image Gallery ── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl border border-slate-100 dark:border-gray-800 overflow-hidden aspect-square flex items-center justify-center p-8">
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-amber-500 text-white font-black px-2.5 py-1 rounded-xl text-sm z-10">
                  {discount}% OFF
                </span>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 flex items-center justify-center z-10 rounded-3xl">
                  <span className="font-bold text-slate-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 px-4 py-2 rounded-xl">
                    Out of Stock
                  </span>
                </div>
              )}
              <img
                src={product.images?.[activeImage]?.url}
                alt={product.name}
                className="w-full h-full object-contain transition-opacity duration-200"
              />

              {/* Share */}
              <button onClick={handleShare}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 hover:text-amber-500 transition-colors">
                <FiShare2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 shrink-0 rounded-xl border-2 overflow-hidden bg-white dark:bg-gray-900 transition-colors ${
                      i === activeImage
                        ? 'border-amber-500'
                        : 'border-slate-200 dark:border-gray-700 hover:border-amber-300'
                    }`}>
                    <img src={img.url} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="py-2">
            {/* Category + Brand */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg capitalize">
                {product.category}
              </span>
              <span className="text-xs text-slate-400 dark:text-gray-500 capitalize">{product.brand}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.averageReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <FiStar
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(product.averageReviews)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-600 dark:text-gray-400">
                  {product.averageReviews} / 5
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black text-slate-900 dark:text-white">₹{product.salePrice}</span>
              {discount > 0 && (
                <>
                  <span className="text-xl text-slate-400 line-through">₹{product.price}</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg">
                    You save ₹{product.price - product.salePrice}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-6 capitalize">
              {product.description}
            </p>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Add to cart */}
            {product.stock > 0 ? (
              qty === 0 ? (
                <button
                  onClick={handleAdd}
                  className={`w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-white font-black py-4 rounded-2xl text-base transition-all shadow-lg shadow-amber-500/30 ${addedAnim ? 'scale-95' : 'scale-100'}`}
                >
                  <FiShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-amber-500 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/30">
                    <button onClick={() => removeFromCart(product._id)}
                      className="text-white px-5 py-4 hover:bg-amber-600 transition-colors text-lg">
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="text-white font-black text-xl px-4 min-w-[3rem] text-center">{qty}</span>
                    <button onClick={handleAdd}
                      className="text-white px-5 py-4 hover:bg-amber-600 transition-colors text-lg">
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => navigate('/cart')}
                    className="flex-1 border-2 border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-bold py-4 rounded-2xl text-sm transition-colors">
                    Go to Cart →
                  </button>
                </div>
              )
            ) : (
              <button disabled
                className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-gray-600 font-bold text-base cursor-not-allowed">
                Out of Stock
              </button>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: FiShield,    label: 'Genuine Product' },
                { icon: FiPackage,   label: 'Safe Packaging' },
                { icon: FiRefreshCw, label: 'Easy Returns'   },
              ].map(b => {
                const Icon = b.icon
                return (
                  <div key={b.label} className="flex flex-col items-center gap-1.5 py-3 px-2 bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 text-center">
                    <Icon className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-gray-400 leading-tight">{b.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">More in {product.category}</h2>
                <p className="text-sm text-slate-400 dark:text-gray-500 mt-0.5 capitalize">Similar {product.category} products</p>
              </div>
              <button onClick={() => navigate(`/products/${product.category}`)}
                className="text-amber-600 dark:text-amber-400 text-sm font-bold hover:underline">
                See all →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}

export default ProductDetail