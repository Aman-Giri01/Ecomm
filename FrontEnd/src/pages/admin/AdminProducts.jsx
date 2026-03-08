import { useState, useEffect, useRef } from 'react'
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiSearch,
  FiUpload, FiPackage, FiAlertTriangle
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminLayout from '../../component/AdminLayout'
import { adminProductService } from '../../services/adminService'

// ── Product Form Modal ───────────────────────────────────────────
const ProductModal = ({ product, onClose, onSave }) => {
  const isEdit = !!product
  const fileRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(product?.images?.[0]?.url || null)
  const [file, setFile] = useState(null)

  const [form, setForm] = useState({
    name:        product?.name        ?? '',
    description: product?.description ?? '',
    category:    product?.category    ?? '',
    brand:       product?.brand       ?? '',
    price:       product?.price       ?? '',
    salePrice:   product?.salePrice   ?? '',
    stock:       product?.stock       ?? '',
  })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleFile = e => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!isEdit && !file) { toast.error('Please select a product image'); return }

    try {
      setSaving(true)
      if (isEdit) {
        await adminProductService.updateProduct(product._id, form)
        // If new image selected, update image too
        if (file && product.images?.[0]?.public_id) {
          const fd = new FormData()
          fd.append('images', file)
          fd.append('public_id', product.images[0].public_id)
          fd.append('productId', product._id)
          await adminProductService.updateImage(fd)
        }
        toast.success('Product updated')
      } else {
        const fd = new FormData()
        fd.append('images', file)
        Object.entries(form).forEach(([k, v]) => fd.append(k, v))
        await adminProductService.addProduct(fd)
        toast.success('Product added')
      }
      onSave()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { name: 'name',        label: 'Product Name', placeholder: 'e.g. Amul Butter 500g',  full: true  },
    { name: 'category',    label: 'Category',     placeholder: 'e.g. dairy'                           },
    { name: 'brand',       label: 'Brand',        placeholder: 'e.g. Amul'                            },
    { name: 'price',       label: 'MRP (₹)',      placeholder: '199',      type: 'number'             },
    { name: 'salePrice',   label: 'Sale Price (₹)', placeholder: '149',   type: 'number'             },
    { name: 'stock',       label: 'Stock',        placeholder: '50',       type: 'number'             },
    { name: 'description', label: 'Description',  placeholder: 'Describe the product…',  full: true, textarea: true },
  ]

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl z-50 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 rounded-t-3xl">
          <h3 className="font-black text-slate-800 dark:text-white text-lg">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">

          {/* Image upload */}
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Product Image</label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`relative w-full h-36 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors ${
                preview ? 'border-amber-300 dark:border-amber-700' : 'border-slate-200 dark:border-gray-700 hover:border-amber-400'
              }`}
            >
              {preview ? (
                <>
                  <img src={preview} alt="" className="h-full w-full object-contain rounded-2xl p-2" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 rounded-2xl flex items-center justify-center transition-opacity">
                    <p className="text-white text-sm font-semibold flex items-center gap-2"><FiUpload className="w-4 h-4" /> Change Image</p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <FiUpload className="w-6 h-6 text-slate-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Click to upload image</p>
                  <p className="text-xs text-slate-300 dark:text-gray-600 mt-0.5">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>

          {/* Fields */}
          {fields.map(f => (
            <div key={f.name} className={f.full ? 'col-span-2' : ''}>
              <label className="block text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{f.label}</label>
              {f.textarea ? (
                <textarea
                  name={f.name} value={form[f.name]} onChange={handleChange}
                  placeholder={f.placeholder} rows={3} required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-800 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none transition"
                />
              ) : (
                <input
                  type={f.type || 'text'} name={f.name} value={form[f.name]}
                  onChange={handleChange} placeholder={f.placeholder} required
                  min={f.type === 'number' ? 0 : undefined}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-800 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                />
              )}
            </div>
          ))}

          <div className="col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border-2 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 font-bold py-3 rounded-2xl text-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-amber-500/30 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

// ── Delete Confirm ───────────────────────────────────────────────
const DeleteConfirm = ({ product, onClose, onConfirm, deleting }) => (
  <>
    <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
    <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-3xl z-50 shadow-2xl p-6 text-center">
      <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FiAlertTriangle className="w-6 h-6 text-rose-500" />
      </div>
      <h3 className="font-black text-slate-800 dark:text-white text-lg mb-2">Delete Product?</h3>
      <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">
        <span className="font-semibold text-slate-700 dark:text-gray-200">"{product?.name}"</span> will be permanently removed. This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 border-2 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 font-bold py-3 rounded-2xl text-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={deleting}
          className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-2xl text-sm transition-colors disabled:opacity-50">
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </>
)

// ── Admin Products Page ──────────────────────────────────────────
const AdminProducts = () => {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [modalProduct, setModalProduct] = useState(undefined) // undefined=closed, null=new, obj=edit
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]   = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const data = await adminProductService.getProducts()
      setProducts(data.payload || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await adminProductService.deleteProduct(deleteTarget._id)
      toast.success('Product deleted')
      setDeleteTarget(null)
      load()
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>

      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(undefined)}
          onSave={() => { setModalProduct(undefined); load() }}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Products</h1>
            <p className="text-sm text-slate-400 dark:text-gray-500 mt-0.5">{products.length} products total</p>
          </div>
          <button
            onClick={() => setModalProduct(null)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/30 w-fit"
          >
            <FiPlus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-slate-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FiPackage className="w-10 h-10 text-slate-300 dark:text-gray-600 mb-3" />
              <p className="text-slate-500 dark:text-gray-400 text-sm">No products found</p>
              {search && <button onClick={() => setSearch('')} className="text-amber-600 dark:text-amber-400 text-xs mt-2 hover:underline">Clear search</button>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50">
                    {['Product', 'Category', 'Brand', 'MRP', 'Sale Price', 'Stock', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const discount = p.price > p.salePrice ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0
                    return (
                      <tr key={p._id} className="border-b border-slate-50 dark:border-gray-800/50 hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors last:border-0">
                        {/* Product */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 p-1">
                              <img src={p.images?.[0]?.url} alt={p.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 dark:text-gray-100 truncate max-w-[180px]">{p.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-gray-400 capitalize">{p.category}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-gray-400 capitalize">{p.brand}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-gray-300 line-through">₹{p.price}</td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900 dark:text-white">₹{p.salePrice}</span>
                          {discount > 0 && (
                            <span className="ml-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-lg">{discount}%</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                            p.stock === 0 ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                            : p.stock <= 5 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {p.stock === 0 ? 'Out of stock' : `${p.stock} units`}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setModalProduct(p)}
                              className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-400 hover:text-amber-500 transition-colors">
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteTarget(p)}
                              className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 transition-colors">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminProducts