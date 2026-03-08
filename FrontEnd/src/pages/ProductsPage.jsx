import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import {
  FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp,
  FiPlus, FiMinus, FiStar, FiSliders, FiShoppingCart
} from 'react-icons/fi'
import Navbar from '../component/Navbar'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'
import { UseAuth } from '../context/AuthContext'

// ── Constants ────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { label: 'Newest First',  value: ''          },
  { label: 'Price: Low → High', value: 'lowToHigh' },
  { label: 'Price: High → Low', value: 'highToLow' },
  { label: 'Name: A → Z',  value: 'aToZ'      },
  { label: 'Name: Z → A',  value: 'zToA'      },
]

const CATEGORY_LIST = [
  { label: 'Vegetables & Fruits', value: 'vegetables' },
  { label: 'Dairy & Breakfast',   value: 'dairy'      },
  { label: 'Snacks',              value: 'munchies'   },
  { label: 'Beverages',           value: 'drinks'     },
  { label: 'Instant Food',        value: 'instant'    },
  { label: 'Tea & Coffee',        value: 'tea'        },
  { label: 'Cleaning',            value: 'cleaning'   },
  { label: 'Personal Care',       value: 'personal'   },
]

// ── Shared ProductCard ───────────────────────────────────────────
export const ProductCard = ({ product }) => {
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
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center z-10">
            <span className="text-xs font-bold text-slate-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-gray-700">Out of Stock</span>
          </div>
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

          {product.stock === 0 ? (
            <span className="text-xs text-slate-400 dark:text-gray-500">Unavailable</span>
          ) : qty === 0 ? (
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
      <div className="h-3 bg-slate-100 dark:bg-gray-800 rounded w-1/3" />
      <div className="h-4 bg-slate-100 dark:bg-gray-800 rounded w-3/4" />
      <div className="h-3 bg-slate-100 dark:bg-gray-800 rounded w-1/2" />
      <div className="flex justify-between pt-1">
        <div className="h-5 bg-slate-100 dark:bg-gray-800 rounded w-1/4" />
        <div className="h-7 bg-slate-100 dark:bg-gray-800 rounded w-14" />
      </div>
    </div>
  </div>
)

// ── Collapsible Filter Section ───────────────────────────────────
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-slate-100 dark:border-gray-800 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="text-sm font-bold text-slate-700 dark:text-gray-200">{title}</span>
        {open
          ? <FiChevronUp className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
          : <FiChevronDown className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />}
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────
const ProductsPage = () => {
  const { category: categoryParam } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // Filter state
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [allBrands, setAllBrands] = useState([])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: categoryParam || '',
    brands: [],
    minPrice: '',
    maxPrice: '',
    sortBy: '',
  })

  // Sync category param changes
  useEffect(() => {
    setFilters(f => ({ ...f, category: categoryParam || '' }))
  }, [categoryParam])

  // Sync search param
  useEffect(() => {
    const s = searchParams.get('search') || ''
    setFilters(f => ({ ...f, search: s }))
  }, [searchParams])

  // Fetch products whenever filters change
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      let data

      if (filters.search) {
        data = await productService.searchProducts(filters.search)
      } else {
        const params = {}
        if (filters.category) params.category = filters.category
        if (filters.brands.length) params.brand = filters.brands.join(',')
        if (filters.minPrice) params.minPrice = filters.minPrice
        if (filters.maxPrice) params.maxPrice = filters.maxPrice
        if (filters.sortBy)   params.sortBy   = filters.sortBy
        data = await productService.getProducts(params)
      }

      const list = data.payload || []
      setProducts(list)

      // Derive brand list from results
      const brands = [...new Set(list.map(p => p.brand).filter(Boolean))]
      setAllBrands(brands)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // ── Handlers ────────────────────────────────────────────────
  const toggleBrand = (brand) => {
    setFilters(f => ({
      ...f,
      brands: f.brands.includes(brand)
        ? f.brands.filter(b => b !== brand)
        : [...f.brands, brand]
    }))
  }

  const toggleCategory = (val) => {
    const next = filters.category === val ? '' : val
    setFilters(f => ({ ...f, category: next }))
    if (next) navigate(`/products/${next}`, { replace: true })
    else      navigate('/products', { replace: true })
  }

  const clearAllFilters = () => {
    setFilters({ search: '', category: '', brands: [], minPrice: '', maxPrice: '', sortBy: '' })
    navigate('/products', { replace: true })
  }

  const activeFilterCount = [
    filters.category,
    ...filters.brands,
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy,
  ].filter(Boolean).length

  // ── Sidebar ──────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="space-y-0">

      {/* Active filters badge */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-gray-800">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
          </span>
          <button onClick={clearAllFilters}
            className="text-xs text-slate-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors font-semibold">
            Clear all
          </button>
        </div>
      )}

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-1.5">
          {CATEGORY_LIST.map(cat => (
            <button key={cat.value} onClick={() => toggleCategory(cat.value)}
              className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors font-medium ${
                filters.category === cat.value
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            className="w-1/2 px-3 py-2 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            className="w-1/2 px-3 py-2 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </FilterSection>

      {/* Brands */}
      {allBrands.length > 0 && (
        <FilterSection title="Brand">
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 custom-scroll">
            {allBrands.map(brand => (
              <label key={brand}
                className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                <div
                  onClick={() => toggleBrand(brand)}
                  className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    filters.brands.includes(brand)
                      ? 'bg-amber-500 border-amber-500'
                      : 'border-slate-300 dark:border-gray-600 group-hover:border-amber-400'
                  }`}>
                  {filters.brands.includes(brand) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => toggleBrand(brand)}
                  className={`text-sm capitalize transition-colors ${
                    filters.brands.includes(brand)
                      ? 'text-amber-600 dark:text-amber-400 font-semibold'
                      : 'text-slate-600 dark:text-gray-400 group-hover:text-slate-800 dark:group-hover:text-gray-200'
                  }`}>
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Top bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {filters.category
                ? CATEGORY_LIST.find(c => c.value === filters.category)?.label || filters.category
                : filters.search
                  ? `Results for "${filters.search}"`
                  : 'All Products'}
            </h1>
            {!loading && (
              <p className="text-sm text-slate-400 dark:text-gray-500 mt-0.5">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Search bar */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                placeholder="Search products..."
                className="pl-9 pr-9 py-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 w-48 sm:w-60"
              />
              {filters.search && (
                <button onClick={() => setFilters(f => ({ ...f, search: '' }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl text-sm text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-gray-300 hover:border-amber-400 transition-colors"
            >
              <FiSliders className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-6">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <FiFilter className="w-4 h-4 text-amber-500" />
                <span className="font-black text-slate-800 dark:text-white text-sm">Filters</span>
              </div>
              <SidebarContent />
            </div>
          </aside>

          {/* ── Products Grid ── */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {Array(12).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-5">
                  <FiShoppingCart className="w-9 h-9 text-slate-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-gray-300 mb-2">No products found</h3>
                <p className="text-sm text-slate-400 dark:text-gray-500 mb-5">Try adjusting your filters or search term</p>
                <button onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl text-sm transition-colors">
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer ── */}
      {mobileSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <FiFilter className="w-4 h-4 text-amber-500" />
                <span className="font-black text-slate-800 dark:text-white">Filters</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                <FiX className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-5">
              <SidebarContent />
            </div>
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-slate-100 dark:border-gray-800 p-4">
              <button onClick={() => setMobileSidebarOpen(false)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                Show {products.length} Results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProductsPage