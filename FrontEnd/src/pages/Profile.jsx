import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiPackage,
  FiLogOut, FiArrowLeft, FiPlus, FiEdit2, FiTrash2,
  FiX, FiShield, FiCheck
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import Navbar from '../component/Navbar'
import { UseAuth } from '../context/AuthContext'
import { addressService } from '../services/addressService'

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
      if (existing?._id) {
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
    { name: 'addressLine', label: 'Address Line',       placeholder: '123 Main Street, Area',  full: true  },
    { name: 'city',        label: 'City',               placeholder: 'Mumbai'                               },
    { name: 'state',       label: 'State',              placeholder: 'Maharashtra'                          },
    { name: 'pinCode',     label: 'PIN Code',           placeholder: '400001'                               },
    { name: 'phone',       label: 'Phone',              placeholder: '+91 98765 43210'                      },
    { name: 'notes',       label: 'Notes (optional)',   placeholder: 'Landmark, floor etc.',   full: true  },
  ]

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-3xl z-50 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-gray-800">
          <h3 className="font-black text-slate-800 dark:text-white text-lg">
            {existing?._id ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.name} className={f.full ? 'col-span-2' : ''}>
              <label className="block text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{f.label}</label>
              <input
                name={f.name} value={form[f.name]} onChange={handleChange}
                required={f.name !== 'notes'} placeholder={f.placeholder}
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
              {saving ? 'Saving...' : existing?._id ? 'Update' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

// ── Profile Page ─────────────────────────────────────────────────
const Profile = () => {
  const navigate = useNavigate()
  const { user, logout } = UseAuth()

  const [addresses, setAddresses]   = useState([])
  const [addrLoading, setAddrLoading] = useState(true)
  const [modalData, setModalData]   = useState(null)

  const loadAddresses = async () => {
    try {
      setAddrLoading(true)
      const data = await addressService.getAddresses()
      setAddresses(data.payload || [])
    } catch {
      setAddresses([])
    } finally {
      setAddrLoading(false)
    }
  }

  useEffect(() => { loadAddresses() }, [])

  const handleDelete = async (id) => {
    try {
      await addressService.deleteAddress(id)
      toast.success('Address removed')
      loadAddresses()
    } catch {
      toast.error('Failed to remove address')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Derive initials from username
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      {modalData !== null && (
        <AddressModal
          existing={modalData._id ? modalData : null}
          onClose={() => setModalData(null)}
          onSave={() => { setModalData(null); loadAddresses() }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-slate-200 dark:hover:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-all">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: User card + quick links ── */}
          <div className="space-y-5">

            {/* Avatar card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-amber-500/30 mb-4">
                {initials}
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">{user?.username}</h2>
              <p className="text-sm text-slate-400 dark:text-gray-500 mt-0.5">{user?.email}</p>

              {user?.isVerified && (
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">
                  <FiCheck className="w-3 h-3" /> Verified Account
                </div>
              )}

              <div className="w-full border-t border-slate-100 dark:border-gray-800 mt-5 pt-5 space-y-2">
                {[
                  { icon: FiMail,  label: user?.email,         placeholder: 'Email' },
                  { icon: FiPhone, label: user?.contactNumber, placeholder: 'Phone' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-left">
                    <div className="w-7 h-7 bg-slate-100 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                      <row.icon className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
                    </div>
                    <span className="text-xs text-slate-600 dark:text-gray-400 truncate">
                      {row.label || row.placeholder}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 overflow-hidden">
              {[
                { icon: FiPackage, label: 'My Orders',      action: () => navigate('/orders'),   color: 'text-violet-500' },
                { icon: FiShield,  label: 'Privacy Policy', action: () => {},                    color: 'text-sky-500'    },
              ].map((link, i) => (
                <button key={i} onClick={link.action}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors border-b border-slate-100 dark:border-gray-800 last:border-0">
                  <div className={`w-7 h-7 rounded-lg bg-slate-100 dark:bg-gray-800 flex items-center justify-center`}>
                    <link.icon className={`w-3.5 h-3.5 ${link.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">{link.label}</span>
                  <span className="ml-auto text-slate-300 dark:text-gray-600 text-sm">›</span>
                </button>
              ))}
            </div>

            {/* Logout */}
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 border-2 border-rose-200 dark:border-rose-900/50 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold py-3 rounded-2xl text-sm transition-colors">
              <FiLogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          {/* ── Right: Addresses ── */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <FiMapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="font-black text-slate-800 dark:text-white text-sm">Saved Addresses</span>
                  {addresses.length > 0 && (
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">
                      {addresses.length}
                    </span>
                  )}
                </div>
                <button onClick={() => setModalData({})}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 px-3 py-1.5 rounded-xl transition-colors">
                  <FiPlus className="w-3.5 h-3.5" /> Add New
                </button>
              </div>

              <div className="p-5">
                {addrLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="h-24 bg-slate-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FiMapPin className="w-7 h-7 text-slate-300 dark:text-gray-600" />
                    </div>
                    <h3 className="font-bold text-slate-700 dark:text-gray-300 mb-2">No saved addresses</h3>
                    <p className="text-sm text-slate-400 dark:text-gray-500 mb-5">
                      Add an address to make checkout faster
                    </p>
                    <button onClick={() => setModalData({})}
                      className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-2.5 rounded-2xl text-sm transition-colors shadow-lg shadow-amber-500/30">
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr, i) => (
                      <div key={addr._id}
                        className="flex items-start gap-3 p-4 rounded-2xl border border-slate-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800 transition-colors">

                        {/* Index badge */}
                        <div className="w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-xs font-black text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                          {i + 1}
                        </div>

                        {/* Address info */}
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
                          <button onClick={() => setModalData(addr)}
                            className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-400 hover:text-amber-500 transition-colors">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(addr._id)}
                            className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 transition-colors">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile