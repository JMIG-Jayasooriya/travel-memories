import React, { useState } from 'react'
import { useTravel } from '../context/TravelContext'
import TravelStats from '../components/TravelStats'

export default function Profile() {
  const { user, stats } = useTravel()
  const [bio, setBio] = useState('Collecting moments, not things.')
  const [editing, setEditing] = useState(false)

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-forest text-cream flex items-center justify-center font-display text-2xl font-semibold">
          {(user?.name || 'T')[0].toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">{user?.name || 'Traveller'}</h1>
          {editing ? (
            <input value={bio} onChange={(e) => setBio(e.target.value)} onBlur={() => setEditing(false)} autoFocus
              className="font-hand text-xl text-forest border-b border-forest/30 focus:outline-none bg-transparent" />
          ) : (
            <button onClick={() => setEditing(true)} className="font-hand text-xl text-forest text-left">"{bio}"</button>
          )}
        </div>
      </div>

      <div className="mt-8"><TravelStats stats={stats} /></div>

      <p className="text-xs text-ink/40 mt-4">Click your bio to edit it. Full profile editing (photo upload, saved trips list) connects to <code>PUT /api/users/{`{id}`}</code> in the backend.</p>
    </div>
  )
}
