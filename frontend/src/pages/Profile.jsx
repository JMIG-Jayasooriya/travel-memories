import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import TravelStats from '../components/TravelStats'
import {
  LogOut,
  Mail,
  User as UserIcon,
  Camera,
  Upload,
  Sparkles,
  Trash2,
  Check,
  Edit2,
  Image as ImageIcon,
  Compass,
} from 'lucide-react'

// Curated aesthetic travel preset avatars
const travelAvatars = [
  {
    name: 'Mountain Explorer',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  },
  {
    name: 'Coastal Nomad',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name: 'Sunset Wanderer',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
  },
  {
    name: 'Vintage Backpacker',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
  },
  {
    name: 'Island Dreamer',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
  },
  {
    name: 'Alpine Traveler',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  },
]

export default function Profile() {
  const { user, stats, logout, updateUser } = useTravel()
  const navigate = useNavigate()
  
  const [bio, setBio] = useState(user?.bio || 'Collecting moments, not things.')
  const [editingBio, setEditingBio] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(user?.name || '')
  
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [customUrl, setCustomUrl] = useState('')
  const [feedback, setFeedback] = useState('')
  
  const fileInputRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Handle local file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64Url = event.target?.result
      if (base64Url) {
        updateUser({ avatar: base64Url })
        showFeedbackMessage('Profile picture updated successfully!')
        setShowPhotoModal(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSelectPreset = (url) => {
    updateUser({ avatar: url })
    showFeedbackMessage('Profile avatar updated!')
    setShowPhotoModal(false)
  }

  const handleCustomUrlSubmit = (e) => {
    e.preventDefault()
    if (!customUrl.trim()) return
    updateUser({ avatar: customUrl.trim() })
    setCustomUrl('')
    showFeedbackMessage('Profile picture updated from URL!')
    setShowPhotoModal(false)
  }

  const handleRemovePhoto = () => {
    updateUser({ avatar: null })
    showFeedbackMessage('Profile picture removed.')
    setShowPhotoModal(false)
  }

  const handleSaveBio = () => {
    setEditingBio(false)
    updateUser({ bio })
  }

  const handleSaveName = () => {
    setEditingName(false)
    if (name.trim()) {
      updateUser({ name: name.trim() })
    }
  }

  const showFeedbackMessage = (msg) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(''), 3500)
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto mb-4">
          <UserIcon size={28} />
        </div>
        <h1 className="font-display text-2xl font-semibold">Your Travel Profile</h1>
        <p className="text-ink/60 text-sm mt-2 mb-6">
          Log in to view your travel statistics, manage your memories, and personalize your journal.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="bg-forest text-cream px-6 py-2.5 rounded-full text-sm font-semibold hover:brightness-110 transition"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="bg-paper border border-ink/15 text-ink px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-forest/5 transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-12 pb-24">
      {/* Toast Feedback */}
      {feedback && (
        <div className="mb-6 flex items-center gap-2 p-3.5 bg-forest text-cream rounded-2xl text-xs font-semibold shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
          <Check size={16} className="text-clay" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-paper border border-ink/10 rounded-3xl p-6 sm:p-8 shadow-stamp">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-ink/10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar with Camera Overlay */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-forest/20 shadow-md bg-forest flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-display text-3xl font-bold text-cream">
                    {(user.name || user.email || 'T')[0].toUpperCase()}
                  </span>
                )}
              </div>

              {/* Camera Trigger Button */}
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="absolute inset-0 rounded-full bg-ink/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-cream text-[10px] font-semibold transition-opacity backdrop-blur-[2px]"
                aria-label="Change profile picture"
              >
                <Camera size={20} className="mb-0.5 text-cream" />
                <span>Edit Photo</span>
              </button>

              {/* Mini camera badge */}
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-clay text-cream flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition"
                title="Upload profile picture"
              >
                <Camera size={14} />
              </button>
            </div>

            {/* User Info & Editable Fields */}
            <div className="flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={handleSaveName}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      autoFocus
                      className="font-display text-2xl font-bold text-ink border-b-2 border-forest focus:outline-none bg-transparent"
                    />
                    <button
                      onClick={handleSaveName}
                      className="text-xs font-bold bg-forest text-cream px-2.5 py-1 rounded-full"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <h1
                    onClick={() => {
                      setName(user.name || '')
                      setEditingName(true)
                    }}
                    className="font-display text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2 cursor-pointer hover:text-forest transition group"
                    title="Click to edit name"
                  >
                    <span>{user.name || 'Traveller'}</span>
                    <Edit2 size={14} className="opacity-0 group-hover:opacity-60 transition" />
                  </h1>
                )}
              </div>

              <p className="text-xs text-ink/60 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                <Mail size={12} className="text-forest" /> {user.email}
              </p>

              {/* Bio / Motto */}
              <div className="mt-3">
                {editingBio ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      onBlur={handleSaveBio}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveBio()}
                      autoFocus
                      className="font-hand text-xl text-forest border-b border-forest/30 focus:outline-none bg-transparent w-full"
                    />
                    <button
                      onClick={handleSaveBio}
                      className="text-xs font-bold bg-forest text-cream px-2.5 py-1 rounded-full shrink-0"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingBio(true)}
                    title="Click to edit motto"
                    className="font-hand text-xl text-forest text-left hover:underline underline-offset-4 flex items-center gap-1.5"
                  >
                    <span>"{bio}"</span>
                    <Edit2 size={12} className="opacity-40" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-full transition self-center sm:self-start shrink-0"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>

        {/* Change Picture Quick Action Link */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={() => setShowPhotoModal(true)}
            className="inline-flex items-center gap-1.5 text-forest font-semibold hover:underline"
          >
            <Camera size={14} /> Change Profile Picture
          </button>
          <span className="text-ink/40">Click your name or bio above to edit</span>
        </div>
      </div>

      {/* Journal Overview Stats */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-bold mb-4 text-ink flex items-center gap-2">
          <Compass size={18} className="text-forest" /> Journal Overview
        </h2>
        <TravelStats stats={stats} />
      </div>

      {/* Profile Picture Upload & Avatar Picker Modal */}
      {showPhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowPhotoModal(false)}
        >
          <div
            className="relative bg-paper w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-ink/10 p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title */}
            <div className="flex items-center justify-between pb-4 border-b border-ink/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-forest text-cream flex items-center justify-center">
                  <Camera size={16} />
                </div>
                <h3 className="font-display text-xl font-bold text-ink">
                  Update Profile Picture
                </h3>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="w-8 h-8 rounded-full bg-ink/5 hover:bg-ink/10 text-ink/70 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Current Picture Preview */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-paper shadow-stamp bg-forest flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-display text-3xl font-bold text-cream">
                    {(user.name || user.email || 'T')[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Option 1: Upload from Computer */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                Upload from Device
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-forest hover:bg-forest-dark text-cream font-semibold rounded-2xl shadow-stamp transition text-sm"
              >
                <Upload size={16} />
                <span>Choose Image from Computer</span>
              </button>
              <p className="text-[11px] text-ink/40 text-center mt-1.5">
                Supports JPG, PNG, WEBP files
              </p>
            </div>

            {/* Option 2: Curated Travel Avatars */}
            <div className="mb-6 pt-4 border-t border-ink/10">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-3 flex items-center gap-1.5">
                <Sparkles size={13} className="text-clay" /> Or Choose a Travel Avatar
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {travelAvatars.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(avatar.url)}
                    className="group flex flex-col items-center gap-1.5 text-center"
                    title={avatar.name}
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-ink/10 group-hover:border-forest group-hover:scale-105 transition shadow-sm">
                      <img
                        src={avatar.url}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] text-ink/70 group-hover:text-forest font-medium line-clamp-1">
                      {avatar.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Option 3: Web Image URL */}
            <form onSubmit={handleCustomUrlSubmit} className="pt-4 border-t border-ink/10">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2 flex items-center gap-1.5">
                <ImageIcon size={13} /> Or Paste Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 bg-cream/50 border border-ink/15 rounded-xl px-3.5 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <button
                  type="submit"
                  className="bg-forest text-cream px-4 py-2 rounded-xl text-xs font-bold hover:brightness-110 shrink-0"
                >
                  Apply
                </button>
              </div>
            </form>

            {/* Remove / Reset Photo Button */}
            {user.avatar && (
              <div className="mt-6 pt-4 border-t border-ink/10 text-center">
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition"
                >
                  <Trash2 size={13} /> Remove Photo (Use Initials)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
