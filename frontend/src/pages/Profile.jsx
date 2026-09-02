import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import TravelStats from '../components/TravelStats'
import { LogOut, Mail, User as UserIcon } from 'lucide-react'

export default function Profile() {
  const { user, stats, logout } = useTravel()
  const navigate = useNavigate()
  const [bio, setBio] = useState('Collecting moments, not things.')
  const [editing, setEditing] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto mb-4">
          <UserIcon size={28} />
        </div>
        <h1 className="font-display text-2xl font-semibold">Your Travel Profile</h1>
        <p className="text-ink/60 text-sm mt-2 mb-6">Log in to view your travel statistics, manage your memories, and personalize your journal.</p>
        <div className="flex justify-center gap-3">
          <Link to="/login" className="bg-forest text-cream px-6 py-2.5 rounded-full text-sm font-semibold hover:brightness-110 transition">
            Log In
          </Link>
          <Link to="/register" className="bg-paper border border-ink/15 text-ink px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-forest/5 transition">
            Create Account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-ink/10">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-forest text-cream flex items-center justify-center font-display text-3xl font-semibold shadow-stamp">
            {(user.name || user.email || 'T')[0].toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">{user.name || 'Traveller'}</h1>
            <p className="text-xs text-ink/60 flex items-center gap-1.5 mt-0.5">
              <Mail size={12} /> {user.email}
            </p>
            <div className="mt-2">
              {editing ? (
                <input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  onBlur={() => setEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
                  autoFocus
                  className="font-hand text-xl text-forest border-b border-forest/30 focus:outline-none bg-transparent"
                />
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  title="Click to edit bio"
                  className="font-hand text-xl text-forest text-left hover:underline underline-offset-4"
                >
                  "{bio}"
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-5 py-2.5 rounded-full transition self-start sm:self-center"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold mb-4 text-ink">Journal Overview</h2>
        <TravelStats stats={stats} />
      </div>

      <p className="text-xs text-ink/40 mt-6 text-center sm:text-left">
        Tip: Click your bio text above to personalize your motto.
      </p>
    </div>
  )
}

