import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowLeft, FiPlus, FiMapPin, FiCreditCard,
  FiTruck, FiCheck, FiEdit2, FiTrash2, FiX
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import Navbar from '../component/Navbar'
import { useCart } from '../context/CartContext'
import { addressService } from '../services/addressService'
import { orderService } from '../services/orderService'

// ── Address Form Modal ───────────────────────────────────────────
const AddressModal = ({ existing, onClose, onSave }) => {
  const [form, setForm] = useState(
    existing ?? { addressLine: '', city: '', state: '', pinCode: '', phone: '', notes: '' }
  )
  const [saving, setSaving] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setSaving(true)
      if (existing) {
        await addressService.updateAddress(existing._id, form)
        toast.success('Address updated')
      } else {
        await addressService.addAddress(form)
        toast.success('Address added')
      }
      onSave()
    } catch {
      toast.error('Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { name: 'addressLine', label: 'Address Line', placeholder: '123 Main Street, Area', full: true },
    { name: 'city',        label: 'City',          placeholder: 'Mumbai'                              },
    { name: 'state',       label: 'State',         placeholder: 'Maharashtra'                         },
    { name: 'pinCode',     label: 'PIN Code',      placeholder: '400001'                              },
    { name: 'phone',       label: 'Phone',         placeholder: '+91 98765 43210'                     },
    { name: 'notes',       label: 'Notes (optional)', placeholder: 'Landmark, floor etc.', full: true },
  ]

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-3xl z-50 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-gray-800">
          <h3 className="font-black text-slate-800 dark:text-white text-lg">
            {existing ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.name} className={f.full ? 'col-span-2' : 'col-span-1'}>
              <label className="block text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{f.label}</label>
              <input
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                required={f.name !== 'notes'}
                placeholder={f.placeholder}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-800 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
              />
            </div>
          ))}

          <div className="col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border-2 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 font-bold py-3 rounded-2xl text-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-amber-500/30 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : existing ? 'Update Address' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

// ── Checkout Page ────────────────────────────────────────────────
const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, cartCount, fetchCart } = useCart()

  const [addresses, setAddresses]       = useState([])
  const [selectedAddr, setSelectedAddr] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [addrLoading, setAddrLoading]   = useState(true)
  const [placing, setPlacing]           = useState(false)
  const [modalData, setModalData]       = useState(null) // null=closed, {}=new, {...}=edit

  const subtotal = cartItems.reduce((s, i) => s + (i.productId?.salePrice ?? 0) * i.quantity, 0)
  const mrpTotal = cartItems.reduce((s, i) => s + (i.productId?.price ?? 0) * i.quantity, 0)
  const savings  = mrpTotal - subtotal

  // Fetch addresses
  const loadAddresses = async () => {
    try {
      setAddrLoading(true)
      const data = await addressService.getAddresses()
      const list = data.payload || []
      setAddresses(list)
      if (list.length > 0 && !selectedAddr) setSelectedAddr(list[0]._id)
    } catch {
      setAddresses([])
    } finally {
      setAddrLoading(false)
    }
  }

  useEffect(() => { loadAddresses() }, [])

  // Redirect if cart empty
  useEffect(() => {
    if (!cartItems.length && cartCount === 0) navigate('/cart')
  }, [cartItems, cartCount, navigate])

  const handleDeleteAddress = async (id) => {
    try {
      await addressService.deleteAddress(id)
      if (selectedAddr === id) setSelectedAddr(null)
      await loadAddresses()
      toast.success('Address removed')
    } catch {
      toast.error('Failed to delete address')
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddr) { toast.error('Please select a delivery address'); return }
    if (!cartItems.length) { toast.error('Your cart is empty'); return }

    // Get cartId from first cart item's parent — we need cart._id
    // The cart context stores raw cart data; fetch it fresh
    try {
      setPlacing(true)
      const { cartService } = await import('../services/cartService')
      const cartData = await cartService.getCart()
      const cartId = cartData.payload?._id

      if (!cartId) { toast.error('Could not retrieve cart'); return }

      const result = await orderService.createOrder({
        cartId,
        addressId: selectedAddr,
        paymentMethod,
      })

      if (paymentMethod === 'Online' && typeof result.payload === 'string') {
        // PayPal redirect URL
        window.location.href = result.payload
        return
      }

      await fetchCart()
      toast.success('Order placed successfully! 🎉')
      navigate('/orders')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      {/* Address modal */}
      {modalData !== null && (
        <AddressModal
          existing={modalData._id ? modalData : null}
          onClose={() => setModalData(null)}
          onSave={async () => { setModalData(null); await loadAddresses() }}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/cart')}
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-slate-200 dark:hover:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-all">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Checkout</h1>
            <p className="text-sm text-slate-400 dark:text-gray-500 mt-0.5">{cartCount} items · ₹{subtotal}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Address + Payment ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Delivery Address */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <FiMapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="font-black text-slate-800 dark:text-white text-sm">Delivery Address</span>
                </div>
                <button onClick={() => setModalData({})}
                  className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
                  <FiPlus className="w-3.5 h-3.5" /> Add New
                </button>
              </div>

              <div className="p-4">
                {addrLoading ? (
                  <div className="space-y-3">
                    {[1,2].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <FiMapPin className="w-8 h-8 text-slate-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-3">No saved addresses</p>
                    <button onClick={() => setModalData({})}
                      className="text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline">
                      Add your first address →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {addresses.map(addr => (
                      <div key={addr._id}
                        onClick={() => setSelectedAddr(addr._id)}
                        className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedAddr === addr._id
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10'
                            : 'border-slate-100 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700'
                        }`}>

                        {/* Radio */}
                        <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                          selectedAddr === addr._id ? 'border-amber-500 bg-amber-500' : 'border-slate-300 dark:border-gray-600'
                        }`}>
                          {selectedAddr === addr._id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">
                            {addr.addressLine}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                            {addr.city}, {addr.state} – {addr.pinCode}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{addr.phone}</p>
                          {addr.notes && (
                            <p className="text-xs text-slate-400 dark:text-gray-600 mt-0.5 italic">{addr.notes}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={e => { e.stopPropagation(); setModalData(addr) }}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-400 hover:text-amber-500 transition-colors">
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); handleDeleteAddress(addr._id) }}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 transition-colors">
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-gray-800">
                <div className="w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <FiCreditCard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="font-black text-slate-800 dark:text-white text-sm">Payment Method</span>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: 'COD',    icon: FiTruck,      label: 'Cash on Delivery',  sub: 'Pay when your order arrives' },
                  { value: 'Online', icon: FiCreditCard,  label: 'Pay Online',        sub: 'Secure payment via PayPal'   },
                ].map(opt => {
                  const Icon = opt.icon
                  return (
                    <div key={opt.value}
                      onClick={() => setPaymentMethod(opt.value)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === opt.value
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10'
                          : 'border-slate-100 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700'
                      }`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        paymentMethod === opt.value ? 'bg-amber-500' : 'bg-slate-100 dark:bg-gray-800'
                      }`}>
                        <Icon className={`w-4 h-4 ${paymentMethod === opt.value ? 'text-white' : 'text-slate-500 dark:text-gray-400'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${paymentMethod === opt.value ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-gray-200'}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-gray-500">{opt.sub}</p>
                      </div>
                      {paymentMethod === opt.value && (
                        <FiCheck className="w-4 h-4 text-amber-500 ml-auto shrink-0" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-5 sticky top-24">
              <h2 className="text-base font-black text-slate-800 dark:text-white mb-4">Order Summary</h2>

              {/* Items list */}
              <div className="space-y-2.5 mb-4 max-h-52 overflow-y-auto">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-gray-800 rounded-xl p-1 shrink-0">
                      <img src={item.productId?.images?.[0]?.url} alt=""
                        className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 truncate">
                        {item.productId?.name}
                      </p>
                      <p className="text-xs text-slate-400">×{item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-gray-200 shrink-0">
                      ₹{(item.productId?.salePrice ?? 0) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-slate-100 dark:border-gray-800 pt-4 space-y-2 text-sm mb-4">
                <div className="flex justify-between text-slate-500 dark:text-gray-400">
                  <span>MRP Total</span>
                  <span>₹{mrpTotal}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>- ₹{savings}</span>
                  </div>
                )}
                <div className="border-t border-slate-100 dark:border-gray-800 pt-2 flex justify-between font-black text-slate-900 dark:text-white text-base">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing || !selectedAddr || !cartItems.length}
                className="w-full bg-amber-500 hover:bg-amber-400 text-white font-black py-3.5 rounded-2xl transition-colors shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {placing ? 'Placing Order...' : paymentMethod === 'Online' ? 'Pay with PayPal' : 'Place Order'}
              </button>

              <p className="text-xs text-slate-400 dark:text-gray-600 text-center mt-3">
                By placing your order, you agree to our terms & conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout