import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiMail, FiPhone, FiMapPin, FiPackage,
  FiLogOut, FiArrowLeft, FiPlus, FiEdit2, FiTrash2,
  FiX, FiShield, FiCheck, FiLock, FiEye, FiEyeOff,
  FiAlertCircle, FiSend, FiUser, FiSave
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import Navbar from '../component/Navbar'
import { UseAuth } from '../context/AuthContext'
import { addressService } from '../services/addressService'
import { authService } from '../services/authService'

// ── Edit Profile Modal ─────────────────────────────────────────────────────────
const EditProfileModal = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState({
    username:      user?.username      ?? '',
    contactNumber: user?.contactNumber ?? '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setSaving(true)
      await authService.updateProfile(form)
      toast.success('Profile updated!')
      onSaved()   // refresh user in context then close
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl z-50 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-gray-800">
          <h3 className="font-black text-slate-800 dark:text-white text-lg">Edit Profile</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Username</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required placeholder="johndoe"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-800 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
              />
            </div>
          </div>
          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                value={form.contactNumber}
                onChange={e => setForm(f => ({ ...f, contactNumber: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-800 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
              />
            </div>
          </div>
          {/* Email — read only */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Email <span className="normal-case font-normal text-slate-400">(cannot be changed)</span></label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-gray-600 w-4 h-4" />
              <input
                value={user?.email ?? ''}
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-400 dark:text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border-2 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 font-bold py-3 rounded-2xl text-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-amber-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving...</>
              ) : (
                <><FiSave className="w-4 h-4" />Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

// ── Address Form Modal ─────────────────────────────────────────────────────────
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
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { name: 'addressLine', label: 'Address Line',     placeholder: '123 Main Street, Area', full: true },
    { name: 'city',        label: 'City',             placeholder: 'Mumbai'                             },
    { name: 'state',       label: 'State',            placeholder: 'Maharashtra'                        },
    { name: 'pinCode',     label: 'PIN Code',         placeholder: '400001'                             },
    { name: 'phone',       label: 'Phone',            placeholder: '+91 98765 43210'                    },
    { name: 'notes',       label: 'Notes (optional)', placeholder: 'Landmark, floor etc.', full: true  },
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

// ── Change Password Modal ──────────────────────────────────────────────────────
const ChangePasswordModal = ({ onClose }) => {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving]     = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (password !== confirm) { toast.error('Passwords do not match'); return }
    if (password.length < 5)  { toast.error('Password must be at least 5 characters'); return }
    try {
      setSaving(true)
      await authService.updatePassword({ password })
      toast.success('Password updated successfully')
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl z-50 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-gray-800">
          <h3 className="font-black text-slate-800 dark:text-white text-lg">Change Password</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {['New Password', 'Confirm Password'].map((label, i) => (
            <div key={i}>
              <label className="block text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={i === 0 ? password : confirm}
                  onChange={e => i === 0 ? setPassword(e.target.value) : setConfirm(e.target.value)}
                  required placeholder={i === 0 ? 'Min. 5 characters' : 'Repeat new password'}
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-slate-800 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                />
                {i === 0 && (
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border-2 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 font-bold py-3 rounded-2xl text-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-amber-500/30 transition-colors disabled:opacity-50">
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

// ── Verify Email Modal ─────────────────────────────────────────────────────────
const VerifyEmailModal = ({ email, onClose }) => {
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSend = async () => {
    try {
      setSending(true)
      await authService.resendEmailVerification({ email })
      setSent(true)
      toast.success('Verification email sent!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send verification email')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl z-50 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-gray-800">
          <h3 className="font-black text-slate-800 dark:text-white text-lg">Verify Your Email</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-7 h-7 text-emerald-500" />
              </div>
              <p className="font-bold text-slate-800 dark:text-white mb-1">Email Sent!</p>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl inline-block mt-2 mb-5">{email}</p>
              <div><button onClick={onClose} className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-2.5 rounded-2xl text-sm transition-colors">Done</button></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <FiAlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400">Your account is not yet verified.</p>
              </div>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                We'll send a link to <span className="font-semibold text-slate-700 dark:text-gray-300">{email}</span>
              </p>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose}
                  className="flex-1 border-2 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 font-bold py-3 rounded-2xl text-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSend} disabled={sending}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-amber-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {sending ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sending...</> : <><FiSend className="w-4 h-4" />Send Link</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ── Profile Page ───────────────────────────────────────────────────────────────
const Profile = () => {
  const navigate = useNavigate()
  const { user, logout, loadUser } = UseAuth()

  const [addresses, setAddresses]           = useState([])
  const [addrLoading, setAddrLoading]       = useState(true)
  const [modalData, setModalData]           = useState(null)
  const [showChangePass, setShowChangePass] = useState(false)
  const [showVerify, setShowVerify]         = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  const loadAddresses = async (showLoader = false) => {
    try {
      if (showLoader) setAddrLoading(true)
      const data = await addressService.getAddresses()
      setAddresses(data.payload || [])
    } catch {
      setAddresses([])
    } finally {
      if (showLoader) setAddrLoading(false)
    }
  }

  useEffect(() => { loadAddresses(true) }, [])

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

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : 'U'

  const quickLinks = [
    { icon: FiPackage,      label: 'My Orders',       action: () => navigate('/orders'),       color: 'text-violet-500' },
    { icon: FiEdit2,        label: 'Edit Profile',    action: () => setShowEditProfile(true),  color: 'text-sky-500'    },
    { icon: FiLock,         label: 'Change Password', action: () => setShowChangePass(true),   color: 'text-amber-500'  },
    ...(!user?.isVerified
      ? [{ icon: FiAlertCircle, label: 'Verify Email', action: () => setShowVerify(true),      color: 'text-orange-500' }]
      : []
    ),
    { icon: FiShield,       label: 'Privacy Policy',  action: () => {},                        color: 'text-slate-500'  },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      {/* Modals */}
      {showEditProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSaved={async () => {
            await loadUser()              // refresh user in context
            setShowEditProfile(false)
          }}
        />
      )}
      {modalData !== null && (
        <AddressModal
          existing={modalData._id ? modalData : null}
          onClose={() => setModalData(null)}
          onSave={async () => { await loadAddresses(); setModalData(null) }}
        />
      )}
      {showChangePass && <ChangePasswordModal onClose={() => setShowChangePass(false)} />}
      {showVerify && <VerifyEmailModal email={user?.email} onClose={() => setShowVerify(false)} />}

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-slate-200 dark:hover:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-all">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Profile</h1>
        </div>

        {/* Unverified banner */}
        {user && !user.isVerified && (
          <div className="mb-5 flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3">
            <FiAlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400 flex-1">Your email is not verified.</p>
            <button onClick={() => setShowVerify(true)}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap">
              Verify Now
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left ── */}
          <div className="space-y-5">

            {/* Avatar card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-6 flex flex-col items-center text-center">
              {/* Avatar + edit button */}
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-amber-500/30">
                  {initials}
                </div>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="absolute -bottom-2 -right-2 w-7 h-7 bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-slate-500 hover:text-amber-500 hover:border-amber-400 transition-colors shadow-sm"
                  title="Edit profile"
                >
                  <FiEdit2 className="w-3 h-3" />
                </button>
              </div>

              <h2 className="text-lg font-black text-slate-900 dark:text-white">{user?.username ?? '—'}</h2>
              <p className="text-sm text-slate-400 dark:text-gray-500 mt-0.5">{user?.email ?? '—'}</p>

              {user?.isVerified ? (
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">
                  <FiCheck className="w-3 h-3" /> Verified Account
                </div>
              ) : (
                <button onClick={() => setShowVerify(true)}
                  className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 px-2.5 py-1 rounded-lg transition-colors">
                  <FiAlertCircle className="w-3 h-3" /> Not Verified — Tap to verify
                </button>
              )}

              <div className="w-full border-t border-slate-100 dark:border-gray-800 mt-5 pt-5 space-y-2">
                {[
                  { icon: FiMail,  label: user?.email,         placeholder: 'Email not set'  },
                  { icon: FiPhone, label: user?.contactNumber, placeholder: 'Phone not set'  },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-left">
                    <div className="w-7 h-7 bg-slate-100 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                      <row.icon className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
                    </div>
                    <span className="text-xs text-slate-600 dark:text-gray-400 truncate">
                      {row.label || <span className="italic text-slate-300 dark:text-gray-600">{row.placeholder}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 overflow-hidden">
              {quickLinks.map((link, i) => (
                <button key={i} onClick={link.action}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors border-b border-slate-100 dark:border-gray-800 last:border-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                    <link.icon className={`w-3.5 h-3.5 ${link.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">{link.label}</span>
                  <span className="ml-auto text-slate-300 dark:text-gray-600 text-sm">›</span>
                </button>
              ))}
            </div>

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
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">{addresses.length}</span>
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
                    {[1, 2].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FiMapPin className="w-7 h-7 text-slate-300 dark:text-gray-600" />
                    </div>
                    <h3 className="font-bold text-slate-700 dark:text-gray-300 mb-2">No saved addresses</h3>
                    <p className="text-sm text-slate-400 dark:text-gray-500 mb-5">Add an address to make checkout faster</p>
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
                        <div className="w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-xs font-black text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">{addr.addressLine}</p>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{addr.city}, {addr.state} – {addr.pinCode}</p>
                          <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{addr.phone}</p>
                          {addr.notes && <p className="text-xs text-slate-400 dark:text-gray-600 mt-0.5 italic">{addr.notes}</p>}
                        </div>
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